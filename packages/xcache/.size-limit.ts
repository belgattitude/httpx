import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: 'import { XCache } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ XCache }',
    limit: '570B',
  },
] satisfies SizeLimitConfig;
