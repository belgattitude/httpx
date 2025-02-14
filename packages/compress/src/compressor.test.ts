import { describe } from 'vitest';

import { Compressor } from './compressor';
import { DeCompressor } from './decompressor';
import { supportedEncodings } from './encodings';

const testEncodings = [['gzip'], ['deflate']];

describe.each(supportedEncodings)('Tests with encoding "%s"', (encoding) => {
  const longString = `😊-abcdef-éàù-012345`.repeat(1000);
  const longStringSize = longString.length;

  describe('toString', () => {
    it('should compress the long string by at least 15 times', async () => {
      const comp = new Compressor(encoding);
      const compressed = await comp.toString(longString);
      expect(compressed.length).toBeGreaterThan(100);
      expect(compressed.length).toBeLessThan(longStringSize / 15);
    });
  });

  describe('fromString', async () => {
    const comp = new Compressor('gzip');
    const compressed = await comp.toString(longString);
    const decomp = new DeCompressor('gzip');
    const decompressed = await decomp.fromString(compressed);
  });
});
