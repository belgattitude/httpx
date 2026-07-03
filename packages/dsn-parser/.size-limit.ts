import type { SizeLimitConfig } from 'size-limit';

const config = [
  {
    name: 'Everything (ESM)',
    path: ['dist/index.js'],
    import: '*',
    limit: '1.20KB',
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
    limit: '1.45KB',
  },
] satisfies SizeLimitConfig;

export default config;