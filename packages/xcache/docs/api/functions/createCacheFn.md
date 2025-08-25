[**@httpx/xcache v0.4.2**](../README.md)

***

[@httpx/xcache](../README.md) / createCacheFn

# Function: createCacheFn()

> **createCacheFn**(`options`): \<`TResult`, `TKey`\>(`params`) => `Promise`\<`Result`\<`TResult`\>\>

## Parameters

### options

[`XMemCacheOptions`](../type-aliases/XMemCacheOptions.md)

## Returns

> \<`TResult`, `TKey`\>(`params`): `Promise`\<`Result`\<`TResult`\>\>

Execute the provided async function if it's not in the cache, otherwise
return the cached value.

### Type Parameters

#### TResult

`TResult` *extends* `SupportedCacheValues`

#### TKey

`TKey` *extends* `CacheKeyTuple`

### Parameters

#### params

##### fn

(`params`) => `Promise`\<`TResult`\>

##### key

`TKey`

##### namespace?

`string`

##### ttl?

`number`

### Returns

`Promise`\<`Result`\<`TResult`\>\>

### Example

```typescript
const lru = new TimeLruCache({ maxSize: 50, defaultTTL: 5000 });
const xMemCache = new XMemCache({ lru });

const asyncDataFetcher = async (params: { id: number }) => {
  return { id: params.id, data: `Data for ${params.id}` };
}

const params: { id: number } = { id: 1 };

const { data } = await xMemCache.runAsync({
 key: ['/api/data', params],
 fn: ({ key }) => asyncDataFetcher(params),
})
```

### Throws

TypeError if the key is not a valid stable key.
