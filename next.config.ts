import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/mahabank-digidoc-portal",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
