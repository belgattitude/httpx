import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: 'Everything (ESM)',
    path: ['dist/index.mjs'],
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
