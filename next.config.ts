import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/ftbp-website" : "",
  assetPrefix: isProd ? "/ftbp-website" : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? "/ftbp-website" : "",
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
