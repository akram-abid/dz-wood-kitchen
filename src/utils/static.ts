import path from "path";
import fastifyStatic from "@fastify/static";
import { FastifyInstance } from "fastify";

export async function setupStaticFiles(server: FastifyInstance) {
  server.register(fastifyStatic, {
    root: path.join(process.cwd(), "pictures"),
    prefix: "/pictures/",
  });
}
