import type { ServerConfig } from "../gtypes/config";
import { logger } from "./logger";
import dotenv from "dotenv";

let config: ServerConfig | null = null;
dotenv.config();

export function loadConfig(): ServerConfig {
  if (config) return config;

  config = {
    NODE_ENV:
      (process.env.NODE_ENV as ServerConfig["NODE_ENV"]) || "development",
    PORT: parseInt(process.env.PORT || "3000", 10),
    HOST: process.env.HOST || "0.0.0.0",
    JWT_SECRET: process.env.JWT_SECRET || "secret",
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "refresh-secret",
    DATABASE_URL: process.env.DATABASE_URL,
    API_VERSION: process.env.API_VERSION || "v1",
    RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
    RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW || "60000", 10),
    CORS_ORIGIN: process.env.CORS_ORIGIN?.split(",") || [
      "http://localhost:3000",
    ],
    LOG_LEVEL: (process.env.LOG_LEVEL as ServerConfig["LOG_LEVEL"]) || "info",
    BODY_LIMIT: parseInt(process.env.BODY_LIMIT || "1048576", 10), // 1MB
    FILE_SIZE_LIMIT: parseInt(process.env.FILE_SIZE_LIMIT || "5242880", 10), // 5MB
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID || "",
    FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET || "",
    APP_URL: process.env.APP_URL || "http://localhost:3000",
    MAIL: process.env.ZOHOMAIL || "",
    MAIL_PASSWORD: process.env.ZOHOMAIL_PASSWORD || "",
  };

  //console.log(config);

  return config;
}
