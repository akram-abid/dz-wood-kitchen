import fp from "fastify-plugin";
import { FastifyPluginAsync, FastifyInstance } from "fastify";
import { STATUS_CODES } from "http";

const responseFormatPlugin: FastifyPluginAsync = async (
  fastify: FastifyInstance,
) => {
  fastify.addHook("onSend", async (request, reply, payload) => {
    if (
      reply.statusCode >= 400 ||
      !reply.getHeader("content-type")?.toString().includes("application/json")
    ) {
      return payload;
    }

    try {
      const data = JSON.parse(payload as string);

      return JSON.stringify({
        status: "success",
        message: STATUS_CODES[reply.statusCode] ?? "OK",
        data,
      });
    } catch {
      return payload;
    }
  });

  fastify.setErrorHandler((error, request, reply) => {
    const isDev = process.env.NODE_ENV !== "production";
    const statusCode = error.statusCode ?? 500;
    const message =
      statusCode === 500 && !isDev ? "INTERNAL SERVER ERROR" : error.message;

    reply.status(statusCode).send({
      status: "error",
      error: error.name,
      message,
      ...(isDev && statusCode === 500 ? { stack: error.stack } : {}),
    });
  });
};

export default fp(responseFormatPlugin);
