import type { NextConfig } from "next";

// GITHUB_PAGES=true builds a static preview for GitHub Pages
// (served at https://<user>.github.io/indira-naturals/). Normal builds are unchanged.
const isPages = process.env.GITHUB_PAGES === "true";
const basePath = isPages ? "/indira-naturals" : "";

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  ...(isPages
    ? {
        output: "export",
        basePath,
        trailingSlash: true,
        images: { loader: "custom", loaderFile: "./src/lib/image-loader.ts" },
      }
    : {}),
};

export default nextConfig;
