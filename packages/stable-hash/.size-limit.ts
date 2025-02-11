import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: 'Everything (ESM)',
    path: ['dist/index.mjs'],
    import: '*',
    limit: '600B',
  },
  {
    name: 'createStableKey (ESM)',
    path: ['dist/index.mjs'],
    import: '{ createStableKey }',
    limit: '385B',
  },
] satisfies SizeLimitConfig;
