import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: 'import { md5 } (ESM)',
    path: ['dist/index.js'],
    import: '{ md5 }',
    limit: '570B',
  },
] satisfies SizeLimitConfig;
