import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: 'import { LRUCache } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ LRUCache }',
    limit: '540B',
  },
  {
    name: 'import { TinyLRUCache } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ TinyLRUCache }',
    limit: '365B',
  },
] satisfies SizeLimitConfig;
