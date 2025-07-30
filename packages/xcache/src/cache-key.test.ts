import { type CacheKeyTuple, genCacheKeyString } from './cache-key';

describe('genCacheKeyString', () => {
  it('should generate a stable cache key string', () => {
    const key: CacheKeyTuple = ['/api/user', { id: 1 }];
    const result = genCacheKeyString({ key });
    expect(typeof result).toBe('string');
    expect(result).toStrictEqual('{"key":["/api/user",{"id":1}]}');
  });

  it('should include namespace in the cache key string', () => {
    const key: CacheKeyTuple = ['/api/user', { id: 2 }];
    const namespace = 'test';
    const result = genCacheKeyString({ key, namespace });
    expect(result).toStrictEqual('{"key":["/api/user",{"id":2}],"ns":"test"}');
  });

  it('should throw TypeError for invalid key', () => {
    // @ts-expect-error: invalid key type
    expect(() => genCacheKeyString({ key: null })).toThrow(TypeError);
  });

  it('should throw TypeError for invalid key, empty string', () => {
    expect(() => genCacheKeyString({ key: [''] })).toThrow(TypeError);
  });
});
