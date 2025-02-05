import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: 'Everything (ESM)',
    path: ['dist/index.mjs'],
    import: '*',
    limit: '1KB',
  },
  {
    name: 'sortObjKeys (ESM)',
    path: ['dist/index.mjs'],
    import: '{ sortObjKeys } ',
    limit: '30B',
  },
] satisfies SizeLimitConfig;
