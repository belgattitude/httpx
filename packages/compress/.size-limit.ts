import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: 'Only { Compressor } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ Compressor }',
    limit: '564B',
  },
  {
    name: 'Only { Decompressor } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ Decompressor }',
    limit: '500B',
  },
  {
    name: '{ Decompressor, Compressor } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ Decompressor, Compressor }',
    limit: '670B',
  },
] satisfies SizeLimitConfig;
