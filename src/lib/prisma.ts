import "server-only";

import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to initialize Prisma.");
}

// Create a pg.Pool directly so we can pass explicit SSL config.
// @prisma/adapter-pg v7 accepts a Pool instance as the first argument.
// Using ssl: { rejectUnauthorized: false } is required for Railway's
// public proxy URL (interchange.proxy.rlwy.net) from Vercel.
const pool = new pg.Pool({
  connectionString,
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : undefined,
  max: 1,                       // serverless: 1 connection per function
  connectionTimeoutMillis: 30_000,
  idleTimeoutMillis: 10_000,
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg(pool),
    log: process.env.NODE_ENV === "production" ? ["error"] : ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
