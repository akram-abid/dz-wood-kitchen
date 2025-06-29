import { FastifyRequest, FastifyReply } from "fastify";
import { authService } from "../services/auth.service";
import { dbDrizzle as db } from "../database/db";
import { users } from "../database/schema";
import { eq } from "drizzle-orm";
import {
  SignupRequest,
  LoginRequest,
  UpdateUserBody,
  GrantSessionData,
} from "../dtos/auth.dtos";

export async function signupController(
  req: SignupRequest,
  reply: FastifyReply,
) {
  try {
    const data = req.body;
    const result = await authService.signup(data);

    req.log.info("Signup controller: user registered", {
      userId: result.user.id,
    });

    return reply.code(201).send({
      message: "Signup successful",
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (err: any) {
    req.log.error("Signup controller error", { error: err.message });

    const statusCode = err.message.includes("already exists") ? 409 : 500;

    return reply.code(statusCode).send({
      message: err.message || "Internal server error",
    });
  }
}

export async function loginController(req: LoginRequest, reply: FastifyReply) {
  try {
    const data = req.body;
    const result = await authService.login(data);

    req.log.info("Login controller: user logged in", {
      userId: result.user.id,
    });

    return reply
      .setCookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 4,
      })
      .setCookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      })
      .code(200)
      .send({
        message: "Login successful",
        user: result.user,
        accessToken: result.accessToken,
      });
  } catch (err: any) {
    req.log.error("Login controller error", { error: err.message });

    const statusCode = err.message.includes("Invalid credentials") ? 401 : 500;

    return reply.code(statusCode).send({
      message: err.message || "Internal server error",
    });
  }
}

export async function googleCallback(req: FastifyRequest, reply: FastifyReply) {
  try {
    // Grant stores OAuth data in req.session.grant
    const grantData = (req.session as any).grant as GrantSessionData;

    if (!grantData?.response) {
      return reply.status(401).send({ error: "Authentication failed" });
    }

    // For Google, the user data is in the raw response
    let raw;
    try {
      raw = JSON.parse(grantData.response.raw || "{}");
    } catch (parseError) {
      return reply.status(400).send({ error: "Invalid OAuth response format" });
    }

    // Validate required fields
    if (!raw.sub || !raw.email) {
      return reply.status(400).send({
        error: "Missing required profile data",
        message: "Google profile must include ID and email",
      });
    }

    const profile = {
      id: raw.sub,
      email: raw.email,
      firstName: raw.given_name || "",
      lastName: raw.family_name || "",
      provider: "google" as const,
    };

    const result = await authService.oauthLogin(profile);

    // Clear grant data from session
    delete (req.session as any).grant;

    return reply
      .setCookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 4,
      })
      .setCookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      })
      .code(200)
      .send({
        message: "Login successful",
        user: result.user,
      });
  } catch (error) {
    console.error("Google OAuth error:", error);
    return reply.status(500).send({ error: "OAuth login failed" });
  }
}

export async function facebookCallback(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const grantData = (req.session as any).grant as GrantSessionData;

    if (!grantData?.response) {
      return reply.status(401).send({ error: "Authentication failed" });
    }

    let raw;
    try {
      raw = JSON.parse(grantData.response.raw || "{}");
    } catch (parseError) {
      return reply.status(400).send({ error: "Invalid OAuth response format" });
    }

    // Validate required fields
    if (!raw.id || !raw.email) {
      return reply.status(400).send({
        error: "Missing required profile data",
        message: "Facebook profile must include ID and email",
      });
    }

    const profile = {
      id: raw.id,
      email: raw.email,
      firstName: raw.first_name || "",
      lastName: raw.last_name || "",
      provider: "facebook" as const,
    };

    const result = await authService.oauthLogin(profile);

    // Clear grant data from session
    delete (req.session as any).grant;
    return reply
      .setCookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 4,
      })
      .setCookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      })
      .code(200)
      .send({
        message: "Login successful",
        user: result.user,
      });
  } catch (error) {
    console.error("Facebook OAuth error:", error);
    return reply.status(500).send({ error: "OAuth login failed" });
  }
}

export const updateUserInfoHandler = async (
  req: FastifyRequest<{ Body: UpdateUserBody }>,
  reply: FastifyReply,
) => {
  const userId = req.ctx.user?.userId!;

  const { fullName, email, phoneNumber } = req.body;

  const updateFields: Partial<UpdateUserBody> = {};
  if (fullName) updateFields.fullName = fullName;
  if (email) updateFields.email = email;
  if (phoneNumber) updateFields.phoneNumber = phoneNumber;

  if (Object.keys(updateFields).length === 0) {
    return reply.code(400).send({
      success: false,
      message: "No fields provided to update",
    });
  }

  try {
    await db
      .update(users)
      .set({ ...updateFields, updatedAt: new Date() })
      .where(eq(users.id, userId));

    return reply.send({
      success: true,
      message: "User profile updated successfully",
    });
  } catch (err) {
    req.log.error("Update user failed:", err);
    return reply.code(500).send({
      success: false,
      message: "Failed to update user",
    });
  }
};
