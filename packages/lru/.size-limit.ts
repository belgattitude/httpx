import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: 'import { LruCache } (ESM)',
    path: ['dist/index.js'],
    import: '{ LruCache }',
    limit: '570B',
  },
  {
    name: 'import { getOrCreateLruCache } (ESM)',
    path: ['dist/index.js'],
    import: '{ getOrCreateLruCache }',
    limit: '645B',
  },
  {
    name: 'import { TimeLruCache } (ESM)',
    path: ['dist/index.js'],
    import: '{ TimeLruCache }',
    limit: '661B',
  },
  {
    name: 'import { getOrCreateTimeLruCache } (ESM)',
    path: ['dist/index.js'],
    import: '{ getOrCreateTimeLruCache }',
    limit: '750B',
  },
  {
    name: 'require { LruCache } (CJS)',
    import: '{ LruCache }',
    path: ['dist/index.cjs'],
    limit: '650B',
  },
] satisfies SizeLimitConfig;
