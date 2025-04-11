import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: 'Only { Compressor } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ Encoder }',
    limit: '564B',
  },
  {
    name: '{ Decompressor, Compressor } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ Decompressor, Compressor }',
    limit: '670B',
  },
] satisfies SizeLimitConfig;
