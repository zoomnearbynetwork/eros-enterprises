import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR ?? ".next-production-build",
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  deploymentId: process.env.DEPLOYMENT_VERSION,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Accel-Buffering",
            value: "no",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
