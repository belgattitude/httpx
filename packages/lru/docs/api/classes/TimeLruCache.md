[**@httpx/lru v0.10.1**](../README.md)

***

[@httpx/lru](../README.md) / TimeLruCache

# Class: TimeLruCache\<TValue, TKey\>

Double linked list based lru cache that supports get in O(1) and time to live for each entry

## Type Parameters

### TValue

`TValue` *extends* [`SupportedCacheValues`](../type-aliases/SupportedCacheValues.md) = [`SupportedCacheValues`](../type-aliases/SupportedCacheValues.md)

### TKey

`TKey` *extends* [`BaseCacheKeyTypes`](../type-aliases/BaseCacheKeyTypes.md) = `string`

## Implements

- [`ITimeLruCache`](../interfaces/ITimeLruCache.md)\<`TValue`, `TKey`\>

## Constructors

### Constructor

> **new TimeLruCache**\<`TValue`, `TKey`\>(`params`): `TimeLruCache`\<`TValue`, `TKey`\>

Create a new LruCache instance

#### Parameters

##### params

[`TimeLruCacheParams`](../type-aliases/TimeLruCacheParams.md)\<`TValue`, `TKey`\>

#### Returns

`TimeLruCache`\<`TValue`, `TKey`\>

#### Example

```typescript
import { TimeLruCache } from '@httpx/lru';

const THIRTY_SECONDS_IN_MILLIS = 30_000

const lru = new TimeLruCache({ maxSize: 1000, defaultTTL: THIRTY_SECONDS_IN_MILLIS});
lru.set('🦄', ['cool', 'stuff'], THIRTY_SECONDS_IN_MILLIS);
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

### params

#### Get Signature

> **get** **params**(): `object`

Return the current size of the cache

##### Returns

`object`

###### defaultTTL

> **defaultTTL**: `number`

###### maxSize

> **maxSize**: `number`

Return the params

#### Implementation of

[`ITimeLruCache`](../interfaces/ITimeLruCache.md).[`params`](../interfaces/ITimeLruCache.md#params)

***

### size

#### Get Signature

> **get** **size**(): `number`

Return the current number of entries in the cache

##### Returns

`number`

Return the current number of items in the cache

#### Implementation of

[`ITimeLruCache`](../interfaces/ITimeLruCache.md).[`size`](../interfaces/ITimeLruCache.md#size)

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

[`ITimeLruCache`](../interfaces/ITimeLruCache.md).[`[iterator]`](../interfaces/ITimeLruCache.md#iterator)

***

### clear()

> **clear**(): `number`

Clear all entries from the cache and return the number of deleted items

#### Returns

`number`

#### Implementation of

[`ITimeLruCache`](../interfaces/ITimeLruCache.md).[`clear`](../interfaces/ITimeLruCache.md#clear)

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

[`ITimeLruCache`](../interfaces/ITimeLruCache.md).[`delete`](../interfaces/ITimeLruCache.md#delete)

***

### get()

> **get**(`key`): `undefined` \| `TValue`

Get an item from the cache or return undefined if it doesn't exist or
has expired.

Item will be marked as most recently used.

```typescript
import { TimeLruCache } from '@httpx/lru';

const lru = new TimeLruCache({
  maxSize: 1,
  defaultTTL: 30_000, // 30 seconds
});

lru.set('key0', 'value0');
lru.get('key0');   // 👈 'value0'
lru.get('key1');   // 👈 undefined
```

#### Parameters

##### key

`TKey`

#### Returns

`undefined` \| `TValue`

#### Implementation of

[`ITimeLruCache`](../interfaces/ITimeLruCache.md).[`get`](../interfaces/ITimeLruCache.md#get)

***

### getOrSet()

> **getOrSet**(`key`, `valueOrFn`, `ttl?`): `TValue`

Get an item from the cache, if the item doesn't exist or has expired
it will create a new entry with the provided value and returns it.

In case of a new entry:
 - it will be marked as most recently used.
 - an eviction will be triggered if the maximum capacity is reached
   or the item has expired.

#### Parameters

##### key

`TKey`

##### valueOrFn

`TValue` | () => `TValue`

##### ttl?

`number`

#### Returns

`TValue`

#### Example

```typescript
const lru = new TimeLruCache({ maxSize: 2 });
lru.set('key1', 'value1');
lru.getOrSet('key1', () => 'value2');  // 👈 'value1' (entry exists)
lru.getOrSet('key2', () => 'value2');  // 👈 'value2' (new entry)
lru.has('key2');                       // 👈 true (it was added)
lru.get('key1');                       // 👈 'value1'

// Will trigger an eviction as capacity (2) is reached.
lru.getOrSet('key3', () => 'value3');

lru.get('key1');                       // 👈 undefined (first entry was evicted)
```

#### Implementation of

[`ITimeLruCache`](../interfaces/ITimeLruCache.md).[`getOrSet`](../interfaces/ITimeLruCache.md#getorset)

***

### has()

> **has**(`key`, `options?`): `boolean`

Checks whether an entry exist and hasn't expired.

If the entry exists but has expired, it will be removed automatically
and trigger the `onEviction` callback if present.

The item will be marked as recently used only if either

 - the global cache `touchOnHas` option is true (default: false)
 - or the `touch` option is true (default false)

#### Parameters

##### key

`TKey`

##### options?

[`LruCacheHasOptions`](../interfaces/LruCacheHasOptions.md)

#### Returns

`boolean`

#### Example

```typescript
import { TimeLruCache } from '@httpx/lru';

const oneSecondInMillis = 1000;

const lru = new TimeLruCache({
  maxSize: 1,
  defaultTTL: oneSecondInMillis,
  // 👇 Optional, default to noop
  onEviction: () => { console.log('evicted') }
  // 👇 Optional, default to false
  touchOnHas: false,
});

lru.set('key0', 'value0', 2 * oneSecondInMillis);

// 👇 Will evict key0 as maxSize is 1 and trigger onEviction
lru.set('key1', 'value1', 2 * oneSecondInMillis);

lru.has('key0'); // 👈 false (item does not exist)
lru.has('key1'); // 👈 true  (item is present and is not expired)

lru.has('key1', {
  // 👇 Optional, default to global touchOnHas
  touch: false
}); // 👈 true  (item is present)

const value = lru.get('key1'); // 👈 'value1' (item is present and is not expired)

// 🕛 wait 3 seconds, time for the item to expire

lru.has('key1'); // 👈 false (item is present but expired - 👋 onEviction will be called)

```

#### Implementation of

[`ITimeLruCache`](../interfaces/ITimeLruCache.md).[`has`](../interfaces/ITimeLruCache.md#has)

***

### peek()

> **peek**(`key`): `undefined` \| `TValue`

Get an item without marking it as recently used. Will return undefined if
the item doesn't exist or has expired (ttl).

Note that peek doesn't evict items that have expired, but will
return undefined if they have.

#### Parameters

##### key

`TKey`

#### Returns

`undefined` \| `TValue`

#### Implementation of

[`ITimeLruCache`](../interfaces/ITimeLruCache.md).[`peek`](../interfaces/ITimeLruCache.md#peek)

***

### set()

> **set**(`key`, `value`, `ttl?`): `boolean`

Add a new entry to the cache and overwrite value if the key was already
present. It will move the item as the most recently used.

If maximum capacity is reached and eviction will be done and the
onEviction callback will be triggered.

```typescript
import { TimeLruCache } from '@httpx/lru';

const lru = new TimeLruCache({
  maxSize: 1,
  defaultTTL: 30_000, // 30 seconds in millis
  onEviction: () => { console.log('evicted') }
});

lru.set('key0', 'value0', 1000); // 👈 true     (new key, size increase)
lru.set('key0', 'valuex', 1000); // 👈 false    (existing key, no size increase)
lru.get('key0');                 // 👈 'valuex'

// 👇 Will evict key0 as maximum capacity is reached
lru.set('key1', 'value1', 1000);
```

#### Parameters

##### key

`TKey`

##### value

`TValue`

##### ttl?

`number`

#### Returns

`boolean`

#### Implementation of

[`ITimeLruCache`](../interfaces/ITimeLruCache.md).[`set`](../interfaces/ITimeLruCache.md#set)
