import { Pool, PoolClient, PoolConfig, QueryResult, QueryResultRow } from "pg";
import { loadConfig } from "../utils/conf";
import { logger } from "../utils/logger";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

// Load app config
const config = loadConfig();

// Define connection options with type safety
const poolConfig: PoolConfig = {
  connectionString: config.DATABASE_URL,
  min: 2,
  max: 20,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 2000,
  statement_timeout: 60_000,
  query_timeout: 60_000,
  ssl: config.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  application_name: "DZWC-API",
};

// Create a new connection pool
const pool = new Pool(poolConfig);

// Log errors
pool.on("error", (err) => {
  logger.error("Database pool error:", err);
});

// Exported db helper
export const db = {
  async query<T extends QueryResultRow = any>(
    text: string,
    params?: any[],
  ): Promise<QueryResult<T>> {
    const start = Date.now();
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;

    logger.info("Executed query", {
      query: text.length > 100 ? text.substring(0, 100) + "..." : text,
      duration: `${duration}ms`,
      rows: res.rowCount,
    });

    return res;
  },

  async transaction<T>(cb: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const result = await cb(client);
      await client.query("COMMIT");
      return result;
    } catch (err) {
      await client.query("ROLLBACK");
      logger.error("Transaction error:", err);
      throw err;
    } finally {
      client.release();
    }
  },

  async health(): Promise<boolean> {
    try {
      const result = await pool.query("SELECT 1");
      return result.rowCount === 1;
    } catch (error) {
      logger.error("Health check failed:", error);
      return false;
    }
  },

  async close(): Promise<void> {
    try {
      await pool.end();
      logger.info("Database pool closed.");
    } catch (error) {
      logger.error("Failed to close pool:", error);
    }
  },

  status() {
    return {
      total: pool.totalCount,
      idle: pool.idleCount,
      waiting: pool.waitingCount,
    };
  },

  getClient(): Promise<PoolClient> {
    return pool.connect();
  },
};

export const dbDrizzle = drizzle(pool, { schema });
// Export types
export type { PoolClient };
