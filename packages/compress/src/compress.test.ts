import { describe } from 'vitest';

// eslint-disable-next-line unused-imports/no-unused-imports
import type { SupportedCompressionAlgorithm } from './compression-algorithm';
import { Compressor } from './compressor';
import { Decompressor } from './decompressor';
import type { SupportedStringEncodings } from './string-encodings';

const compressionAlgorithms = [
  ['gzip'],
  ['deflate'],
] as const satisfies SupportedCompressionAlgorithm[][];

const encodingAlgorithms = [
  ['base64'],
  ['base64_urlsafe'],
] as const satisfies SupportedStringEncodings[][];

describe.each(compressionAlgorithms)(
  'Tests with algorithm "%s"',
  (algorithm) => {
    const longString = `😊-abcdef-éàù-012345/?=`.repeat(1000);
    const longStringSize = longString.length;

    describe.each(encodingAlgorithms)(
      'Compress & Decompress string with encoding "%s"',
      (encoding) => {
        describe('Compressor.toEncodedString', () => {
          it('should compress the long string by at least 15 times', async () => {
            const comp = new Compressor(algorithm);
            const compressed = await comp.toEncodedString(longString, {
              encoding: encoding,
            });
            expect(compressed.length).toBeGreaterThan(50);
            expect(compressed.length).toBeLessThan(longStringSize / 15);
          });
          it('compressed based64 should match snapshot', async () => {
            const comp = new Compressor(algorithm);
            const compressed = await comp.toEncodedString(longString, {
              encoding: encoding,
            });
            expect(compressed).toMatchSnapshot();
          });
        });

        describe('Decompressor.fromEncodedString', async () => {
          it('should decompress a compressed string', async () => {
            const comp = new Compressor(algorithm);
            const compressed = await comp.toEncodedString(longString, {
              encoding: encoding,
            });
            const decomp = new Decompressor(algorithm);
            const decompressed = await decomp.fromEncodedString(compressed);
            expect(decompressed).toStrictEqual(longString);
          });
        });
      }
    );
  }
);
