import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: 'import { XMemCache } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ XMemCache }',
    limit: '800B',
  },
  {
    name: 'import { TimeLruCache } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ TimeLruCache }',
    limit: '800B',
  },
] satisfies SizeLimitConfig;
