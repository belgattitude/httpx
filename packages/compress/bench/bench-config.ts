import { vitestBenchOptionsConfig } from '@httpx/devtools-vitest';

import { Compressor, Decompressor } from '../src';

const isCiOrCodSpeed = vitestBenchOptionsConfig.isCiOrCodSpeed;

export const benchConfig = {
  gzipCompressor: new Compressor('gzip'),
  deflateCompressor: new Compressor('deflate'),
  gzipDecompressor: new Decompressor('gzip'),
  deflateDecompressor: new Decompressor('deflate'),
  longString: `😊-abcdef-éàù-012345`.repeat(isCiOrCodSpeed ? 500 : 500_000),
  benchOptions: {
    iterations: isCiOrCodSpeed ? 2 : 4,
  },
} as const;
