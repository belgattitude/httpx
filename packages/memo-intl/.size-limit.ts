import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: 'Everything (ESM)',
    path: ['dist/index.mjs'],
    import: '*',
    limit: '920B',
  },
  {
    name: 'MIntl (ESM)',
    path: ['dist/index.mjs'],
    import: '{ MIntl }',
    limit: '780B',
  },
  {
    name: 'Everything (CJS)',
    import: '*',
    path: ['dist/index.cjs'],
    limit: '1.60KB',
  },
] satisfies SizeLimitConfig;
