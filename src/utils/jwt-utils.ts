import jwt from "jsonwebtoken";

export const generateToken = (
  email: string,
  userId: string,
  type: string,
): string => {
  const expiresIn = type === "email_verification" ? "3h" : "1h";
  const payload: jwt.JwtPayload = {
    email,
    userId,
    type,
    timestamp: Date.now(),
  };

  return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn });
};

export const generateUrl = (token: string, path: string): string => {
  const baseUrl = process.env.DOMAIN || "http://localhost:3000";
  return `${baseUrl}/${path}?token=${encodeURIComponent(token)}`;
};
