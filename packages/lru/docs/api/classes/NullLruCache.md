[**@httpx/lru v0.12.0**](../README.md)

***

[@httpx/lru](../README.md) / NullLruCache

# Class: NullLruCache\<TValue, TKey\>

## Type Parameters

### TValue

`TValue` *extends* [`SupportedCacheValues`](../type-aliases/SupportedCacheValues.md) = [`SupportedCacheValues`](../type-aliases/SupportedCacheValues.md)

### TKey

`TKey` *extends* [`BaseCacheKeyTypes`](../type-aliases/BaseCacheKeyTypes.md) = `string`

## Implements

- [`ILruCache`](../interfaces/ILruCache.md)\<`TValue`, `TKey`\>

## Constructors

### Constructor

> **new NullLruCache**\<`TValue`, `TKey`\>(`_params`): `NullLruCache`\<`TValue`, `TKey`\>

Create a new NullLruCache (does cache nothing)

#### Parameters

##### \_params

[`LruCacheParams`](../type-aliases/LruCacheParams.md)\<`TValue`, `TKey`\>

#### Returns

`NullLruCache`\<`TValue`, `TKey`\>

#### Example

```typescript
import { NullLruCache } from '@httpx/lru';

const lru = new NullLruCache({ maxSize: 1000 });
```

## Properties

### params

> `readonly` **params**: `object`

Return the params

#### maxSize

> **maxSize**: `number` = `0`

#### Implementation of

[`ILruCache`](../interfaces/ILruCache.md).[`params`](../interfaces/ILruCache.md#params)

***

### size

> `readonly` **size**: `0` = `0`

Return the current number of items in the cache

#### Implementation of

[`ILruCache`](../interfaces/ILruCache.md).[`size`](../interfaces/ILruCache.md#size)

## Methods

### \[iterator\]()

> **\[iterator\]**(): `IterableIterator`\<\[`TKey`, `TValue`\]\>

Iterate over the cache from the least recently used to the most recently used.

```typescript
const lru = new LruCache({ maxSize: 2 });
lru.set('key1', 'value1');
lru.set('key2', 'value2');
lru.set('key3', 'value3');
// trigger a get to move key2 to the head
lru.get('key2');
const results = [];
// iterate over the cache entries
for (const [key, value] of lru) {
  results.push([key, value]);
}
expect(results).toStrictEqual([
   ['key3', 'value3'], // Least recently used
   ['key2', 'value2'], // Most recently used
]);
```

#### Returns

`IterableIterator`\<\[`TKey`, `TValue`\]\>

#### Implementation of

[`ILruCache`](../interfaces/ILruCache.md).[`[iterator]`](../interfaces/ILruCache.md#iterator)

***

### clear()

> **clear**(): `number`

Clear all entries from the cache and return the number of deleted items

#### Returns

`number`

#### Implementation of

[`ILruCache`](../interfaces/ILruCache.md).[`clear`](../interfaces/ILruCache.md#clear)

***

### delete()

> **delete**(`_key`): `boolean`

Delete an item from the cache and return a boolean indicating
if the item was actually deleted in case it exist.

#### Parameters

##### \_key

`TKey`

#### Returns

`boolean`

#### Implementation of

[`ILruCache`](../interfaces/ILruCache.md).[`delete`](../interfaces/ILruCache.md#delete)

***

### get()

> **get**(`_key`): `undefined`

Get an item from the cache or return undefined if it doesn't exist.
Item will be marked as most recently used.

```typescript
import { LruCache } from '@httpx/lru';

const lru = new LruCache({ maxSize: 1 });

lru.set('key0', 'value0');
lru.get('key0');   // 👈 'value0'
lru.get('key1');   // 👈 undefined
```

#### Parameters

##### \_key

`TKey`

#### Returns

`undefined`

#### Implementation of

[`ILruCache`](../interfaces/ILruCache.md).[`get`](../interfaces/ILruCache.md#get)

***

### getOrSet()

> **getOrSet**\<`T`\>(`_key`, `valueOrFn`): `T`

Get an item from the cache, if the item doesn't exist it will
create a new entry with the provided value and returns it.

In case of a new entry:
 - it will be marked as most recently used.
 - an eviction will be triggered if the maximum capacity is reached

#### Type Parameters

##### T

`T` *extends* [`SupportedCacheValues`](../type-aliases/SupportedCacheValues.md)

#### Parameters

##### \_key

`TKey`

##### valueOrFn

`T` | () => `T`

#### Returns

`T`

#### Example

```typescript
const lru = new LruCache({ maxSize: 2 });
lru.set('key1', 'value1');
lru.getOrSet('key1', () => 'value2');  // 👈 'value1' (entry exists)
lru.getOrSet('key2', () => 'value2');  // 👈 'value2' (new entry)
lru.has('key2');                       // 👈 true (it was added)
lru.get('key1');                       // 👈 'value1'

// Will trigger an eviction as capacity (2) is reached.
lru.getOrSet('key3', () => 'value3');

lru.get('key1'); // 👈 undefined (first entry was evicted)
```

#### Implementation of

[`ILruCache`](../interfaces/ILruCache.md).[`getOrSet`](../interfaces/ILruCache.md#getorset)

***

### has()

> **has**(`_key`, `_options?`): `boolean`

Checks whether an entry exist.

The item will be marked as recently used only if either

 - the global cache `touchOnHas` option is true (default: false)
 - or the `touch` option is true (default false)

#### Parameters

##### \_key

`TKey`

##### \_options?

[`LruCacheHasOptions`](../interfaces/LruCacheHasOptions.md)

#### Returns

`boolean`

#### Example

```typescript
import { LruCache } from '@httpx/lru';

const lru = new LruCache({
  maxSize: 1,
  // 👇 Optional, default to false
  touchOnHas: false,
});

lru.set('key0', 'value0');
// 👇 Will evict key0 as maxSize is 1
lru.set('key1', 'value1');

lru.has('key0'); // 👈 false
lru.has('key1'); // 👈 true  (item is present)
lru.has('key1', {
  // 👇 Optional, default to global touchOnHas
  touch: false
}); // 👈 true  (item is present)
```

#### Implementation of

[`ILruCache`](../interfaces/ILruCache.md).[`has`](../interfaces/ILruCache.md#has)

***

### peek()

> **peek**(`_key`): `undefined`

Get an item without marking it as recently used or undefined if item doesn't exist.

#### Parameters

##### \_key

`TKey`

#### Returns

`undefined`

#### Implementation of

[`ILruCache`](../interfaces/ILruCache.md).[`peek`](../interfaces/ILruCache.md#peek)

***

### set()

> **set**(`_key`, `_value`): `boolean`

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

##### \_key

`TKey`

##### \_value

`TValue`

#### Returns

`boolean`

#### Implementation of

[`ILruCache`](../interfaces/ILruCache.md).[`set`](../interfaces/ILruCache.md#set)
