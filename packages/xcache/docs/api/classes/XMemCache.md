[**@httpx/xcache v0.1.0**](../README.md)

***

[@httpx/xcache](../README.md) / XMemCache

# Class: XMemCache

## Constructors

### Constructor

> **new XMemCache**(`options`): `XMemCache`

#### Parameters

##### options

###### keyPrefix?

`string`

###### lru

`ITimeLruCache`

#### Returns

`XMemCache`

## Methods

### clear()

> **clear**(): `number`

Clear the cache and return the number of items removed.

#### Returns

`number`

***

### runAsync()

> **runAsync**\<`TFunction`\>(`params`): `Promise`\<\{ `data`: `Awaited`\<`ReturnType`\<`TFunction`\>\>; \}\>

Execute the provided async function if it's not in the cache, otherwise
return the cached value.

#### Type Parameters

##### TFunction

`TFunction` *extends* [`CacheableAsyncFunction`](../type-aliases/CacheableAsyncFunction.md)

#### Parameters

##### params

[`XCacheRunAsyncParams`](../type-aliases/XCacheRunAsyncParams.md)\<`TFunction`\>

#### Returns

`Promise`\<\{ `data`: `Awaited`\<`ReturnType`\<`TFunction`\>\>; \}\>

#### Example

```typescript
const lru = new TimeLruCache({ maxSize: 50, defaultTTL: 5000 });
const xMemCache = new XMemCache({ lru, keyPrefix: 'namespace1' });

const asyncDataFetcher = async (params: { id: number }) => {
  return { id: params.id, data: `Data for ${params.id}` };
}

const params: { id: number } = { id: 1 };

const { data } = await xMemCache.runAsync({
 key: ['/api/data', params],
 fn: () => asyncDataFetcher(params),
})
```

#### Throws

TypeError if the key is not a valid stable key.
