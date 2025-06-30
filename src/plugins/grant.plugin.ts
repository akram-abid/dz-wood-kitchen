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
  await app.register(fastifyCookie);

  console.log("Grant plugin loaded with /connect/* routes");

  await app.register(fastifySession, {
    secret: config.JWT_SECRET,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: "/",
    },
    saveUninitialized: false,
  });

  // Register grant plugin with proper configuration
  await app.register(grant);
}
