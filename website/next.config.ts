import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Keep this app independent of the product Next.js app one level up.
  turbopack: {
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;
