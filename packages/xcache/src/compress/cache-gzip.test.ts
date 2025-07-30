import { DevalueSerializer } from '../serializer/devalue-serializer';
import { CacheGzip } from './cache-gzip';
import type { CacheCompressSuccessMeta } from './types';

const generateRandomData = (rows: number) => {
  return {
    success: true,
    rows: Array.from({ length: rows }, (_, i) => ({
      id: 1000 + i,
      name: `Item ${1000 + i}`,
      description: `Long description ${1000 + i}`,
      bigint: BigInt(1000 + i),
      date: new Date(Date.now() - i * 1000),
    })),
  };
};

describe('CacheGzip tests', () => {
  it('should compress and decompress data correctly', async () => {
    const cacheGzip = new CacheGzip({
      minimumRatio: 1,
      serializer: new DevalueSerializer(),
    });

    const generatedData = generateRandomData(1000);

    const result = await cacheGzip.compress(generatedData);
    const { meta, status } = result;
    expect(status).toBe('success');
    expect((meta as CacheCompressSuccessMeta).ratio).toBeGreaterThan(2);

    const decompressedData = await cacheGzip.decompress(result);
    expect(decompressedData).toStrictEqual(generatedData);
  });

  it('should not compress simple values', async () => {
    const cacheGzip = new CacheGzip({
      minimumRatio: 1,
      serializer: new DevalueSerializer(),
    });

    const result = await cacheGzip.compress('cool');

    const data = await cacheGzip.decompress(result);
    expect(data).toBe('cool');
  });
});
