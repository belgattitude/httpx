[**@httpx/lru v0.13.0**](../README.md)

---

[@httpx/lru](../README.md) / LruCache

# Class: LruCache\<TValue, TKey\>

Double linked list based lru cache that supports get in O(1)

## Type Parameters

### TValue

`TValue` _extends_ [`SupportedCacheValues`](../type-aliases/SupportedCacheValues.md) = [`SupportedCacheValues`](../type-aliases/SupportedCacheValues.md)

### TKey

`TKey` _extends_ [`BaseCacheKeyTypes`](../type-aliases/BaseCacheKeyTypes.md) = `string`

## Implements

- [`ILruCache`](../interfaces/ILruCache.md)\<`TValue`, `TKey`\>

## Constructors

### Constructor

> **new LruCache**\<`TValue`, `TKey`\>(`params`): `LruCache`\<`TValue`, `TKey`\>

Create a new LruCache instance.

👉 As an alternative to constructor, consider using the helper
`getOrCreateLruCache` to ensure only one instance is created.

#### Parameters

##### params

[`LruCacheParams`](../type-aliases/LruCacheParams.md)\<`TValue`, `TKey`\>

#### Returns

`LruCache`\<`TValue`, `TKey`\>

#### Example

```typescript
import { LruCache } from "@httpx/lru";

const lru = new LruCache({ maxSize: 1000 });

lru.set("🦄", ["cool", "stuff"]);
if (lru.has("🦄")) {
  console.log(lru.get("🦄"));
  // ['cool', 'stuff']
}
console.log(lru.size); // 1
lru.delete("🦄");
console.log(lru.size); // 0
lru.clear();
```

## Accessors

### params

#### Get Signature

> **get** **params**(): `object`

Return the params

##### Returns

`object`

###### maxSize

> **maxSize**: `number`

Return the params

#### Implementation of

[`ILruCache`](../interfaces/ILruCache.md).[`params`](../interfaces/ILruCache.md#params)

---

### size

#### Get Signature

> **get** **size**(): `number`

Return the current number of items in the cache

##### Returns

`number`

Return the current number of items in the cache

#### Implementation of

[`ILruCache`](../interfaces/ILruCache.md).[`size`](../interfaces/ILruCache.md#size)

## Methods

### \[iterator\]()

> **\[iterator\]**(): `IterableIterator`\<\[`TKey`, `TValue`\]\>

Iterate over the cache from the least recently used to the most recently used.

#### Returns

`IterableIterator`\<\[`TKey`, `TValue`\]\>

#### Example

```typescript
import { LruCache } from "@httpx/lru";

const lru = new LruCache({ maxSize: 2 });

// 👇 Fill the cache with 3 entries
lru.set("key1", "value1");
lru.set("key2", "value2");
lru.set("key3", "value3"); // 👈 Will evict key1 as maxSize is 2

lru.get("key2"); // 👈 Trigger a get to move key2 to the head

const results = [];

// 🖖 Iterate over the cache entries
for (const [key, value] of lru) {
  results.push([key, value]);
}

expect(results).toStrictEqual([
  ["key3", "value3"], // 👈  Least recently used first
  ["key2", "value2"], // 👈  Most recently used last
]);
```

#### Implementation of

[`ILruCache`](../interfaces/ILruCache.md).[`[iterator]`](../interfaces/ILruCache.md#iterator)

---

### clear()

> **clear**(): `number`

Clear all entries from the cache and return the number of deleted items

#### Returns

`number`

#### Implementation of

[`ILruCache`](../interfaces/ILruCache.md).[`clear`](../interfaces/ILruCache.md#clear)

---

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

[`ILruCache`](../interfaces/ILruCache.md).[`delete`](../interfaces/ILruCache.md#delete)

---

### get()

> **get**(`key`): `TValue` \| `undefined`

Get an item from the cache or return undefined if it doesn't exist.
Item will be marked as most recently used.

```typescript
import { LruCache } from "@httpx/lru";

const lru = new LruCache({ maxSize: 1 });

lru.set("key0", "value0");
lru.get("key0"); // 👈 'value0'
lru.get("key1"); // 👈 undefined
```

#### Parameters

##### key

`TKey`

#### Returns

`TValue` \| `undefined`

#### Implementation of

[`ILruCache`](../interfaces/ILruCache.md).[`get`](../interfaces/ILruCache.md#get)

---

### getOrSet()

> **getOrSet**\<`T`\>(`key`, `valueOrFn`): `T`

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

`T` _extends_ [`SupportedCacheValues`](../type-aliases/SupportedCacheValues.md)

#### Parameters

##### key

`TKey`

##### valueOrFn

`T` | () => `T`

#### Returns

`T`

#### Example

```typescript
const lru = new LruCache({ maxSize: 2 });

// The key exists
lru.set("key1", "value1");
lru.getOrSet("key1", () => "value2"); // 👈 returns 'value1' (entry exists)

// The key doesn't exist, a new entry will be created from the function return value
lru.getOrSet("key2", () => "value2"); // 👈 returns 'value2'
lru.has("key2"); // 👈 true (it was added)
lru.get("key1"); // 👈 'value1'

// Will trigger an eviction as maxSize capacity (2) is reached.
lru.getOrSet("key3", () => "value3"); // 👈 returns 'value3'

lru.get("key1"); // 👈 undefined (first entry was evicted)
```

#### Implementation of

[`ILruCache`](../interfaces/ILruCache.md).[`getOrSet`](../interfaces/ILruCache.md#getorset)

---

### has()

> **has**(`key`, `options?`): `boolean`

Checks whether an entry exist.

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
import { LruCache } from "@httpx/lru";

const lru = new LruCache({
  maxSize: 1,
  // 👇 Optional, default to false
  touchOnHas: false,
});

lru.set("key0", "value0");
// 👇 Will evict key0 as maxSize is 1
lru.set("key1", "value1");

lru.has("key0"); // 👈 false
lru.has("key1"); // 👈 true  (item is present)
lru.has("key1", {
  // 👇 Optional, default to global touchOnHas
  touch: false,
}); // 👈 true  (item is present)
```

#### Implementation of

[`ILruCache`](../interfaces/ILruCache.md).[`has`](../interfaces/ILruCache.md#has)

---

### peek()

> **peek**(`key`): `TValue` \| `undefined`

Get an item without marking it as recently used or undefined if item doesn't exist.

#### Parameters

##### key

`TKey`

#### Returns

`TValue` \| `undefined`

#### Implementation of

[`ILruCache`](../interfaces/ILruCache.md).[`peek`](../interfaces/ILruCache.md#peek)

---

### set()

> **set**(`key`, `value`): `boolean`

Add a new entry to the cache and overwrite value if the key was already
present.It will move the item as the most recently used.

Note that eviction will happen if maximum capacity is reached..

```typescript
import { LruCache } from "@httpx/lru";

const lru = new LruCache({
  maxSize: 1,
  onEviction: () => {
    console.log("evicted");
  },
});

lru.set("key0", "value0"); // 👈 true (new key, size increase)
lru.set("key0", "valuex"); // 👈 false (existing key, no size increase)

// 👇 Will evict key0 as maxSize is 1 and trigger onEviction
lru.set("key2", "value2"); // 👈 true (existing key, no size increase)
```

#### Parameters

##### key

`TKey`

##### value

`TValue`

#### Returns

`boolean`

#### Implementation of

[`ILruCache`](../interfaces/ILruCache.md).[`set`](../interfaces/ILruCache.md#set)
