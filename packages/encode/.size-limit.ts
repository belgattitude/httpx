import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: 'Only { Base64 } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ Base64 }',
    limit: '564B',
  },
] satisfies SizeLimitConfig;
