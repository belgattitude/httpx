import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: 'import { JwtVerifier } (ESM)',
    path: ['dist/index.js'],
    import: '{ JwtVerifier }',
    limit: '8KB',
  },
] satisfies SizeLimitConfig;
