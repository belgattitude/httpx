import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: 'Only { isPlainObject } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ isPlainObject }',
    limit: '81B',
  },
  {
    name: 'Only { assertPlainObject } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ assertPlainObject }',
    limit: '135B',
  },
  {
    name: 'Import { assertPlainObject, isPlainObject } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ assertPlainObject, isPlainObject }',
    limit: '143B',
  },
  {
    name: 'Require isPlainObject from CJS',
    import: '{ isPlainObject }',
    path: ['dist/index.cjs'],
    limit: '158KB',
  },
] satisfies SizeLimitConfig;
