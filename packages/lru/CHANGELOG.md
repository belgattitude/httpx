# @httpx/lru

## 0.9.1

### Patch Changes

- [#2182](https://github.com/belgattitude/httpx/pull/2182) [`7169124`](https://github.com/belgattitude/httpx/commit/71691247feb901db5912353de54d23bd3362d0e9) Thanks [@belgattitude](https://github.com/belgattitude)! - Tests added tests for delete and regroup common operations

- [#2182](https://github.com/belgattitude/httpx/pull/2182) [`7169124`](https://github.com/belgattitude/httpx/commit/71691247feb901db5912353de54d23bd3362d0e9) Thanks [@belgattitude](https://github.com/belgattitude)! - Perf micro optimizations

## 0.9.0

### Minor Changes

- [#1965](https://github.com/belgattitude/httpx/pull/1965) [`065fdeb`](https://github.com/belgattitude/httpx/commit/065fdeb1e34c40aedeb1570dec90a54f8c2e77c5) Thanks [@belgattitude](https://github.com/belgattitude)! - Export LruCacheParams and TimeLruCacheParams types

## 0.8.1

### Patch Changes

- [#1946](https://github.com/belgattitude/httpx/pull/1946) [`14896bd`](https://github.com/belgattitude/httpx/commit/14896bd805c35dbb37e0fd61ff5c30cfabdb22b4) Thanks [@belgattitude](https://github.com/belgattitude)! - Fix jsdoc

## 0.8.0

### Minor Changes

- [#1931](https://github.com/belgattitude/httpx/pull/1931) [`5d4f74c`](https://github.com/belgattitude/httpx/commit/5d4f74c89031e1900eaa29dd415d5b247a3a0fff) Thanks [@belgattitude](https://github.com/belgattitude)! - Add cache.params to get back the initial params

- [#1931](https://github.com/belgattitude/httpx/pull/1931) [`5d4f74c`](https://github.com/belgattitude/httpx/commit/5d4f74c89031e1900eaa29dd415d5b247a3a0fff) Thanks [@belgattitude](https://github.com/belgattitude)! - Expose ILruCache and ITimeLruCache interfaces

- [#1931](https://github.com/belgattitude/httpx/pull/1931) [`801602f`](https://github.com/belgattitude/httpx/commit/801602fddc19f298f254c2d55684afe3b7a6a8fb) Thanks [@belgattitude](https://github.com/belgattitude)! - Export NullLruCache and NullTimeLruCache

## 0.7.0

### Minor Changes

- [#1892](https://github.com/belgattitude/httpx/pull/1892) [`68e7ebe`](https://github.com/belgattitude/httpx/commit/68e7ebef40f7182365676b3a21f99e398b93dd78) Thanks [@belgattitude](https://github.com/belgattitude)! - Rename LRUCache into LruCache (Breaking)

  ```typescript
  import { LruCache } from "@httpx/lru";
  ```

- [#1892](https://github.com/belgattitude/httpx/pull/1892) [`68e7ebe`](https://github.com/belgattitude/httpx/commit/68e7ebef40f7182365676b3a21f99e398b93dd78) Thanks [@belgattitude](https://github.com/belgattitude)! - All TimeLruCache with support for ttl expiry

  ```typescript
  import { TimeLruCache } from "@httpx/lru";

  const oneSecondInMillis = 1000;

  const lru = new TimeLruCache({
    maxSize: 10,
    defaultTTL: oneSecondInMillis,
    onEviction: () => {
      console.log("evicted");
    },
  });
  ```

- [#1892](https://github.com/belgattitude/httpx/pull/1892) [`68e7ebe`](https://github.com/belgattitude/httpx/commit/68e7ebef40f7182365676b3a21f99e398b93dd78) Thanks [@belgattitude](https://github.com/belgattitude)! - TValue now extends SupportedValues (instead of unknown)

  ```typescript
  type BaseCacheValueTypes =
    | string
    | number
    | bigint
    | boolean
    | null
    | unknown[]
    // objects or functions, but not promises
    | (object & { then?: void })
    | Record<string | number | symbol, unknown>;

  export type SupportedCacheValues =
    | Readonly<BaseCacheValueTypes>
    | BaseCacheValueTypes;
  ```

## 0.6.0

### Minor Changes

- [#1890](https://github.com/belgattitude/httpx/pull/1890) [`2bf1642`](https://github.com/belgattitude/httpx/commit/2bf164234c128c8c47bf708f66084e9403015a02) Thanks [@belgattitude](https://github.com/belgattitude)! - Rename getOrInsert into getOrSet (BC)

- [#1890](https://github.com/belgattitude/httpx/pull/1890) [`2bf1642`](https://github.com/belgattitude/httpx/commit/2bf164234c128c8c47bf708f66084e9403015a02) Thanks [@belgattitude](https://github.com/belgattitude)! - LRU.clear now returns the number of cleared items

- [#1890](https://github.com/belgattitude/httpx/pull/1890) [`2bf1642`](https://github.com/belgattitude/httpx/commit/2bf164234c128c8c47bf708f66084e9403015a02) Thanks [@belgattitude](https://github.com/belgattitude)! - Allow CacheKey type to be a number (still default to string)

- [#1890](https://github.com/belgattitude/httpx/pull/1890) [`2bf1642`](https://github.com/belgattitude/httpx/commit/2bf164234c128c8c47bf708f66084e9403015a02) Thanks [@belgattitude](https://github.com/belgattitude)! - Export BaseCache interface for customization

### Patch Changes

- [#1890](https://github.com/belgattitude/httpx/pull/1890) [`2bf1642`](https://github.com/belgattitude/httpx/commit/2bf164234c128c8c47bf708f66084e9403015a02) Thanks [@belgattitude](https://github.com/belgattitude)! - Add benchmarks for iterators and peek

## 0.5.0

### Minor Changes

- [#1875](https://github.com/belgattitude/httpx/pull/1875) [`0ace180`](https://github.com/belgattitude/httpx/commit/0ace180551519c3af7cd4e6b2779569954ff51c2) Thanks [@belgattitude](https://github.com/belgattitude)! - ~85 bytes size reduction

  Before ~620 bytes, now ~535b compressed

- [#1875](https://github.com/belgattitude/httpx/pull/1875) [`a0b2c12`](https://github.com/belgattitude/httpx/commit/a0b2c12948f26000d40f36f6e0bb0dc70c89e5eb) Thanks [@belgattitude](https://github.com/belgattitude)! - Move to native javascript private class properties (#)

### Patch Changes

- [#1875](https://github.com/belgattitude/httpx/pull/1875) [`0ace180`](https://github.com/belgattitude/httpx/commit/0ace180551519c3af7cd4e6b2779569954ff51c2) Thanks [@belgattitude](https://github.com/belgattitude)! - Small performance increase for peek()

- [#1875](https://github.com/belgattitude/httpx/pull/1875) [`0ace180`](https://github.com/belgattitude/httpx/commit/0ace180551519c3af7cd4e6b2779569954ff51c2) Thanks [@belgattitude](https://github.com/belgattitude)! - Fix ensure proper reinitialization after calling clear

## 0.4.1

### Patch Changes

- [#1872](https://github.com/belgattitude/httpx/pull/1872) [`6b5c38e`](https://github.com/belgattitude/httpx/commit/6b5c38eda03d541c62a1cdf9ba298be5b75087e1) Thanks [@belgattitude](https://github.com/belgattitude)! - Updated browserslist baseline for 2025

  For most users there won't be any change.
  Still around 95% on [browserslist](https://browserslist.dev/?q=ZGVmYXVsdHMsIGNocm9tZSA%2BPSA5NiwgZmlyZWZveCA%2BPSAxMDUsIGVkZ2UgPj0gMTEzLCBzYWZhcmkgPj0gMTUsIGlvcyA%2BPSAxNSwgb3BlcmEgPj0gMTAzLCBub3QgZGVhZA%3D%3D).

  ```
  defaults
  chrome >= 96
  firefox >= 105
  edge >= 113
  safari >= 15
  ios >= 15
  opera >= 103
  not dead
  ```

## 0.4.0

### Minor Changes

- [#1866](https://github.com/belgattitude/httpx/pull/1866) [`59e5b25`](https://github.com/belgattitude/httpx/commit/59e5b255d7658993c6524e5798a47ffbdca5380d) Thanks [@belgattitude](https://github.com/belgattitude)! - Add getOrInsert method

  ```typescript
  const lru = new LruCache({ maxSize: 2 });
  lru.set("key1", "value1");
  lru.getOrInsert("key1", "value2"); // 👈 will not overwrite the value
  console.log(lru.get("key1")); // value1
  ```

- [#1866](https://github.com/belgattitude/httpx/pull/1866) [`fa3287a`](https://github.com/belgattitude/httpx/commit/fa3287a512b9d39f684620cfabe6e303dd1af8a8) Thanks [@belgattitude](https://github.com/belgattitude)! - Rename TinyLRU into LruCache

- [#1866](https://github.com/belgattitude/httpx/pull/1866) [`59e5b25`](https://github.com/belgattitude/httpx/commit/59e5b255d7658993c6524e5798a47ffbdca5380d) Thanks [@belgattitude](https://github.com/belgattitude)! - Add iterator symbol

  ```typescript
  const lru = new LruCache({ maxSize: 2 });
  lru.set("key1", "value1");
  lru.set("key2", "value2");
  lru.set("key3", "value3");
  // trigger a get to move key2 to the head
  lru.get("key2");
  const results = [];
  // iterate over the cache entries
  for (const [key, value] of lru) {
    results.push([key, value]);
  }
  expect(results).toStrictEqual([
    ["key3", "value3"], // Least recently used
    ["key2", "value2"], // Most recently used
  ]);
  ```

- [#1866](https://github.com/belgattitude/httpx/pull/1866) [`59e5b25`](https://github.com/belgattitude/httpx/commit/59e5b255d7658993c6524e5798a47ffbdca5380d) Thanks [@belgattitude](https://github.com/belgattitude)! - Add onEviction callback

  ```typescript
  const fn = vi.fn();

  const lru = new LruCacheLRU({
    maxSize: 2,
    onEviction: (key, value) => {
      fn(key, value);
    },
  });
  lru.set("key1", "value1");
  lru.set("key2", "value2");
  lru.set("key3", "value3"); // 👈 Will evict key1 due to capacity
  expect(fn).toHaveBeenCalledExactlyOnceWith("key1", "value1");
  ```

## 0.3.0

### Minor Changes

- [`76556f0`](https://github.com/belgattitude/httpx/commit/76556f07d831a8f0d21943817e08f1f08a499c5e) - Rename LruCache in LruCache

## 0.2.1

### Patch Changes

- [#1859](https://github.com/belgattitude/httpx/pull/1859) [`101e19e`](https://github.com/belgattitude/httpx/commit/101e19eba944311d97646cc2bc203afc0f64be00) Thanks [@belgattitude](https://github.com/belgattitude)! - Update browserslist minimums

  ```
  defaults
  chrome >= 96
  firefox >= 94
  edge >= 91
  safari >= 14
  ios >= 14
  opera >= 83
  ```

## 0.2.0

### Minor Changes

- [#1854](https://github.com/belgattitude/httpx/pull/1854) [`afcaf21`](https://github.com/belgattitude/httpx/commit/afcaf214a012db3295dbeb9940b18da8d0b30441) Thanks [@belgattitude](https://github.com/belgattitude)! - Initial lru implementation
