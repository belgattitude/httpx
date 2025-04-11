import { Compressor, Decompressor } from '../src';

export const benchConfig = {
  gzipCompressor: new Compressor('gzip'),
  deflateCompressor: new Compressor('deflate'),
  gzipDecompressor: new Decompressor('gzip'),
  deflateDecompressor: new Decompressor('deflate'),
  longString: `😊-abcdef-éàù-012345`.repeat(500_000),
  benchOptions: {
    iterations: 4,
  },
} as const;
