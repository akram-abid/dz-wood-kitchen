import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { dbDrizzle as db } from "../database/db";
import { orders } from "../database/schema";
import { eq, and } from "drizzle-orm";

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

export async function addInstallmentHandler(
  request: FastifyRequest<{
    Params: { orderId: string };
    Body: { newInstallment: { date: string; amount: number } };
  }>,
  reply: FastifyReply,
) {
  const { orderId } = request.params;
  const { newInstallment } = request.body;

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
  });

  if (!order) {
    return reply.code(404).send({
      success: false,
      message: "Order not found",
    });
  }

  let updatedInstallments: { date: string; amount: number }[] = Array.isArray(
    order.installments,
  )
    ? [...order.installments]
    : [];

  if (
    order.isValidated &&
    order.offer != null &&
    updatedInstallments.length === 0
  ) {
    updatedInstallments.push({
      date: new Date().toISOString().split("T")[0],
      amount: Number(order.offer),
    });
  }

  updatedInstallments.push(newInstallment);

  await db
    .update(orders)
    .set({ installments: updatedInstallments })
    .where(eq(orders.id, orderId));

  reply.send({
    success: true,
    message: "Installment added",
    data: updatedInstallments,
  });
}

/**
 * PATCH /orders/:orderId/status
 */
export async function updateOrderStatusHandler(
  request: FastifyRequest<{
    Params: { orderId: string };
    Body: { status: string };
  }>,
  reply: FastifyReply,
) {
  const { orderId } = request.params;
  const { status } = request.body;

  await db.update(orders).set({ status }).where(eq(orders.id, orderId));

  reply.send({ success: true, message: "Status updated" });
}

/**
 * PATCH /orders/:orderId/offer
 */
export async function updateOfferHandler(
  request: FastifyRequest<{
    Params: { orderId: string };
    Body: { offer: number };
  }>,
  reply: FastifyReply,
) {
  const { orderId } = request.params;
  const { offer } = request.body;

  await db.update(orders).set({ offer }).where(eq(orders.id, orderId));

  reply.send({ success: true, message: "Offer updated" });
}

/**
 * PATCH /orders/:orderId/validate
 */
export async function toggleValidationHandler(
  request: FastifyRequest<{
    Params: { orderId: string };
    Body: { validate: boolean };
  }>,
  reply: FastifyReply,
) {
  const { orderId } = request.params;
  const { validate } = request.body;

  await db
    .update(orders)
    .set({ isValidated: validate })
    .where(eq(orders.id, orderId));

  reply.send({
    success: true,
    message: `Order ${validate ? "validated" : "invalidated"}`,
  });
}

/**
 * GET /orders?status=...&validated=true|false
 */
export async function getOrdersByFiltersHandler(
  request: FastifyRequest<{
    Querystring: { status?: string; validated?: string };
  }>,
  reply: FastifyReply,
) {
  const { status, validated } = request.query;

  const filters = [];

  if (status) filters.push(eq(orders.status, status));
  if (validated === "true") filters.push(eq(orders.isValidated, true));
  if (validated === "false") filters.push(eq(orders.isValidated, false));

  const results = await db
    .select()
    .from(orders)
    .where(and(...filters));

  reply.send({ success: true, data: results });
}

/**
 * POST /:orderId/articles
 */

export async function setOrderArticlesHandler(
  request: FastifyRequest<{
    Params: { orderId: string };
    Body: { articles: any[] };
  }>,
  reply: FastifyReply,
) {
  const { orderId } = request.params;
  const { articles } = request.body;

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
  });

  if (!order) {
    return reply.code(404).send({ success: false, message: "Order not found" });
  }

  await db.update(orders).set({ articles }).where(eq(orders.id, orderId));

  reply.send({
    success: true,
    message: "Articles set successfully",
    data: articles,
  });
}

/*
 * Patch /:orderId/articles
 */

//export async function updateOrderArticlesHandler() {}
