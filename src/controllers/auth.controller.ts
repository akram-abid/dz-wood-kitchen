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
import * as APIError from "../utils/errors";
import { handleControllerError } from "../utils/errors-handler";

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

    reply.status(201);

    return {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  } catch (err: any) {
    handleControllerError(err, "sign up", req.log);
  }
}

export async function loginController(req: LoginRequest, reply: FastifyReply) {
  try {
    const data = req.body;
    const result = await authService.login(data);

    req.log.info("Login controller: user logged in", {
      userId: result.user.id,
    });

    reply
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
      .status(200);

    // for curl testing
    return {
      message: "Login successful",
      user: result.user,
      accessToken: result.accessToken,
    };
  } catch (err: any) {
    handleControllerError(err, "login", req.log);
  }
}

export async function googleCallback(req: FastifyRequest, reply: FastifyReply) {
  try {
    // Grant stores OAuth data in req.session.grant
    const grantData = (req.session as any).grant as GrantSessionData;

    if (!grantData?.response) {
      throw new APIError.UnauthorizedError("Authentication failed");
    }

    // For Google, the user data is in the raw response
    let raw;
    try {
      raw = JSON.parse(grantData.response.raw || "{}");
    } catch (parseError) {
      throw new APIError.ConflictError("Oauth parse error");
    }

    // Validate required fields
    if (!raw.sub || !raw.email) {
      throw new APIError.BadRequestError(
        "Missing required profile data, Google profile must include ID and email",
      );
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

    reply
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
      .status(200);

    // for curl testing
    return {
      message: "Login successful",
      user: result.user,
    };
  } catch (error) {
    handleControllerError(error, "google oauth", req.log);
  }
}

export async function facebookCallback(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const grantData = (req.session as any).grant as GrantSessionData;

    if (!grantData?.response) {
      throw new APIError.UnauthorizedError("Authentication failed");
    }

    let raw;
    try {
      raw = JSON.parse(grantData.response.raw || "{}");
    } catch (parseError) {
      throw new APIError.ConflictError("Oauth parse error");
    }

    // Validate required fields
    if (!raw.id || !raw.email) {
      throw new APIError.BadRequestError(
        "Missing required profile data, Facebook profile must include ID and email",
      );
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
    reply
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
      .status(200);

    return {
      message: "Login successful",
      user: result.user,
    };
  } catch (error) {
    handleControllerError(error, "facebook oauth", req.log);
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
    throw new APIError.BadRequestError("No fields provided to update");
  }

  try {
    await db
      .update(users)
      .set({ ...updateFields, updatedAt: new Date() })
      .where(eq(users.id, userId));

    reply.status(200);

    return {
      success: true,
      message: "User profile updated successfully",
    };
  } catch (err) {
    handleControllerError(err, "update user data", req.log);
  }
};
