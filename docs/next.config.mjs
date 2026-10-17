import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** Useful when you publish the static export in a different basePath */
const basePath = process.env.NEXT_BUILD_ENV_BASE_PATH ?? "";

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  ...(basePath === "" ? {} : { basePath }),
  // fetch() urls (search index, markdown) are not prefixed by next
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  output: "export",
  reactStrictMode: true,
  productionBrowserSourceMaps:
    process.env.NEXT_BUILD_ENV_SOURCEMAPS !== "false",
  typescript: {
    ignoreBuildErrors: process.env.NEXT_BUILD_ENV_TYPECHECK === "false",
  },
  images: {
    unoptimized: true,
  },
};

export default withMDX(nextConfig);
