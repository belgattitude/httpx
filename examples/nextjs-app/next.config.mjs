// @ts-check

const trueEnv = ['true', '1', 'yes'];

const NEXTJS_IGNORE_ESLINT = trueEnv.includes(
  process.env?.NEXTJS_IGNORE_ESLINT ?? 'false'
);
const NEXTJS_IGNORE_TYPECHECK = trueEnv.includes(
  process.env?.NEXTJS_IGNORE_TYPECHECK ?? 'false'
);

const TYPESCRIPT_CONFIG = process.env.TSCONFIG ?? './tsconfig.json';

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['src'],
    ignoreDuringBuilds: NEXTJS_IGNORE_ESLINT,
  },
  experimental: {
    // Prefer loading of ES Modules over CommonJS
    // @link {https://nextjs.org/blog/next-11-1#es-modules-support|Blog 11.1.0}
    // @link {https://github.com/vercel/next.js/discussions/27876|Discussion}
    esmExternals: true,
    // Experimental monorepo support
    // @link {https://github.com/vercel/next.js/pull/22867|Original PR}
    // @link {https://github.com/vercel/next.js/discussions/26420|Discussion}
    externalDir: true,
  },
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: NEXTJS_IGNORE_TYPECHECK,
    tsconfigPath: TYPESCRIPT_CONFIG,
  },
};

export default nextConfig;
