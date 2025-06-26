import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  addPostHandler,
  deletePostHandler,
  getPostsByAdminHandler,
} from "../controllers/services.controller";
import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";

const serviceImagesPath = path.join(process.cwd(), "pictures/services");
if (!fs.existsSync(serviceImagesPath)) {
  fs.mkdirSync(serviceImagesPath, { recursive: true });
}

export async function postRoutes(server: FastifyInstance) {
  server.post("/posts", {
    preHandler: [server.authenticate, server.authorize(["admin"])],
    handler: async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const parts = req.parts();
        const fields: Record<string, string> = {};
        const imageFilenames: string[] = [];

        for await (const part of parts) {
          if (part.type === "file") {
            if (
              !["image/jpeg", "image/png", "image/jpg", "video/mp4"].includes(
                part.mimetype || "",
              )
            ) {
              return reply.code(400).send({
                success: false,
                message: "Unsupported file type",
              });
            }

            const filename = `${Date.now()}-${part.filename}`;
            const filepath = path.join(serviceImagesPath, filename);

            await pipeline(part.file, fs.createWriteStream(filepath));
            imageFilenames.push(filename);
          } else if (part.type === "field") {
            fields[part.fieldname] = part.value as string;
          }
        }

        if (imageFilenames.length > 15) {
          return reply.code(400).send({
            success: false,
            message: "Max 15 files allowed",
          });
        }

        const body = {
          ...fields,
          imageFilenames,
          adminId: req.ctx.user?.userId,
        };

        return addPostHandler({ ...req, body }, reply);
      } catch (error) {
        server.log.error(error, "Error processing post upload");
        return reply.code(500).send({
          success: false,
          message: "Internal server error",
        });
      }
    },
  });

  // Delete Post
  server.delete("/posts/:id", {
    preHandler: [server.authenticate, server.authorize(["admin"])],
    handler: deletePostHandler,
  });

  // Get All Posts by Admin
  server.get("/posts", {
    preHandler: [server.authenticate, server.authorize(["admin"])],
    handler: getPostsByAdminHandler,
  });

  server.get("/posts/:postId", {
    preHandler: [server.authenticate, server.authorize(["admin"])],
    handler: getPostsByAdminHandler,
  });
}
