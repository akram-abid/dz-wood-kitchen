import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { dbDrizzle as db } from "../database/db";
import { orders } from "../database/schema";
import { eq } from "drizzle-orm";

const orderSchema = z.object({
  title: z.string().optional(),
  description: z.string(),
  woodType: z.string().optional(),
  daira: z.string(),
  street: z.string(),
  baladia: z.string(),
  wilaya: z.string(),
  phoneNumber: z.string(),
  mediaFilenames: z.array(z.string()).max(10).optional(),
  postId: z.string().uuid().optional(),
  userId: z.string().uuid(),
});

export const createOrderHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const body = orderSchema.parse(req.body);
    const mediaUrls = body.mediaFilenames?.map((f) => `/pictures/orders/${f}`);

    const newOrder = await db
      .insert(orders)
      .values({
        title: body.title,
        description: body.description,
        woodType: body.woodType,
        daira: body.daira,
        street: body.street,
        baladia: body.baladia,
        wilaya: body.wilaya,
        phoneNumber: body.phoneNumber,
        mediaUrls,
        postId: body.postId,
        userId: body.userId,
      })
      .returning();

    return reply.code(201).send({ success: true, order: newOrder[0] });
  } catch (error: any) {
    req.log.error("Order creation failed", error);
    return reply.code(400).send({ success: false, message: error.message });
  }
};

export const updateOrderHandler = async (
  req: FastifyRequest<{
    Params: { orderId: string };
    Body: Partial<z.infer<typeof orderSchema>>;
  }>,
  reply: FastifyReply,
) => {
  try {
    const { orderId } = req.params;
    const data = orderSchema.partial().parse(req.body);

    const updateData: any = {
      ...data,
    };

    // Handle media files mapping
    if (data.mediaFilenames) {
      updateData.mediaUrls = data.mediaFilenames.map(
        (f) => `/pictures/orders/${f}`,
      );
      // Remove mediaFilenames from updateData since it's not a database field
      delete updateData.mediaFilenames;
    }

    const updated = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, orderId))
      .returning();

    if (updated.length === 0) {
      return reply
        .code(404)
        .send({ success: false, message: "Order not found" });
    }

    return reply.send({ success: true, order: updated[0] });
  } catch (error: any) {
    req.log.error("Update failed", error);
    return reply.code(400).send({ success: false, message: error.message });
  }
};

export const deleteOrderHandler = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  try {
    const { id } = req.params;

    const deleted = await db
      .delete(orders)
      .where(eq(orders.id, id))
      .returning();

    if (deleted.length === 0) {
      return reply
        .code(404)
        .send({ success: false, message: "Order not found" });
    }

    return reply.send({ success: true, order: deleted[0] });
  } catch (error: any) {
    req.log.error("Delete error", error);
    return reply.code(500).send({ success: false, message: error.message });
  }
};

export const getOrderByIdHandler = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  try {
    const { id } = req.params;

    const order = await db.select().from(orders).where(eq(orders.id, id));

    if (order.length === 0) {
      return reply
        .code(404)
        .send({ success: false, message: "Order not found" });
    }

    return reply.send({ success: true, order: order[0] });
  } catch (error: any) {
    req.log.error("Fetch error", error);
    return reply.code(500).send({ success: false, message: error.message });
  }
};
