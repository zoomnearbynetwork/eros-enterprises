import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
  serverExternalPackages: ["@react-pdf/renderer", "@prisma/client", ".prisma/client"],
  // output: "standalone" removed — not compatible with Vercel deployment
  // Vercel handles its own bundling; standalone is for Docker/self-hosted only
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
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
