import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import * as APIError from "../utils/errors";
import { dbDrizzle as db } from "../database/db";
import { users } from "../database/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { handleControllerError } from "../utils/errors-handler";
import { generateUrl, generateToken } from "../utils/jwt-utils";

// schema to validate email
const resetPasswordReq = z.object({
  email: z.string().email(),
});

/**
 * 1. Request password reset (send email)
 */
export const requestResetPassword = async (
  request: FastifyRequest<{ Body: { email: string } }>,
  reply: FastifyReply,
) => {
  try {
    const { email } = resetPasswordReq.parse(request.body);

    const user = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      reply.code(404);
      throw new APIError.NotFoundError("User not found");
    }

    const userId = user[0].id;
    const token = generateToken(email, userId, "password_reset");
    const resetUrl = generateUrl(token, "reset-password");

    // Send reset email
    const result = await request.server.mailer.sendTemplate(
      "reset",
      email,
      {
        name: user[0].fullName,
        resetLink: resetUrl,
      },
      "Reset your password",
    );

    request.server.log.info(`Password reset email sent to ${email}`);

    reply.status(200);
    return userId;
  } catch (err) {
    handleControllerError(err, "request reset password", request.log);
  }
};

/**
 * 2. Verify reset token (optional step if you want to validate token before rendering reset UI)
 */
export const verifyResetToken = async (
  request: FastifyRequest<{ Querystring: { token: string } }>,
  reply: FastifyReply,
) => {
  try {
    const { token } = request.query;
    if (!token) {
      throw new APIError.BadRequestError("Token is required");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    if (decoded.type !== "password_reset") {
      throw new APIError.BadRequestError("Invalid token type");
    }

    reply.status(200);
    return { email: decoded.email, userId: decoded.userId };
  } catch (err) {
    handleControllerError(err, "verify token", request.log);
  }
};

/**
 * 3. Reset password using token
 */

export const resetPassword = async (
  request: FastifyRequest<{
    Body: {
      token: string;
      newPassword: string;
    };
  }>,
  reply: FastifyReply,
) => {
  try {
    const { token, newPassword } = request.body;

    if (!token || !newPassword) {
      throw new APIError.BadRequestError("Token and new password are required");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    if (decoded.type !== "password_reset") {
      throw new APIError.BadRequestError("Invalid token type");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, decoded.userId));

    request.server.log.info("Password reset successful", {
      userId: decoded.userId,
      timestamp: new Date().toISOString(),
    });

    reply.status(200);
    return { reset: "done" };
  } catch (err) {
    handleControllerError(err, "reset password", request.log);
  }
};
