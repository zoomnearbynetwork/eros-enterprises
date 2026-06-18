import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to initialize Prisma.");
}

// For @prisma/adapter-pg, SSL must be configured explicitly on the pg Pool
// rather than relying on query string params, which the pg driver ignores.
// This is required for Railway's public proxy URL from Vercel (external host).
const isProduction = process.env.NODE_ENV === "production";

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString,
      // Force SSL in production — required for Railway public proxy from Vercel
      ssl: isProduction ? { rejectUnauthorized: false } : undefined,
      // Serverless-safe pool settings — one connection per function invocation
      max: 1,
      connectionTimeoutMillis: 30_000,
      idleTimeoutMillis: 10_000,
    }),
    log: isProduction ? ["error"] : ["warn", "error"],
  });

if (!isProduction) {
  globalForPrisma.prisma = prisma;
}
