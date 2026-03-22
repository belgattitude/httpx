import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: 'import { LruCache } (ESM)',
    path: ['dist/index.js'],
    import: '{ LruCache }',
    limit: '600B',
  },
  {
    name: 'import { getOrCreateLruCache } (ESM)',
    path: ['dist/index.js'],
    import: '{ getOrCreateLruCache }',
    limit: '675B',
  },
  {
    name: 'import { TimeLruCache } (ESM)',
    path: ['dist/index.js'],
    import: '{ TimeLruCache }',
    limit: '695B',
  },
  {
    name: 'import { getOrCreateTimeLruCache } (ESM)',
    path: ['dist/index.js'],
    import: '{ getOrCreateTimeLruCache }',
    limit: '770B',
  }
] satisfies SizeLimitConfig;
