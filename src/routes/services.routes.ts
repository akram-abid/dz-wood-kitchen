import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  addPostHandler,
  deletePostHandler,
  getPostsByAdminHandler,
  updatePostHandler,
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
        const fields: Record<string, any> = {};
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
            if (part.fieldname === "items") {
              try {
                fields.items = JSON.parse(part.value as string);
                if (
                  !Array.isArray(fields.items) ||
                  !fields.items.every((i) => typeof i === "string")
                ) {
                  throw new Error("Invalid format");
                }
              } catch {
                return reply.code(400).send({
                  success: false,
                  message:
                    "Invalid 'items' field: must be JSON array of strings",
                });
              }
            } else {
              fields[part.fieldname] = part.value;
            }
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
        req.log.error(error, "Error processing post upload");
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

  server.patch("/posts/:postId", {
    preHandler: [server.authenticate, server.authorize(["admin"])],
    handler: async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const postId = (req.params as any).postId;
        const parts = req.parts();
        const fields: Record<string, any> = {};
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
            if (part.fieldname === "items") {
              try {
                fields.items = JSON.parse(part.value as string);
                if (
                  !Array.isArray(fields.items) ||
                  !fields.items.every((i) => typeof i === "string")
                ) {
                  throw new Error("Invalid items array");
                }
              } catch {
                return reply.code(400).send({
                  success: false,
                  message:
                    "Invalid 'items' field: must be JSON array of strings",
                });
              }
            } else {
              fields[part.fieldname] = part.value;
            }
          }
        }

        if (imageFilenames.length > 0 && imageFilenames.length > 15) {
          return reply.code(400).send({
            success: false,
            message: "Max 15 files allowed",
          });
        }

        const updatePayload = {
          ...fields,
          adminId: req.ctx.user?.userId,
          ...(imageFilenames.length > 0 && { imageFilenames }),
        };

        return updatePostHandler(
          {
            ...req,
            body: updatePayload,
            params: { postId },
          } as any,
          reply,
        );
      } catch (error) {
        req.log.error(error, "Error processing post update");
        return reply.code(500).send({
          success: false,
          message: "Internal server error",
        });
      }
    },
  });
}
