import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { dbDrizzle as db } from "../database/db";
import { users } from "../database/schema";
import { loadConfig } from "../utils/conf";
import { logger } from "../utils/logger";
import { SignupData, LoginData, OAuthProfile } from "../dtos/auth.dtos";
const config = loadConfig();

export class AuthService {
  private generateTokens(
    userId: string,
    email: string,
    role: string,
    name: string,
    isEmailVerified: boolean,
  ) {
    const accessToken = jwt.sign(
      { userId, type: "access", email, role, name, isEmailVerified },
      config.JWT_SECRET,
      { expiresIn: "4d" },
    );

    const refreshToken = jwt.sign(
      { userId, type: "refresh" },
      config.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    return { accessToken, refreshToken };
  }

  async signup(data: SignupData) {
    try {
      // Check if user already exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, data.email))
        .limit(1);

      if (existingUser.length > 0) {
        throw new Error("USER_ALREADY_EXISTS");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 12);

      // Create user
      const newUser = await db
        .insert(users)
        .values({
          email: data.email,
          password: hashedPassword,
          fullName: data.fullName,
          role: "user",
        })
        .returning({
          id: users.id,
          email: users.email,
          fullName: users.fullName,
          role: users.role,
          isEmailVerified: users.isEmailVerified,
        });

      const user = newUser[0];

      // Generate tokens
      const tokens = this.generateTokens(
        user.id,
        user.email,
        user.role,
        user.fullName,
        user.isEmailVerified || false,
      );

      logger.info("User registered successfully", {
        userId: user.id,
      });

      return {
        user,
        ...tokens,
      };
    } catch (error) {
      logger.error("Signup error:", error);
      throw error;
    }
  }

  async login(data: LoginData) {
    try {
      // Find user
      const userResult = await db
        .select()
        .from(users)
        .where(eq(users.email, data.email))
        .limit(1);

      const user = userResult[0];

      if (!user || !user.password) {
        throw new Error("INVALID_CREDENTIALS");
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(
        data.password,
        user.password,
      );
      if (!isValidPassword) {
        throw new Error("INVALID_CREDENTIALS");
      }

      // Generate tokens
      const tokens = this.generateTokens(
        user.id,
        user.email,
        user.role,
        user.fullName,
        user.isEmailVerified!,
      );

      logger.info("User logged in successfully", {
        userId: user.id,
        email: user.email,
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        },
        ...tokens,
      };
    } catch (error) {
      logger.error("Login error:", error);
      throw error;
    }
  }

  async oauthLogin(profile: OAuthProfile) {
    try {
      // Check if user exists
      const existingUserResult = await db
        .select()
        .from(users)
        .where(eq(users.email, profile.email))
        .limit(1);

      let user = existingUserResult[0];

      if (!user) {
        // Create user from OAuth profile
        const newUserResult = await db
          .insert(users)
          .values({
            email: profile.email,
            fullName: `${profile.firstName} ${profile.lastName}`,
            password: "",
            role: "user",
            isEmailVerified: true,
            oauthprovider: profile.provider,
            oauthId: profile.id,
          })
          .returning();

        user = newUserResult[0];

        logger.info("OAuth user created", {
          userId: user.id,
          provider: profile.provider,
        });
      } else {
        // Update OAuth info if not set
        if (!user.oauthprovider || !user.oauthId) {
          const updatedUserResult = await db
            .update(users)
            .set({
              oauthprovider: profile.provider,
              oauthId: profile.id,
              isEmailVerified: true,
              updatedAt: new Date(),
            })
            .where(eq(users.id, user.id))
            .returning();

          user = updatedUserResult[0];
        }
      }

      // Generate tokens
      const tokens = this.generateTokens(
        user.id,
        user.email,
        user.role,
        user.fullName,
        user.isEmailVerified!,
      );

      logger.info("OAuth login successful", {
        userId: user.id,
        provider: profile.provider,
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        },
        ...tokens,
      };
    } catch (error) {
      logger.error("OAuth login error:", error);
      throw error;
    }
  }

  /*  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        config.JWT_REFRESH_SECRET,
      ) as any;

      if (decoded.type !== "refresh") {
        throw new Error("Invalid token type");
      }

      // Verify user still exists
      const userResult = await db.select()
        .from(users)
        .where(eq(users.id, decoded.userId))
        .limit(1);

      const user = userResult[0];

      if (!user) {
        throw new Error("User not found");
      }

      // Generate new tokens
      const tokens = this.generateTokens(user.id);

      return tokens;
    } catch (error) {
      logger.error("Refresh token error:", error);
      throw new Error("Invalid refresh token");
    }
  }*/

  /* async updateProfile(userId: string, data: Partial<SignupData>) {
    try {
      const updateData: any = { updatedAt: new Date() };

      if (data.firstName) updateData.name = data.firstName;
      if (data.lastName) updateData.lastname = data.lastName;
      if (data.wilaya) updateData.wilaya = data.wilaya;
      if (data.daira) updateData.daira = data.daira;
      if (data.baladia) updateData.baladia = data.baladia;
      if (data.phoneNumber) updateData.phoneNumber = data.phoneNumber;

      const updatedUserResult = await db.update(users)
        .set(updateData)
        .where(eq(users.id, userId))
        .returning({
          id: users.id,
          email: users.email,
          name: users.name,
          lastname: users.lastname,
          wilaya: users.wilaya,
          daira: users.daira,
          baladia: users.baladia,
          phoneNumber: users.phoneNumber,
          updatedAt: users.updatedAt,
        });

      const user = updatedUserResult[0];

      if (!user) {
        throw new Error("User not found");
      }

      logger.info("Profile updated successfully", { userId });

      return user;
    } catch (error) {
      logger.error("Profile update error:", error);
      throw error;
    }
  }*/

  /*async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;

      if (decoded.type !== "access") {
        throw new Error("Invalid token type");
      }

      const userResult = await db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          lastname: users.lastname,
          wilaya: users.wilaya,
          daira: users.daira,
          baladia: users.baladia,
          phoneNumber: users.phoneNumber,
        })
        .from(users)
        .where(eq(users.id, decoded.userId))
        .limit(1);

      const user = userResult[0];

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }*/
}

export const authService = new AuthService();
