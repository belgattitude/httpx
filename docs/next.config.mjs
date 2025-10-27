import { default as nextra } from 'nextra';

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  staticImage: true,
  defaultShowCopyCode: true,
});

/** Useful when you publish the static export in a different basePath */
const basePath = process.env.NEXT_BUILD_ENV_BASE_PATH ?? undefined;

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  ...(basePath ? { basePath } : {}),
  output: 'export',
  productionBrowserSourceMaps:
    process.env.NEXT_BUILD_ENV_SOURCEMAPS !== 'false',
  typescript: {
    ignoreBuildErrors: process.env.NEXT_BUILD_ENV_TYPECHECK === 'false',
  },
  images: {
    unoptimized: true,
  },
};

export default withNextra(nextConfig);
