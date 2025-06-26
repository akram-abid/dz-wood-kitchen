import { FastifyInstance } from "fastify";
import {
  googleCallback,
  facebookCallback,
  loginController,
  signupController,
} from "../controllers/auth.controller";

export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post("/signup", signupController);
  app.post("/login", loginController);

  app.get("/google/callback", googleCallback);
  app.get("/facebook/callback", facebookCallback);
}
