import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { dbDrizzle as db } from "../database/db";
import { orders } from "../database/schema";
import { eq, and } from "drizzle-orm";
import {
  createOrderDto,
  updateOrderDto,
  addInstallmentsDto,
  updateStatusDto,
  updateOfferDto,
  toggleValidationDto,
  setArticlesDto,
  orderIdParamDto,
} from "../dtos/order.dtos";
import { handleControllerError } from "../utils/errors-handler";
import * as APIError from "../utils/errors";
import { cleanupFiles } from "../utils/uploader";
import path from "path";
import "../utils/mailer";

export const createOrderHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const body = createOrderDto.parse(req.body);
    const mediaUrls = body.mediaFilenames?.map((f) => `/pictures/orders/${f}`);

    const newOrder = await db
      .insert(orders)
      .values({
        title: body.title ?? "",
        email: body.email,
        fullName: body.fullName,
        description: body.description,
        woodType: body.woodType ?? "",
        daira: body.daira,
        street: body.street,
        baladia: body.baladia,
        wilaya: body.wilaya,
        phoneNumber: body.phoneNumber,
        mediaUrls: mediaUrls ?? [],
        postId: body.postId,
        userId: body.userId,
      })
      .returning();

    const orderLink = `${process.env.DOMAIN}/order/${newOrder[0].id}`;

    const mailer = req.server.mailer;

    req.log.info(mailer);

    const messageResult = await mailer.sendTemplate(
      "orderCreated",
      process.env.ORDERS_EMAIL! || "dzwoodkitchens@dzwoodkitchen.com",
      {
        order: newOrder[0].description,
        orderLink,
        company: process.env.DOMAIN,
      },
      "New Order",
    );

    reply.code(201);

    return { order: newOrder[0], messageResult };
  } catch (error: any) {
    handleControllerError(error, "create order", req.log);
  }
};

export const updateOrderHandler = async (
  req: FastifyRequest<{
    Params: { id: string };
    Body: Partial<z.infer<typeof updateOrderDto>>;
  }>,
  reply: FastifyReply,
) => {
  try {
    const { id } = req.params;

    const order = await db.select().from(orders).where(eq(orders.id, id));

    if (order.length === 0) {
      throw new APIError.NotFoundError("Order not found");
    }

    const data = updateOrderDto.parse(req.body);

    const updateData: any = {
      ...data,
    };

    // Handle media files mapping
    if (data.mediaFilenames) {
      updateData.mediaUrls = data.mediaFilenames.map(
        (f) => `/pictures/orders/${f}`,
      );
    }

    const [updatedOrder] = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, id))
      .returning();

    console.log(updatedOrder.mediaUrls);

    if (order[0]?.mediaUrls) {
      const oldImages = order[0].mediaUrls.map((url: string) => {
        return path.join(process.cwd(), url);
      });

      // fire and forget ...
      cleanupFiles(oldImages).catch((err) => {
        console.error("Failed to cleanup old images:", err);
      });
    }

    reply.status(200);
    return;
  } catch (error: any) {
    handleControllerError(error, "update order", req.log);
  }
};

export const deleteOrderHandler = async (
  req: FastifyRequest<{ Params: z.infer<typeof orderIdParamDto> }>,
  reply: FastifyReply,
) => {
  try {
    const { id } = orderIdParamDto.parse(req.params);

    const deleted = await db
      .delete(orders)
      .where(eq(orders.id, id))
      .returning();

    if (deleted.length === 0) {
      throw new APIError.NotFoundError("Order not found");
    }

    reply.status(200);
    return { order: deleted[0] };
  } catch (error: any) {
    handleControllerError(error, "delete order handler", req.log);
  }
};

export const getOrderByIdHandler = async (
  req: FastifyRequest<{ Params: z.infer<typeof orderIdParamDto> }>,
  reply: FastifyReply,
) => {
  try {
    const { id } = orderIdParamDto.parse(req.params);

    const order = await db.select().from(orders).where(eq(orders.id, id));

    if (order.length === 0) {
      throw new APIError.NotFoundError("Order not found");
    }

    reply.status(200);
    return { order: order[0] };
  } catch (error: any) {
    handleControllerError(error, "get order", req.log);
  }
};

export async function addInstallmentsHandler(
  request: FastifyRequest<{
    Params: z.infer<typeof orderIdParamDto>;
    Body: z.infer<typeof addInstallmentsDto>;
  }>,
  reply: FastifyReply,
) {
  const { id } = orderIdParamDto.parse(request.params);
  const { newInstallments } = addInstallmentsDto.parse(request.body);

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id),
  });

  if (!order) {
    throw new APIError.NotFoundError("Order not found");
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

  updatedInstallments.push(...newInstallments);

  await db
    .update(orders)
    .set({ installments: updatedInstallments })
    .where(eq(orders.id, id));

  reply.status(200);
  return updatedInstallments;
}

/**
 * PATCH /orders/:orderId/status
 */
export async function updateOrderStatusHandler(
  request: FastifyRequest<{
    Params: z.infer<typeof orderIdParamDto>;
    Body: z.infer<typeof updateStatusDto>;
  }>,
  reply: FastifyReply,
) {
  const { id } = request.params;
  const { status } = request.body;

  request.log.info("request body : ");
  request.log.info(request.body);
  request.log.info("status");
  request.log.info(status);

  const validStatuses = [
    "waiting",
    "inProgress",
    "inShipping",
    "delivered",
  ] as const;
  if (!validStatuses.includes(status as any)) {
    reply.status(400);
    throw new APIError.BadRequestError(
      `Status must be one of: ${validStatuses.join(", ")}`,
    );
  }
  const [updatedOrder] = await db
    .update(orders)
    .set({
      status: status as (typeof validStatuses)[number],
      updatedAt: new Date(), // Update the timestamp
    })
    .where(eq(orders.id, id))
    .returning(); // This returns the updated record

  // Check if order was found and updated
  if (!updatedOrder) {
    return reply.status(404).send({
      error: "Order not found",
      message: `No order found with id: ${id}`,
    });
  }

  // Return the updated order
  reply.status(200);

  return { updatedOrder };
}

/**
 * PATCH /orders/:orderId/offer
 */
export async function updateOfferHandler(
  request: FastifyRequest<{
    Params: z.infer<typeof orderIdParamDto>;
    Body: z.infer<typeof updateOfferDto>;
  }>,
  reply: FastifyReply,
) {
  const { id } = request.params;
  const { offer } = request.body;

  request.log.info(offer);

  await db.update(orders).set({ offer }).where(eq(orders.id, id));

  reply.status(200);
  return { offer: "offer updated" };
}

/**
 * PATCH /orders/:orderId/validate
 */
export async function toggleValidationHandler(
  request: FastifyRequest<{
    Params: z.infer<typeof orderIdParamDto>;
    Body: z.infer<typeof toggleValidationDto>;
  }>,
  reply: FastifyReply,
) {
  const { id } = request.params;
  const { validate } = request.body;

  await db
    .update(orders)
    .set({ isValidated: validate })
    .where(eq(orders.id, id));

  reply.status(200);
  return { is_validated: `Order ${validate ? "validated" : "invalidated"}` };
}

/**
 * GET /orders?status=...
 */
export async function getOrdersByFiltersHandler(
  request: FastifyRequest<{
    Querystring: { status?: string };
  }>,
  reply: FastifyReply,
) {
  const { status } = request.query;
  const filters = [];

  if (status) {
    const validStatuses = ["waiting", "inProgress", "inShipping", "delivered"];
    if (!validStatuses.includes(status)) {
      reply.status(400);
      throw new APIError.BadRequestError(
        `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      );
    }
    filters.push(eq(orders.status, status as any));
  }

  try {
    const results = await db
      .select()
      .from(orders)
      .where(filters.length > 0 ? and(...filters) : undefined);

    reply.status(200);
    return results;
  } catch (error) {
    handleControllerError(error, "get order by filter", request.log);
  }
}

/**
 * POST /:orderId/articles
 */

export async function setOrderArticlesHandler(
  request: FastifyRequest<{
    Params: z.infer<typeof orderIdParamDto>;
    Body: z.infer<typeof setArticlesDto>;
  }>,
  reply: FastifyReply,
) {
  const { id } = request.params;
  const { articles } = request.body;

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id),
  });

  if (!order) {
    throw new APIError.NotFoundError("Order not found");
  }

  await db.update(orders).set({ articles }).where(eq(orders.id, id));

  reply.status(200);

  return {
    articles: articles,
  };
}

/*
 * GET /client
 */

export async function getUserOrders(req: FastifyRequest, reply: FastifyReply) {
  const userId = req.ctx.user?.userId;

  if (!userId) {
    throw new APIError.UnauthorizedError("Unautherized");
  }

  const userOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId));

  reply.status(200);
  return userOrders;
}

/*
 * Patch /:orderId/articles
 */

//export async function updateOrderArticlesHandler() {}
