import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

// Load .env.local first (highest priority — local dev overrides), then .env
dotenv.config({ path: ".env.local" });
dotenv.config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed.mjs",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "postgresql://localhost:5432/placeholder",
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
  },
});
