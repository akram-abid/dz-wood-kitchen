import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  createOrderHandler,
  updateOrderHandler,
  deleteOrderHandler,
  getOrderByIdHandler,
  getOrdersByFiltersHandler,
  updateOrderStatusHandler,
  updateOfferHandler,
  toggleValidationHandler,
  addInstallmentsHandler,
  setOrderArticlesHandler,
  getUserOrders,
} from "../controllers/order.controller";
import { processFileUploads, orderImagesPath } from "../utils/uploader";

export async function orderRoutes(server: FastifyInstance) {
  const { authenticate, authorize } = server;

  // Create Order
  server.post("/", {
    preHandler: [authenticate],
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
    preHandler: [authenticate],
    handler: async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const { orderId } = req.params as { orderId: string };
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
            params: { id: orderId },
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

  // -------------------------
  // GET: Fetch Orders
  // -------------------------

  // Get all orders (with optional filters)
  server.get("/", {
    preHandler: [authenticate],
    handler: getOrdersByFiltersHandler,
  });

  // Get single order by ID
  server.get("/:id", {
    preHandler: [authenticate],
    handler: getOrderByIdHandler,
  });

  // -------------------------
  // PATCH: Update Order Fields
  // -------------------------

  // Update order status (admin only)
  server.patch("/:id/status", {
    preHandler: [authenticate, authorize(["admin"])],
    handler: updateOrderStatusHandler,
  });

  // Update order offer
  server.patch("/:id/offer", {
    preHandler: [authenticate, authorize(["admin"])],
    handler: updateOfferHandler,
  });

  // Validate / Invalidate order (admin only)
  server.patch("/:id/validate", {
    preHandler: [authenticate, authorize(["admin"])],
    handler: toggleValidationHandler,
  });

  // Add new installment to order
  server.patch("/:id/installments", {
    preHandler: [authenticate, authorize(["admin"])],
    handler: addInstallmentsHandler,
  });

  // -------------------------
  // DELETE: Remove Order
  // -------------------------

  server.delete("/:id", {
    preHandler: [authenticate],
    handler: deleteOrderHandler,
  });

  // -------------------------
  // POST : add articles to the compilted order
  //
  server.post("/:id/articles", {
    preHandler: [server.authenticate],
    handler: setOrderArticlesHandler,
  });

  //------------------------
  // GET : all orders of a user
  // -----------------------
  server.get("/client", {
    preHandler: [server.authenticate],
    handler: getUserOrders,
  });
}
