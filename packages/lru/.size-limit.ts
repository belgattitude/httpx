import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: 'import { LruCache } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ LruCache }',
    limit: '570B',
  },
  {
    name: 'import { TimeLruCache } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ TimeLruCache }',
    limit: '680B',
  },
  {
    name: 'require { LruCache } (CJS)',
    import: '{ LruCache }',
    path: ['dist/index.cjs'],
    limit: '680B',
  },
] satisfies SizeLimitConfig;
