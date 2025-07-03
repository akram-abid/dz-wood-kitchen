import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import * as APIError from "../utils/errors";
import { handleControllerError } from "../utils/errors-handler";
import { dbDrizzle as db } from "../database/db";
import { users } from "../database/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { generateUrl, generateToken } from "../utils/jwt-utils";

// Interface for verify email request
const VerifyEmailRequest = z.object({
  token: z.string(),
});

const resendEmail = z.object({
  email: z.string().email(),
});

// Verify email with token
export const verifyEmail = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { token } = VerifyEmailRequest.parse(request.body);

    if (!token) {
      reply.code(400);
      throw new APIError.BadRequestError("Token is required");
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (jwtError) {
      reply.code(400);
      throw new APIError.BadRequestError(
        "Invalid or expired verification token",
      );
    }

    request.log.info("========== DEBUG TYPE ============");
    request.log.info(decoded);

    if (decoded.type !== "email_verification") {
      reply.code(400);
      throw new APIError.BadRequestError("Invalid token type");
    }

    const tokenAge = Date.now() - decoded.timestamp;
    const maxAge = 24 * 60 * 60 * 1000;

    if (tokenAge > maxAge) {
      reply.code(400);
      throw new APIError.BadRequestError("Verification token has expired");
    }

    await db
      .update(users)
      .set({ isEmailVerified: true })
      .where(eq(users.id, decoded.userId));

    // Log successful verification
    request.server.log.info(
      `Email verified successfully for ${decoded.email}`,
      {
        userId: decoded.userId,
        timestamp: new Date().toISOString(),
      },
    );

    reply.status(200);

    return {
      userId: decoded.userId,
      email: decoded.email,
      verifiedAt: new Date().toISOString(),
    };
  } catch (error) {
    handleControllerError(error, "email verification", request.log);
  }
};

export const resendVerifyEmail = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const email = request.ctx.user?.email!;
    const user = await db.select().from(users).where(eq(users.email, email));

    const newToken = generateToken(
      user[0].email,
      user[0].id,
      "email_verification",
    );
    const verifyLink = generateUrl(newToken, "verify-email");

    const messageResult = await request.server.mailer.sendTemplate(
      "welcome",
      user[0].email,
      {
        name: user[0].fullName,
        verifyLink,
        company: process.env.DOMAIN,
      },
      "verify your email",
    );

    reply.status(201);

    return {
      email: "verify email",
      message: messageResult,
    };
  } catch (error) {
    handleControllerError(error, "email verification", request.log);
  }
};
