import type { SizeLimitConfig } from 'size-limit';

const config = [
  {
    name: 'Everything (ESM)',
    path: ['dist/index.js'],
    import: '*',
    limit: '965B',
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

export default config;