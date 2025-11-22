import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore - Attempting to disable SWC features
  experimental: {
    // @ts-ignore
    forceSwcTransforms: false,
  },
};

export default nextConfig;