[**@httpx/xcache v0.4.2**](../README.md)

***

[@httpx/xcache](../README.md) / XMemCacheOptions

# Type Alias: XMemCacheOptions

> **XMemCacheOptions** = `object`

## Properties

### compressor?

> `optional` **compressor**: [`ICacheCompressor`](../interfaces/ICacheCompressor.md)

***

### lru

> **lru**: `ITimeLruCache`

***

### namespace?

> `optional` **namespace**: `string`

The default namespace is used to prefix the cache key,
allowing for separation of cache entries. If not provided,
it will use 'default'. The default namespace can be overridden
when calling `runAsync`.
