import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: 'import xxhash-wasm (ESM)',
    path: ['dist/xxhash-wasm/index.js'],
    import: '*',
    limit: '810B',
  },
] satisfies SizeLimitConfig;
