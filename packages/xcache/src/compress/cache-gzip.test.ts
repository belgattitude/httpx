import { DevalueSerializer } from '../serializer/devalue-serializer';
import { JsonSerializer } from '../serializer/json-serializer';
import { SuperjsonSerializer } from '../serializer/superjson-serializer';
import type { ICacheSerializer } from '../serializer/types';
import { CacheGzip } from './cache-gzip';
import type {
  CacheCompressSkippedReason,
  CacheCompressSuccessMeta,
} from './types';

const generateArrayOfRecords = (rows: number, extendedTypeSupport: boolean) => {
  return {
    success: true,
    rows: Array.from({ length: rows }, (_, i) => {
      return {
        id: 1000 + i,
        name: `Item ${1000 + i}`,
        description: `Long description ${1000 + i} 🦆`,
        testNull: null,
        ...(extendedTypeSupport
          ? {
              date: new Date(Date.now() - i * 1000),
              bigint: BigInt(1000 + i),
              testUndefined: undefined,
              notNumber: Number.NaN,
            }
          : {}),
      };
    }),
  };
};

describe.each([
  [new DevalueSerializer(), true],
  [new JsonSerializer(), false],
  [new SuperjsonSerializer(), true],
] satisfies [serializer: ICacheSerializer, extendedTypeSupport: boolean][])(
  'CacheGzip tests with %s serializer',
  (serializer, extendedTypeSupport) => {
    it(`should compress and decompress data correctly (${extendedTypeSupport ? 'extendedTypeSupport' : 'nativeTypes'}))`, async () => {
      const cacheGzip = new CacheGzip({
        minimumRatio: 1,
        minimumByteSaving: 4096,
        serializer: serializer,
      });

      const generatedData = generateArrayOfRecords(1000, extendedTypeSupport);

      const result = await cacheGzip.compress(generatedData);
      const { meta, status } = result;
      expect(status).toBe('success');
      expect((meta as CacheCompressSuccessMeta).ratio).toBeGreaterThan(2);

      const decompressedData = await cacheGzip.decompress(result);
      expect(decompressedData).toStrictEqual(generatedData);
    });

    it('should skip compression for strings not meeting minimum length', async () => {
      const cacheGzip = new CacheGzip({
        serializer: serializer,
        minimumStringLength: 3,
      });
      const result = await cacheGzip.compress('ab');
      expect(result.status).toBe('skipped');
      expect((result.meta as any).reason).toStrictEqual(
        'minimum_string_length_not_met'
      );
    });

    it('should not skip compression for strings meeting minimum length', async () => {
      const cacheGzip = new CacheGzip({
        serializer: serializer,
        minimumStringLength: 1,
        minimumRatio: 0.1,
        minimumByteSaving: 0,
      });
      const result = await cacheGzip.compress('ab');
      expect(result.status).toBe('success');
    });

    it.each([
      ['boolean', true, 'trivial_value'],
      ['number', 10, 'trivial_value'],
      ['bigint', BigInt(10), 'trivial_value'],
      ['null', null, 'trivial_value'],
      ['undefined', undefined, 'trivial_value'],
      ['empty_array', [], 'trivial_value'],
    ] satisfies [string, unknown, CacheCompressSkippedReason][])(
      'should not compress "%s" values',
      async (_label, val, reason) => {
        const cacheGzip = new CacheGzip({ serializer });

        const result = await cacheGzip.compress(val);
        expect(result.status).toBe('skipped');
        expect(result.meta).toStrictEqual({
          reason,
        });

        const data = await cacheGzip.decompress(result);
        expect(data).toStrictEqual(val);
      }
    );
    it('should skip compression when minimum ratio is not met', async () => {
      const cacheGzip = new CacheGzip({
        serializer,
        minimumRatio: 2,
        minimumStringLength: 1,
        minimumByteSaving: 0,
      });
      const result = await cacheGzip.compress('ab');
      expect(result.status).toBe('skipped');
      expect((result.meta as any).reason).toBe('minimum_ratio_not_met');
      const data = await cacheGzip.decompress(result);
      expect(data).toBe('ab');
    });

    it('should not skip compression when minimum ratio is met', async () => {
      const cacheGzip = new CacheGzip({
        serializer,
        minimumRatio: 1.5,
        minimumStringLength: 1,
        minimumByteSaving: 128,
      });
      const result = await cacheGzip.compress('ab'.repeat(256));
      expect(result.status).toBe('success');
    });

    it('should skip compression when minimum byte saving is not met', async () => {
      const cacheGzip = new CacheGzip({
        serializer,
        minimumRatio: 1.5,
        minimumStringLength: 1,
        minimumByteSaving: 256,
      });
      const result = await cacheGzip.compress('ab'.repeat(128));
      expect(result.status).toBe('skipped');
      expect((result.meta as any).reason).toBe('minimum_byte_saving_not_met');
    });
  }
);
