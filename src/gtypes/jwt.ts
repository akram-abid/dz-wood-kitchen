export interface JwtPayload {
  userId: string;
  email: string;
  type: string;
  role: string;
  iat?: number;
  exp?: number;
}
