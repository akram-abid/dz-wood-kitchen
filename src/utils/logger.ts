import { FastifyBaseLogger } from "fastify";

export let logger: FastifyBaseLogger;

export function initLogger(log: FastifyBaseLogger) {
  logger = log;
}
