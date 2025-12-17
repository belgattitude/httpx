[**@httpx/xcache v0.4.10**](../README.md)

---

[@httpx/xcache](../README.md) / XMemCache

# Class: XMemCache

## Constructors

### Constructor

> **new XMemCache**(`options`): `XMemCache`

#### Parameters

##### options

[`XMemCacheOptions`](../type-aliases/XMemCacheOptions.md)

#### Returns

`XMemCache`

## Methods

### clear()

> **clear**(): `number`

Clear the cache and return the number of items removed.

#### Returns

`number`

---

### runAsync()

> **runAsync**\<`TResult`, `TKey`\>(`params`): `Promise`\<`Result`\<`TResult`\>\>

Execute the provided async function if it's not in the cache, otherwise
return the cached value.

#### Type Parameters

##### TResult

`TResult` _extends_ `SupportedCacheValues`

##### TKey

`TKey` _extends_ `CacheKeyTuple`

#### Parameters

##### params

###### fn

(`params`) => `Promise`\<`TResult`\>

###### key

`TKey`

###### namespace?

`string`

###### ttl?

`number`

#### Returns

`Promise`\<`Result`\<`TResult`\>\>

#### Example

```typescript
const lru = new TimeLruCache({ maxSize: 50, defaultTTL: 5000 });
const xMemCache = new XMemCache({ lru });

const asyncDataFetcher = async (params: { id: number }) => {
  return { id: params.id, data: `Data for ${params.id}` };
};

const params: { id: number } = { id: 1 };

const { data } = await xMemCache.runAsync({
  key: ["/api/data", params],
  fn: ({ key }) => asyncDataFetcher(params),
});
```

#### Throws

TypeError if the key is not a valid stable key.
