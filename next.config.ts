import type { NextConfig } from "next";

const defaultDistDir =
  process.env.NODE_ENV === "production" ? ".next-site-build-prod" : ".next-site-build";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR ?? defaultDistDir,
};

export default nextConfig;
