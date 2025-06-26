import { loadConfig } from "./conf";

const config = loadConfig();

export const grantConfig = {
  defaults: {
    origin: config.APP_URL || "http://localhost:3000",
    transport: "session",
    state: true,
    prefix: "",
  },
  google: {
    key: config.GOOGLE_CLIENT_ID,
    secret: config.GOOGLE_CLIENT_SECRET,
    callback: "/api/v1/auth/google/callback",
    scope: ["openid", "email", "profile"],
  },
  facebook: {
    key: config.FACEBOOK_CLIENT_ID,
    secret: config.FACEBOOK_CLIENT_SECRET,
    callback: "/api/v1/auth/facebook/callback",
    scope: ["email"],
  },
};
