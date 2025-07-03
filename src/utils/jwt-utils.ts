import jwt from "jsonwebtoken";

export const generateToken = (
  email: string,
  userId: string,
  type: string,
): string => {
  return jwt.sign(
    {
      email,
      userId,
      type,
      timestamp: Date.now(),
    },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" },
  );
};

export const generateUrl = (token: string, path: string): string => {
  const baseUrl = process.env.DOMAIN || "http://localhost:3000";
  return `${baseUrl}/${path}?token=${encodeURIComponent(token)}`;
};
