import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/ftbp-website",
  assetPrefix: "/ftbp-website",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
