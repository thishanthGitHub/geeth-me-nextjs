import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  turbopack: {
    // Tell Turbopack this project is its own root, not the parent monorepo
    root: __dirname,
  },
};

export default nextConfig;
