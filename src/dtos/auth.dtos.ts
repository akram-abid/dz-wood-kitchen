import { FastifyRequest } from "fastify";

export interface SignupData {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface OAuthProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  provider: "google" | "facebook";
  avatar?: string;
}

export type SignupRequest = FastifyRequest<{ Body: SignupData }>;
export type LoginRequest = FastifyRequest<{ Body: LoginData }>;
export interface UpdateUserBody {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
}

export interface GrantSessionData {
  response?: {
    access_token: string;
    refresh_token?: string;
    token_type?: string;
    sub: string;
    email: string;
    given_name?: string;
    family_name?: string;
    [key: string]: any;
  };
}
