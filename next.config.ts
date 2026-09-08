import type { NextConfig } from "next";

const onGitHubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  ...(onGitHubPages
    ? {
        basePath: "/klavia",
        assetPrefix: "/klavia",
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
