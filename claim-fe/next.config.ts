import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  async redirects() {
    return [
      {
        source: "/login",
        destination: "/signin",
        permanent: true,
      },
    ];
  },

  webpack(config) {
    // ✅ Support for @svgr/webpack
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    // ✅ Add alias for "@"
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname, "src"),
    };

    return config;
  },
};

export default nextConfig;
