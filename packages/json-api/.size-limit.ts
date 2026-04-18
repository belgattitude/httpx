import type { SizeLimitConfig } from 'size-limit';

const config = [
  {
    name: 'Everything (ESM)',
    path: ['dist/index.js'],
    import: '*',
    limit: '1.15KB',
    webpack: false,
  },
  {
    name: 'Everything (CJS)',
    path: ['dist/index.cjs'],
    import: '*',
    limit: '1.15KB',
    webpack: false,
  },
] satisfies SizeLimitConfig;

export default config;