export interface JwtPayload {
  userId: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  type: string;
  role: string;
  iat?: number;
  exp?: number;
}
