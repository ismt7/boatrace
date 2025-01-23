import { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ["pages", "components", "prisma"],
  },
};

export default nextConfig;
