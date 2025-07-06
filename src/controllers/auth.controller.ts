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
import jwt from "jsonwebtoken";
import { generateUrl, generateToken } from "../utils/jwt-utils";

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

    const token = generateToken(
      result.user.email,
      result.user.id,
      "email_verification",
    );
    const verifyLink = generateUrl(token, "verify-email");

    const messageResult = await req.server.mailer.sendTemplate(
      "welcome",
      result.user.email,
      {
        name: result.user.fullName,
        verifyLink,
        company: process.env.DOMAIN,
      },
      "verify your email",
    );

    reply.status(201);

    return {
      user: result.user,
      email: "verify email",
      message: messageResult,
      accessToken: result.accessToken,
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

    reply.status(200);

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
    if (!req.session) {
      throw new APIError.UnauthorizedError(
        "Session not found. Please try logging in again.",
      );
    }

    const grantData = (req.session as any).grant as GrantSessionData;
    if (!grantData?.response) {
      throw new APIError.UnauthorizedError(
        "Authentication failed - no grant data",
      );
    }

    let userProfile;

    if (grantData.response.id_token) {
      // Primary method: Use id_token when available
      const profile = jwt.decode(grantData.response.id_token) as any;
      req.log.info("Using id_token for profile:", profile);

      if (!profile.sub || !profile.email) {
        throw new APIError.BadRequestError(
          "Missing required profile data, Google profile must include ID and email",
        );
      }

      userProfile = {
        id: profile.sub,
        email: profile.email,
        firstName: profile.given_name || "",
        lastName: profile.family_name || "",
        provider: "google" as const,
      };
    } else if (grantData.response.access_token) {
      // Fallback method: Use access_token to fetch user info
      req.log.info("No id_token found, using access_token to fetch profile");

      const response = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${grantData.response.access_token}`,
          },
        },
      );

      if (!response.ok) {
        throw new APIError.BadRequestError(
          "Failed to fetch user info from Google",
        );
      }

      const profile = await response.json();
      req.log.info("Fetched profile using access_token:", profile);

      if (!profile.id || !profile.email) {
        throw new APIError.BadRequestError(
          "Missing required profile data from Google userinfo endpoint",
        );
      }

      userProfile = {
        id: profile.id,
        email: profile.email,
        firstName: profile.given_name || "",
        lastName: profile.family_name || "",
        provider: "google" as const,
      };
    } else {
      throw new APIError.BadRequestError(
        "No valid token found in Google OAuth response",
      );
    }

    const result = await authService.oauthLogin(userProfile);

    // Clear grant session data
    delete (req.session as any).grant;

    return reply.redirect(
      `https://dzwoodkitchen.com/login/success?token=${result.accessToken}`,
    );
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
    reply.status(200);

    return {
      message: "Login successful",
      user: result.user,
      accessToken: result.accessToken,
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
    return { updated: fullName };
  } catch (err) {
    handleControllerError(err, "update user data", req.log);
  }
};

export const getUserInfoHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const userId = req.ctx.user?.userId!;

  try {
    const user = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        isEmailVerified: users.isEmailVerified,
        phoneNumber: users.phoneNumber,
        createdAt: users.createdAt,

        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user.length === 0) {
      throw new APIError.NotFoundError("user not found");
    }

    reply.status(200);
    return { user: user[0] };
  } catch (err) {
    handleControllerError(err, "get user data", req.log);
  }
};
