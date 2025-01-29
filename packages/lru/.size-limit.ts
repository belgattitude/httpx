import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: 'import { TinyLRU } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ TinyLRU }',
    limit: '630B',
  },
  {
    name: 'require { TinyLRU } (CJS)',
    import: '{ TinyLRU }',
    path: ['dist/index.cjs'],
    limit: '730B',
  },
] satisfies SizeLimitConfig;
