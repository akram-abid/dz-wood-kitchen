import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  addPostHandler,
  deletePostHandler,
  getPostsByAdminHandler,
  updatePostHandler,
  filterByWoodTypeHandler,
  getPostsById,
} from "../controllers/services.controller";
import { serviceImagesPath, processFileUploads } from "../utils/uploader";

export async function postRoutes(server: FastifyInstance) {
  // Create Post
  server.post("/posts", {
    preHandler: [server.authenticate, server.authorize(["admin"])],
    handler: async (req: FastifyRequest, reply: FastifyReply) => {
      //req.log.info(req.body);
      req.log.info(req.ctx);
      try {
        const uploadResult = await processFileUploads(
          req.parts(),
          reply,
          serviceImagesPath,
        );
        if (!uploadResult) return;

        const { fields, mediaFilenames } = uploadResult;
        const body = {
          ...fields,
          mediaFilenames,
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

  // Update Post
  server.patch("/posts/:postId", {
    preHandler: [server.authenticate, server.authorize(["admin"])],
    handler: async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const postId = (req.params as any).postId;
        const uploadResult = await processFileUploads(
          req.parts(),
          reply,
          serviceImagesPath,
        );
        if (!uploadResult) return;

        const { fields, mediaFilenames } = uploadResult;
        const updatePayload = {
          ...fields,
          adminId: req.ctx.user?.userId,
          ...(mediaFilenames.length > 0 && { mediaFilenames }),
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

  // Delete Post
  server.delete("/posts/:id", {
    preHandler: [server.authenticate, server.authorize(["admin"])],
    handler: deletePostHandler,
  });

  // Get All Posts by Admin
  server.get("/posts", {
    handler: getPostsByAdminHandler,
  });

  // filter by wood type
  server.get("/posts/filter", {
    handler: filterByWoodTypeHandler,
  });

  server.get("/posts/:postId", {
    handler: getPostsById,
  });
}
