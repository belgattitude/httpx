import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: 'import { md5 } (ESM)',
    path: ['dist/index.js'],
    import: '{ md5 }',
    limit: '570B',
  },
  {
    name: 'import xxhash-wasm (ESM)',
    path: ['dist/xxhash-wasm/index.js'],
    import: '*',
    limit: '800B',
  },
] satisfies SizeLimitConfig;
