[**@httpx/lru v0.6.0**](../README.md)

***

[@httpx/lru](../README.md) / LruCache

# Class: LruCache\<TValue, TKey\>

Double linked list based lru cache that supports get in O(1)

## Type Parameters

• **TValue** *extends* [`SupportedCacheValues`](../type-aliases/SupportedCacheValues.md) = [`SupportedCacheValues`](../type-aliases/SupportedCacheValues.md)

• **TKey** *extends* [`BaseCacheKeyTypes`](../type-aliases/BaseCacheKeyTypes.md) = `string`

## Implements

- [`BaseCache`](../interfaces/BaseCache.md)\<`TValue`, `TKey`\>

## Constructors

### new LruCache()

> **new LruCache**\<`TValue`, `TKey`\>(`params`): [`LruCache`](LruCache.md)\<`TValue`, `TKey`\>

Create a new LruCache instance

#### Parameters

##### params

`LruCacheParams`\<`TValue`, `TKey`\>

#### Returns

[`LruCache`](LruCache.md)\<`TValue`, `TKey`\>

#### Example

```typescript
import { LruCache } from '@httpx/lru';

const lru = new LruCache({ maxSize: 1000 });
lru.set('🦄', ['cool', 'stuff']);
if (lru.has('🦄')) {;
 console.log(lru.get('🦄'));
 // ['cool', 'stuff']
}
console.log(lru.size); // 1
lru.delete('🦄');
console.log(lru.size); // 0
lru.clear();
```

## Accessors

### size

#### Get Signature

> **get** **size**(): `number`

Return the current size of the cache

##### Returns

`number`

Return the current size of the cache

#### Implementation of

[`BaseCache`](../interfaces/BaseCache.md).[`size`](../interfaces/BaseCache.md#size)

## Methods

### \[iterator\]()

> **\[iterator\]**(): `IterableIterator`\<\[`TKey`, `TValue`\]\>

Iterate over the cache from the least recently used to the most recently used.

#### Returns

`IterableIterator`\<\[`TKey`, `TValue`\]\>

#### Implementation of

[`BaseCache`](../interfaces/BaseCache.md).[`[iterator]`](../interfaces/BaseCache.md#iterator)

***

### clear()

> **clear**(): `number`

Clear all entries from the cache and return the number of deleted items

#### Returns

`number`

#### Implementation of

[`BaseCache`](../interfaces/BaseCache.md).[`clear`](../interfaces/BaseCache.md#clear)

***

### delete()

> **delete**(`key`): `boolean`

Delete an item from the cache and return a boolean indicating
if the item was actually deleted in case it exist.

#### Parameters

##### key

`TKey`

#### Returns

`boolean`

#### Implementation of

[`BaseCache`](../interfaces/BaseCache.md).[`delete`](../interfaces/BaseCache.md#delete)

***

### get()

> **get**(`key`): `undefined` \| `TValue`

Get an item from the cache or return undefined if it doesn't exist

#### Parameters

##### key

`TKey`

#### Returns

`undefined` \| `TValue`

#### Implementation of

[`BaseCache`](../interfaces/BaseCache.md).[`get`](../interfaces/BaseCache.md#get)

***

### getOrSet()

> **getOrSet**(`key`, `valueOrFn`): `TValue`

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

#### Examples

```typescript
const lru = new LruCache({ maxSize: 2 });
lru.set('key1', 'value1');
lru.getOrSet('key1', 'value2'); // 👈 will not overwrite the value
lru.getOrSet('key2', () => 'value2');
console.log(lru.get('key1')); // value1
```

```typescript
const lru = new LruCache({ maxSize: 2 });
lru.set('key1', 'value1');
lru.getOrSet('key1', 'value2');    // 👈 will not overwrite the value
lru.getOrSet('key2', () => true)); // 👈 with callback
console.log(lru.get('key1')); // value1
```

#### See

upcoming proposal https://github.com/tc39/proposal-upsert

#### Implementation of

[`BaseCache`](../interfaces/BaseCache.md).[`getOrSet`](../interfaces/BaseCache.md#getorset)

***

### has()

> **has**(`key`, `options`?): `boolean`

Check if an item exists.

#### Parameters

##### key

`TKey`

##### options?

###### touch?

`boolean`

If true, the item will be marked as recently used.

**Default**

```ts
option touchOnHas in the constructor
```

#### Returns

`boolean`

#### Implementation of

[`BaseCache`](../interfaces/BaseCache.md).[`has`](../interfaces/BaseCache.md#has)

***

### peek()

> **peek**(`key`): `undefined` \| `TValue`

Get an item without marking it as recently used or undefined if item doesn't exist.

#### Parameters

##### key

`TKey`

#### Returns

`undefined` \| `TValue`

#### Implementation of

[`BaseCache`](../interfaces/BaseCache.md).[`peek`](../interfaces/BaseCache.md#peek)

***

### set()

> **set**(`key`, `value`): `boolean`

Add a new entry to the cache and overwrite value if the key was already
present.It will move the item as the most recently used.

Note that eviction will happen if maximum capacity is reached..

```typescript
import { LruCache } from '@httpx/lru';

const lru = new LruCache({
  maxSize: 1,
  onEviction: () => { console.log('evicted') }
});

lru.set('key0', 'value0'); // 👈 true (new key, size increase)
lru.set('key0', 'valuex'); // 👈 false (existing key, no size increase)

 // 👇 Will evict key0 as maxSize is 1 and trigger onEviction
lru.set('key2', 'value2'); // 👈 true (existing key, no size increase)
```

#### Parameters

##### key

`TKey`

##### value

`TValue`

#### Returns

`boolean`
