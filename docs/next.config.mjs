import path from "node:path";

import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** Useful when you publish the static export in a different basePath */
const basePath = process.env.NEXT_BUILD_ENV_BASE_PATH ?? "";

const monorepoRoot = path.resolve(import.meta.dirname, "..");

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
  reactCompiler: true,
  productionBrowserSourceMaps:
    process.env.NEXT_BUILD_ENV_SOURCEMAPS !== "false",
  typescript: {
    ignoreBuildErrors: process.env.NEXT_BUILD_ENV_TYPECHECK === "false",
  },
  experimental: {
    // Prefer loading of ES Modules over CommonJS
    // @link {https://nextjs.org/blog/next-11-1#es-modules-support|Blog 11.1.0}
    // @link {https://github.com/vercel/next.js/discussions/27876|Discussion}
    // esmExternals: true,
    // Experimental monorepo support
    // @link {https://github.com/vercel/next.js/pull/22867|Original PR}
    // @link {https://github.com/vercel/next.js/discussions/26420|Discussion}
    // externalDir: true,

    turbopackRustReactCompiler: true,
    // see https://nextjs.org/blog/next-16-2-turbopack#lightning-css-configuration
    useLightningcss: true,
    lightningCssFeatures: {
      exclude: ["nesting"],
      include: ["light-dark", "oklab-colors"],
    },
  },
  turbopack: {
    root: monorepoRoot,
    resolveAlias: {
      // See https://github.com/shadcn-ui/cn
      clsx: "cn",
      "tailwind-merge": "cn",
    },
  },
  images: {
    unoptimized: true,
  },
};

export default withMDX(nextConfig);
