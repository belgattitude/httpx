import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: 'import { LRUCache } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ LRUCache }',
    limit: '630B',
  },
  {
    name: 'require { LRUCache } (CJS)',
    import: '{ LRUCache }',
    path: ['dist/index.cjs'],
    limit: '730B',
  },
] satisfies SizeLimitConfig;
