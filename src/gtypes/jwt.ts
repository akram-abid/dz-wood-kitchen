export interface JwtPayload {
  userId: string;
  name: string;
  email: string;
  type: string;
  role: string;
  iat?: number;
  exp?: number;
}
