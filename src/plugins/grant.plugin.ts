import { FastifyInstance } from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import { grantConfig } from "../utils/grant.config";
import { loadConfig } from "../utils/conf";

// Import grant properly
const grant = require("grant").fastify(grantConfig);

const config = loadConfig();

export async function grantPlugin(app: FastifyInstance): Promise<void> {
  // Register cookie plugin first
  await app.register(fastifyCookie, {
    secret: config.JWT_SECRET,
  });

  console.log("Grant plugin loaded with /connect/* routes");

  // Register session plugin
  await app.register(fastifySession, {
    secret: config.JWT_SECRET,
    cookie: {
      secure: config.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict" as const,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
    saveUninitialized: false,
  });

  // Register grant plugin with proper configuration
  await app.register(grant);
}
