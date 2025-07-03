// Environment configuration with validation
export interface ServerConfig {
  NODE_ENV: "development" | "production" | "test";
  PORT: number;
  APP_URL: string;
  HOST: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  DATABASE_URL?: string;
  API_VERSION: string;
  RATE_LIMIT_MAX: number;
  RATE_LIMIT_WINDOW: number;
  CORS_ORIGIN: string | string[];
  LOG_LEVEL: "trace" | "debug" | "info" | "warn" | "error" | "fatal";
  BODY_LIMIT: number;
  FILE_SIZE_LIMIT: number;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  FACEBOOK_CLIENT_SECRET: string;
  FACEBOOK_CLIENT_ID: string;
  MAIL: string;
  MAIL_PASSWORD: string;
}
