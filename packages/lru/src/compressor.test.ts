import { compress, decompress } from './compressor';

describe('Compressor tests', () => {
  describe('compress', () => {
    it('should compress a string', async () => {
      const inputString = `abcdefgh`.repeat(10_000);
      const compressed = await compress(inputString);
      expect(compressed).toBeInstanceOf(Uint8Array);
      expect(compressed.byteLength).toBeLessThan(inputString.length);
      const decompressed = await decompress(compressed);
      expect(decompressed).toBe(inputString);
    });
  });
});
