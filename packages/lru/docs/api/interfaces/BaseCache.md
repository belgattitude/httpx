[**@httpx/lru v0.6.0**](../README.md)

***

[@httpx/lru](../README.md) / BaseCache

# Interface: BaseCache\<TValue, TKey\>

## Type Parameters

• **TValue** *extends* [`SupportedCacheValues`](../type-aliases/SupportedCacheValues.md) = [`SupportedCacheValues`](../type-aliases/SupportedCacheValues.md)

• **TKey** *extends* [`BaseCacheKeyTypes`](../type-aliases/BaseCacheKeyTypes.md) = `string`

## Properties

### \[iterator\]()

> **\[iterator\]**: () => `IterableIterator`\<\[`TKey`, `TValue`\]\>

Iterate over the cache from the least recently used to the most recently used.

#### Returns

`IterableIterator`\<\[`TKey`, `TValue`\]\>

***

### clear()

> **clear**: () => `void`

Clear all entries from the cache and return the number of deleted items

#### Returns

`void`

***

### delete()

> **delete**: (`key`) => `boolean`

Delete an item from the cache and return a boolean indicating
if the item was actually deleted in case it exist.

#### Parameters

##### key

`TKey`

#### Returns

`boolean`

***

### get()

> **get**: (`key`) => `undefined` \| `TValue`

Get an item from the cache or return undefined if it doesn't exist

#### Parameters

##### key

`TKey`

#### Returns

`undefined` \| `TValue`

***

### getOrSet()

> **getOrSet**: (`key`, `valueOrFn`) => `TValue`

Get an item from the cache without overwriting it if it already exists.

#### Parameters

##### key

`TKey`

##### valueOrFn

`TValue` | () => `TValue`

#### Returns

`TValue`

#### See

upcoming proposal https://github.com/tc39/proposal-upsert

#### Example

```typescript
const lru = new LruCache({ maxSize: 2 });
lru.set('key1', 'value1');
lru.getOrSet('key1', 'value2'); // 👈 will not overwrite the value
lru.getOrSet('key2', () => 'value2');
console.log(lru.get('key1')); // value1
```

***

### has()

> **has**: (`key`, `options`?) => `boolean`

Check if an item exists.

#### Parameters

##### key

`TKey`

##### options?

[`BaseLruHasOptions`](BaseLruHasOptions.md)

#### Returns

`boolean`

***

### peek()

> **peek**: (`key`) => `undefined` \| `TValue`

Get an item without marking it as recently used or undefined if item doesn't exist.

#### Parameters

##### key

`TKey`

#### Returns

`undefined` \| `TValue`

***

### size

> **size**: `number`

Return the current size of the cache
