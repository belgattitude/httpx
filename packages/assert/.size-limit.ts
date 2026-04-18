import type { SizeLimitConfig } from 'size-limit';

const config = [
  {
    name: 'Everything (ESM)',
    path: ['dist/index.js'],
    import: '*',
    limit: '1900B',
  },
  {
    name: 'Only isPlainObject (ESM)',
    path: ['dist/index.js'],
    import: '{ isPlainObject }',
    limit: '108B',
  },
  {
    name: 'Only isUuid (ESM)',
    path: ['dist/index.js'],
    import: '{ isUuid }',
    limit: '180B',
  },
  {
    name: 'Only isEan13 (ESM)',
    path: ['dist/index.js'],
    import: '{ isEan13 }',
    limit: '120B',
  },
  {
    name: 'Only assertPlainObject (ESM)',
    path: ['dist/index.js'],
    import: '{ assertPlainObject }',
    limit: '489B',
  },
] satisfies SizeLimitConfig;

export default config;