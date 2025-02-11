import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: 'Everything (ESM)',
    path: ['dist/index.mjs'],
    import: '*',
    limit: '680B',
  },
  {
    name: 'createStableKeyOrThrow (ESM)',
    path: ['dist/index.mjs'],
    import: '{ createStableKeyOrThrow }',
    limit: '480B',
  },
  {
    name: 'createStableKey (ESM)',
    path: ['dist/index.mjs'],
    import: '{ createStableKey }',
    limit: '520B',
  },
] satisfies SizeLimitConfig;
