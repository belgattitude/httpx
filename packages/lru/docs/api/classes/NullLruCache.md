[**@httpx/lru v0.12.5**](../README.md)

---

[@httpx/lru](../README.md) / NullLruCache

# Class: NullLruCache\<TValue, TKey\>

## Type Parameters

### TValue

`TValue` _extends_ [`SupportedCacheValues`](../type-aliases/SupportedCacheValues.md) = [`SupportedCacheValues`](../type-aliases/SupportedCacheValues.md)

### TKey

`TKey` _extends_ [`BaseCacheKeyTypes`](../type-aliases/BaseCacheKeyTypes.md) = `string`

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
import { NullLruCache } from "@httpx/lru";

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

---

### size

> `readonly` **size**: `0` = `0`

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

---

### get()

> **get**(`_key`): `undefined`

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

##### \_key

`TKey`

#### Returns

`undefined`

#### Implementation of

[`ILruCache`](../interfaces/ILruCache.md).[`get`](../interfaces/ILruCache.md#get)

---

### getOrSet()

> **getOrSet**\<`T`\>(`_key`, `valueOrFn`): `T`

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

##### \_key

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

> **peek**(`_key`): `undefined`

Get an item without marking it as recently used or undefined if item doesn't exist.

#### Parameters

##### \_key

`TKey`

#### Returns

`undefined`

#### Implementation of

[`ILruCache`](../interfaces/ILruCache.md).[`peek`](../interfaces/ILruCache.md#peek)

---

### set()

> **set**(`_key`, `_value`): `boolean`

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

##### \_key

`TKey`

##### \_value

`TValue`

#### Returns

`boolean`

#### Implementation of

[`ILruCache`](../interfaces/ILruCache.md).[`set`](../interfaces/ILruCache.md#set)
