import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: 'Only { Compressor } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ Compressor }',
    limit: '530B',
  },
  {
    name: 'Only { Deompressor } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ Decompressor }',
    limit: '530B',
  },
] satisfies SizeLimitConfig;
