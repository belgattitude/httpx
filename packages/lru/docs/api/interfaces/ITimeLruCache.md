[**@httpx/lru v0.12.1**](../README.md)

***

[@httpx/lru](../README.md) / ITimeLruCache

# Interface: ITimeLruCache\<TValue, TKey\>

## Extends

- [`ILruCache`](ILruCache.md)\<`TValue`, `TKey`\>

## Type Parameters

### TValue

`TValue` *extends* [`SupportedCacheValues`](../type-aliases/SupportedCacheValues.md) = [`SupportedCacheValues`](../type-aliases/SupportedCacheValues.md)

### TKey

`TKey` *extends* [`BaseCacheKeyTypes`](../type-aliases/BaseCacheKeyTypes.md) = `string`

## Properties

### \[iterator\]()

> **\[iterator\]**: () => `IterableIterator`\<\[`TKey`, `TValue`\]\>

Iterate over the cache from the least recently used to the most recently used.

#### Returns

`IterableIterator`\<\[`TKey`, `TValue`\]\>

#### Overrides

[`ILruCache`](ILruCache.md).[`[iterator]`](ILruCache.md#iterator)

***

### clear()

> **clear**: () => `number`

Clear all entries from the cache and return the number of deleted items

#### Returns

`number`

#### Inherited from

[`ILruCache`](ILruCache.md).[`clear`](ILruCache.md#clear)

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

#### Overrides

[`ILruCache`](ILruCache.md).[`delete`](ILruCache.md#delete)

***

### get()

> **get**: (`key`) => `TValue` \| `undefined`

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

`TValue` \| `undefined`

#### Overrides

[`ILruCache`](ILruCache.md).[`get`](ILruCache.md#get)

***

### getOrSet()

> **getOrSet**: \<`T`\>(`key`, `valueOrFn`, `ttl?`) => `T`

Get an item from the cache, if the item doesn't exist or has expired
it will create a new entry with the provided value or function and returns it.

In case of a new entry (key either doesn't exist or has expired):
 - the provided value or the result of the function will be used as value.
 - it will be marked as most recently used.
 - an eviction will be triggered if the maximum capacity is reached

In case the item exists and hasn't expired:
 - the existing value will be returned.
 - it will be marked as most recently used.

#### Type Parameters

##### T

`T` *extends* [`SupportedCacheValues`](../type-aliases/SupportedCacheValues.md)

#### Parameters

##### key

`TKey`

##### valueOrFn

Value or function that will return the value to set in case the
key doesn't exist or has expired.

`T` | () => `T`

##### ttl?

`number`

Optional time to live for this specific item in milliseconds.
If not provided, the cache defaultTTL will be used.

#### Returns

`T`

#### Example

```typescript
const lru = new TimeLruCache({ maxSize: 2, defaultTTL: 30_000 });

// The key exists and hasn't expired
lru.set('key1', 'value1');
lru.getOrSet('key1', () => 'value2');         // 👈 returns 'value1' (entry exists)

// The key doesn't exist, a new entry will be created from the function return value
lru.getOrSet('key2', () => 'value2', 2_000);  // 👈 returns 'value2'
lru.has('key2');                              // 👈 true (it was added)
lru.get('key1');                              // 👈 'value1'

// Will trigger an eviction as maxSize capacity (2) is reached.
lru.getOrSet('key3', () => 'value3');        // 👈 returns 'value3'

lru.get('key1'); // 👈 undefined (first entry was evicted)
```

#### Overrides

[`ILruCache`](ILruCache.md).[`getOrSet`](ILruCache.md#getorset)

***

### has()

> **has**: (`key`, `options?`) => `boolean`

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

[`LruCacheHasOptions`](LruCacheHasOptions.md)

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

#### Overrides

[`ILruCache`](ILruCache.md).[`has`](ILruCache.md#has)

***

### params

> `readonly` **params**: `object`

Return the params

#### defaultTTL

> **defaultTTL**: `number`

#### maxSize

> **maxSize**: `number`

#### Overrides

[`ILruCache`](ILruCache.md).[`params`](ILruCache.md#params)

***

### peek()

> **peek**: (`key`) => `TValue` \| `undefined`

Get an item without marking it as recently used. Will return undefined if
the item doesn't exist or has expired (ttl).

Note that peek doesn't evict items that have expired, but will
return undefined if they have.

#### Parameters

##### key

`TKey`

#### Returns

`TValue` \| `undefined`

#### Overrides

[`ILruCache`](ILruCache.md).[`peek`](ILruCache.md#peek)

***

### set()

> **set**: (`key`, `value`, `ttl?`) => `boolean`

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

#### Overrides

[`ILruCache`](ILruCache.md).[`set`](ILruCache.md#set)

***

### size

> `readonly` **size**: `number`

Return the current number of items in the cache

#### Inherited from

[`ILruCache`](ILruCache.md).[`size`](ILruCache.md#size)
