import { FastifyInstance } from "fastify";
import {
  googleCallback,
  facebookCallback,
  loginController,
  signupController,
  updateUserInfoHandler,
} from "../controllers/auth.controller";

export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post("/signup", signupController);
  app.post("/login", loginController);

  app.get("/google/callback", googleCallback);
  app.get("/facebook/callback", facebookCallback);

  app.get("/update", {
    preHandler: [app.authenticate],
    handler: updateUserInfoHandler,
  });
}
