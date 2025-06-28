import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  createOrderHandler,
  updateOrderHandler,
  deleteOrderHandler,
  getOrderByIdHandler,
} from "../controllers/order.controller";
import { processFileUploads, orderImagesPath } from "../utils/uploader"; // Import the existing function

export async function orderRoutes(server: FastifyInstance) {
  // Create Order
  server.post("/", {
    preHandler: [server.authenticate],
    handler: async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const uploadResult = await processFileUploads(
          req.parts(),
          reply,
          orderImagesPath,
        );
        if (!uploadResult) return;

        const { fields, mediaFilenames } = uploadResult;
        const body = {
          ...fields,
          mediaFilenames: mediaFilenames,
          userId: req.ctx.user?.userId,
        };

        return createOrderHandler({ ...req, body }, reply);
      } catch (error) {
        req.log.error(error, "Error processing order creation");
        return reply.code(500).send({
          success: false,
          message: "Internal server error",
        });
      }
    },
  });

  // Update Order
  server.patch("/:orderId", {
    preHandler: [server.authenticate],
    handler: async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const orderId = (req.params as any).orderId;
        const uploadResult = await processFileUploads(
          req.parts(),
          reply,
          orderImagesPath,
        );
        if (!uploadResult) return;

        const { fields, mediaFilenames } = uploadResult;
        const updatePayload = {
          ...fields,
          ...(mediaFilenames.length > 0 && { mediaFilenames: mediaFilenames }),
        };

        return updateOrderHandler(
          {
            ...req,
            body: updatePayload,
            params: { orderId },
          } as any,
          reply,
        );
      } catch (error) {
        req.log.error(error, "Error processing order update");
        return reply.code(500).send({
          success: false,
          message: "Internal server error",
        });
      }
    },
  });

  // Delete Order
  server.delete("/:id", {
    preHandler: [server.authenticate],
    handler: deleteOrderHandler,
  });

  // Get Order by ID
  server.get("/:id", {
    preHandler: [server.authenticate],
    handler: getOrderByIdHandler,
  });
}
