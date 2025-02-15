import { describe } from 'vitest';

import type { SupportedCompressionAlgorithm } from './compression-algorithm';
import { Compressor } from './compressor';
import { Decompressor } from './decompressor';

const testAlgorithms = [
  ['gzip'],
  ['deflate'],
] as const satisfies SupportedCompressionAlgorithm[][];

describe.each(testAlgorithms)('Tests with algorithm "%s"', (algorithm) => {
  const longString = `😊-abcdef-éàù-012345`.repeat(100);
  const longStringSize = longString.length;

  describe('toEncodedString', () => {
    it('should compress the long string by at least 15 times', async () => {
      const comp = new Compressor(algorithm);
      const compressed = await comp.toEncodedString(longString, 'base64');
      expect(compressed.length).toBeGreaterThan(50);
      expect(compressed.length).toBeLessThan(longStringSize / 15);
    });
    it('should match snapshot', async () => {
      const comp = new Compressor(algorithm);
      const compressed = await comp.toEncodedString(longString, 'base64');
      expect(compressed).toMatchSnapshot();
    });
  });

  describe('fromEncodedString', async () => {
    it('should decompress a compressed string', async () => {
      const comp = new Compressor(algorithm);
      const compressed = await comp.toEncodedString(longString, 'base64');
      const decomp = new Decompressor(algorithm);
      const decompressed = await decomp.fromEncodedString(compressed);
      expect(decompressed).toStrictEqual(longString);
    });
  });
});
