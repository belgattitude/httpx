import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: 'Everything (ESM)',
    path: ['dist/index.js'],
    import: '*',
    limit: '1.15KB',
  },
  {
    name: 'Only parseDsn (ESM)',
    path: ['dist/index.js'],
    import: '{ parseDsn }',
    limit: '785B',
  },
  {
    name: 'Everything (CJS)',
    import: '*',
    path: ['dist/index.cjs'],
    limit: '1.40KB',
  },
] satisfies SizeLimitConfig;
