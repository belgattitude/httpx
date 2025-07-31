import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: 'import { XMemCache } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ XMemCache }',
    limit: '1200B',
  },
  {
    name: 'import { TimeLruCache } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ TimeLruCache }',
    limit: '700B',
  },
] satisfies SizeLimitConfig;
