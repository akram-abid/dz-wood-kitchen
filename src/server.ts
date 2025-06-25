import Fastify, {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import helmet from "@fastify/helmet";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import cookie from "@fastify/cookie";
import multipart from "@fastify/multipart";
import compress from "@fastify/compress";
import sensible from "@fastify/sensible";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { randomUUID } from "crypto";
import dotenv from "dotenv";
import { loadConfig } from "./utils/conf";
import type { JwtPayload } from "./gtypes/jwt";
import { initLogger, logger as sLog } from "./utils/logger";
import { db } from "./database/db";

dotenv.config();
const config = loadConfig();

interface RequestContext {
  user?: JwtPayload;
  requestId: string;
  startTime: number;
}

declare module "fastify" {
  interface FastifyRequest {
    ctx: RequestContext;
  }
}

// Custom logger configuration
const isDev = config.NODE_ENV === "development";

const logger = isDev
  ? {
      level: config.LOG_LEVEL,
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
        },
      },
    }
  : {
      level: config.LOG_LEVEL,
    };

// Build Fastify server with TypeBox support
const buildServer = async (): Promise<FastifyInstance> => {
  const server = Fastify({
    logger,
    requestIdHeader: "x-request-id",
    requestIdLogLabel: "reqId",
    genReqId: () => randomUUID(),
    bodyLimit: config.BODY_LIMIT,
    trustProxy: true,
    disableRequestLogging: false,
  }).withTypeProvider<TypeBoxTypeProvider>();

  // server logger
  initLogger(server.log);

  // Security headers
  await server.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  });

  // CORS configuration
  await server.register(cors, {
    origin: config.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  });

  // JWT authentication
  await server.register(jwt, {
    secret: config.JWT_SECRET,
    cookie: {
      cookieName: "token",
      signed: false,
    },
  });

  // Cookie support
  await server.register(cookie, {
    secret: config.JWT_SECRET,
    parseOptions: {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  });

  // Multipart/form-data support
  await server.register(multipart, {
    limits: {
      fileSize: config.FILE_SIZE_LIMIT,
      files: 5,
    },
  });

  // Response compression
  await server.register(compress, {
    global: true,
    encodings: ["gzip", "deflate"],
  });

  // Sensible defaults (error handling, etc.)
  await server.register(sensible);

  // Request context hook
  server.addHook("onRequest", async (request: FastifyRequest) => {
    request.ctx = {
      requestId: request.id,
      startTime: Date.now(),
    };
  });

  // Authentication hook
  server.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const token =
          request.cookies.token ||
          request.headers.authorization?.replace("Bearer ", "");

        if (!token) {
          throw server.httpErrors.unauthorized("Authentication required");
        }

        const payload = server.jwt.verify(token) as JwtPayload;
        request.ctx.user = payload;
      } catch (error) {
        reply.send(server.httpErrors.unauthorized("Invalid or expired token"));
      }
    },
  );

  // Role-based authorization decorator
  server.decorate("authorize", (roles: string[]) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      if (!request.ctx.user) {
        throw server.httpErrors.unauthorized("Authentication required");
      }

      if (!roles.includes(request.ctx.user.role)) {
        throw server.httpErrors.forbidden("Insufficient permissions");
      }
    };
  });

  // Request logging hook
  server.addHook(
    "onResponse",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const duration = Date.now() - request.ctx.startTime;
      server.log.info(
        {
          reqId: request.id,
          method: request.method,
          url: request.url,
          statusCode: reply.statusCode,
          duration: `${duration}ms`,
          userAgent: request.headers["user-agent"],
          ip: request.ip,
        },
        "Request completed",
      );
    },
  );

  // Global error handler
  server.setErrorHandler(
    async (error, request: FastifyRequest, reply: FastifyReply) => {
      const { statusCode = 500, message } = error;

      server.log.error(
        {
          reqId: request.id,
          error: error.message,
          stack: error.stack,
          url: request.url,
          method: request.method,
        },
        "Request error",
      );
      initLogger;

      const response = {
        error: statusCode >= 500 ? "Internal Server Error" : message,
        statusCode,
        timestamp: new Date().toISOString(),
        path: request.url,
        ...(config.NODE_ENV === "development" && { stack: error.stack }),
      };

      reply.status(statusCode).send(response);
    },
  );

  // Health check endpoint
  server.get(
    "/health",
    {
      schema: {
        description: "Health check endpoint",
        tags: ["health"],
        response: {
          200: Type.Object({
            status: Type.String(),
            timestamp: Type.String(),
            uptime: Type.Number(),
            version: Type.String(),
          }),
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return {
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: config.API_VERSION,
      };
    },
  );

  // Graceful shutdown
  const gracefulShutdown = async (signal: string) => {
    server.log.info(`Received ${signal}, shutting down gracefully...`);

    try {
      await server.close();
      server.log.info("Server closed successfully");
      process.exit(0);
    } catch (error) {
      server.log.error("Error during shutdown:", error);
      process.exit(1);
    }
  };

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));

  return server;
};

// Start server
const start = async (): Promise<void> => {
  try {
    const healthy = await db.health();
    if (!healthy) throw new Error("Database not healthy");

    console.log("Database is connected and healthy");
    const server = await buildServer();

    await server.listen({
      port: config.PORT,
      host: config.HOST,
    });

    server.log.info(`Server listening on http://${config.HOST}:${config.PORT}`);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Export for testing
//export { buildServer, config };

// Start server if this file is run directly
if (require.main === module) {
  start();
}
