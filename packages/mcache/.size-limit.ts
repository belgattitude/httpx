import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: 'import { LruCache } (ESM)',
    path: ['dist/index.mjs'],
    //import: '{ LruCache }',
    limit: '570B',
  },
] satisfies SizeLimitConfig;
