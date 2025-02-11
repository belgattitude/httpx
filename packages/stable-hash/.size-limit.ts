import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: 'Everything (ESM)',
    path: ['dist/index.mjs'],
    import: '*',
    limit: '630B',
  },
  {
    name: 'createStableKey (ESM)',
    path: ['dist/index.mjs'],
    import: '{ createStableKey }',
    limit: '480B',
  },
] satisfies SizeLimitConfig;
