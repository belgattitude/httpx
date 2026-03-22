import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: 'Only { Compressor } (ESM)',
    path: ['dist/index.js'],
    import: '{ Compressor }',
    limit: '568B',
  },
  {
    name: 'Only { Decompressor } (ESM)',
    path: ['dist/index.js'],
    import: '{ Decompressor }',
    limit: '450B',
  },
  {
    name: '{ Decompressor, Compressor } (ESM)',
    path: ['dist/index.js'],
    import: '{ Decompressor, Compressor }',
    limit: '697B',
  },
] satisfies SizeLimitConfig;
