import Fastify, {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import helmet from "@fastify/helmet";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
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
import { authRoutes } from "./routes/auth.routes";
import { grantPlugin } from "./plugins/grant.plugin";
import { postRoutes } from "./routes/services.routes";
import { setupStaticFiles } from "./utils/static";
import { orderRoutes } from "./routes/order.routes";
import responseFormatPlugin from "./plugins/response-format";
import * as APIError from "./utils/errors";
import docsPlug from "./plugins/docs-render";
import mailerPlugin from "./utils/mailer";
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

  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
    authorize: (
      roles: string[],
    ) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
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

  await grantPlugin(server);
  await setupStaticFiles(server);
  await server.register(docsPlug);

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
    origin: (origin, callback) => {
      // Handle both string and array formats
      const allowedOrigins = Array.isArray(config.CORS_ORIGIN)
        ? config.CORS_ORIGIN
        : config.CORS_ORIGIN.split(",");

      server.log.info(allowedOrigins);
      server.log.info("the comming origin : ", origin);

      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"), false);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: false,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  });

  // JWT authentication
  await server.register(jwt, {
    secret: config.JWT_SECRET,
  });

  // Multipart/form-data support
  await server.register(multipart, {
    attachFieldsToBody: false,
    limits: {
      fileSize: config.FILE_SIZE_LIMIT,
      files: 15,
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
        const payload = (await request.jwtVerify()) as JwtPayload;

        request.log.info(payload);

        if (!payload) {
          throw new APIError.UnauthorizedError("Authentication required");
        }
        request.ctx.user = payload;
      } catch (error) {
        request.log.error(error);
        throw new APIError.UnauthorizedError("Invalid or expired token");
      }
    },
  );

  await server.register(responseFormatPlugin);

  // Role-based authorization decorator
  server.decorate("authorize", (roles: string[]) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      if (!request.ctx.user) {
        throw new APIError.UnauthorizedError("Authentication required");
      }

      if (!roles.includes(request.ctx.user.role)) {
        throw new APIError.ForbiddenError("Insufficient permissions");
      }
    };
  });

  // Request logging hook

  server.addHook(
    "onResponse",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const startTime = request.ctx?.startTime;

      if (!startTime) return;

      const duration = Date.now() - startTime;

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
            mail_server: Type.String(),
          }),
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      // testing mail service
      const isConnected = await request.server.mailer.verifyConnection();
      return {
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: config.API_VERSION,
        mail_server: isConnected ? "connected" : "disconnected",
      };
    },
  );

  /*console.log("=== DEBUG ENV VARS ===");
  console.log("ZOHO_EMAIL:", config.MAIL);
  console.log("ZOHO_APP_PASSWORD:", config.MAIL_PASSWORD);
  console.log("the full config : ", config);
  console.log("======================");*/

  // mailer plugin
  server.register(mailerPlugin, {
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: config.MAIL!,
      pass: config.MAIL_PASSWORD!,
    },
    from: config.MAIL,
  });

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

  server.register(
    async (api) => {
      await api.register(authRoutes, { prefix: "/auth" });
      await api.register(postRoutes, { prefix: "/services" });
      await api.register(orderRoutes, { prefix: "/orders" });
    },
    { prefix: "/api/v1" },
  );

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

    console.log(server.printRoutes());

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
