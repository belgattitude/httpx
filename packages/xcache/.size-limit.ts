import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: 'import { MCache } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ MCache }',
    limit: '570B',
  },
] satisfies SizeLimitConfig;
