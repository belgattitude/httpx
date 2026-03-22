import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: 'Everything (ESM)',
    path: ['dist/index.js'],
    import: '*',
    limit: '955B',
  },
  {
    name: 'MIntl (ESM)',
    path: ['dist/index.js'],
    import: '{ MIntl }',
    limit: '825B',
  },
  {
    name: 'Everything (CJS)',
    import: '*',
    path: ['dist/index.cjs'],
    limit: '1.67KB',
  },
] satisfies SizeLimitConfig;
