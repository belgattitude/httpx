import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: 'Everything (ESM)',
    path: ['dist/index.mjs'],
    import: '*',
    limit: '830B',
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
  {
    name: 'createStableHashOrThrow (ESM)',
    path: ['dist/index.mjs'],
    import: '{ createStableHashOrThrow }',
    limit: '610B',
  },
  {
    name: 'createStableHash (ESM)',
    path: ['dist/index.mjs'],
    import: '{ createStableHash }',
    limit: '635B',
  },
] satisfies SizeLimitConfig;
