import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: 'Everything (ESM)',
    path: ['dist/index.mjs'],
    import: '*',
    limit: '1900B',
  },
  {
    name: 'Only isPlainObject (ESM)',
    path: ['dist/index.mjs'],
    import: '{ isPlainObject }',
    limit: '108B',
  },
  {
    name: 'Only isUuid (ESM)',
    path: ['dist/index.mjs'],
    import: '{ isUuid }',
    limit: '180B',
  },
  {
    name: 'Only isEan13 (ESM)',
    path: ['dist/index.mjs'],
    import: '{ isEan13 }',
    limit: '120B',
  },
  {
    name: 'Only assertPlainObject (ESM)',
    path: ['dist/index.mjs'],
    import: '{ assertPlainObject }',
    limit: '489B',
  },
  {
    name: 'Everything (CJS)',
    import: '*',
    path: ['dist/index.cjs'],
    limit: '2600B',
  },
] satisfies SizeLimitConfig;
