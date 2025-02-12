import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: 'import { LruCache } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ LruCache }',
    limit: '560B',
  },
  {
    name: 'import { TimeLruCache } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ TimeLruCache }',
    limit: '660B',
  },
  {
    name: 'require { LruCache } (CJS)',
    import: '{ LruCache }',
    path: ['dist/index.cjs'],
    limit: '640B',
  },
] satisfies SizeLimitConfig;
