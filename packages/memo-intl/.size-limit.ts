import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: 'Everything (ESM)',
    path: ['dist/index.mjs'],
    import: '*',
    limit: '840B',
  },
  {
    name: 'MIntl (ESM)',
    path: ['dist/index.mjs'],
    import: '{ MIntl }',
    limit: '700B',
  },
  {
    name: 'Everything (CJS)',
    import: '*',
    path: ['dist/index.cjs'],
    limit: '1.50KB',
  },
] satisfies SizeLimitConfig;
