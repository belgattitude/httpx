import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: 'Everything (ESM)',
    path: ['dist/index.mjs'],
    import: '*',
    limit: '1KB',
  },
  {
    name: 'Everything (CJS)',
    import: '*',
    path: ['dist/index.cjs'],
    limit: '1.30KB',
  },
] satisfies SizeLimitConfig;
