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

### withCache()

> **withCache**\<`TFunction`\>(`params`): `Promise`\<\{ `data`: `Awaited`\<`ReturnType`\<`TFunction`\>\>; \}\>

Execute the provided async function if it's not in the cache, otherwise
return the cached value.

#### Type Parameters

##### TFunction

`TFunction` *extends* `CacheableAsyncFunction`

#### Parameters

##### params

`WithCacheParams`\<`TFunction`\>

#### Returns

`Promise`\<\{ `data`: `Awaited`\<`ReturnType`\<`TFunction`\>\>; \}\>

#### Throw

Error if the key is not a valid stable key.
