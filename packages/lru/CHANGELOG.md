# @httpx/lru

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
  const lru = new LRUCache({ maxSize: 2 });
  lru.set("key1", "value1");
  lru.getOrInsert("key1", "value2"); // 👈 will not overwrite the value
  console.log(lru.get("key1")); // value1
  ```

- [#1866](https://github.com/belgattitude/httpx/pull/1866) [`fa3287a`](https://github.com/belgattitude/httpx/commit/fa3287a512b9d39f684620cfabe6e303dd1af8a8) Thanks [@belgattitude](https://github.com/belgattitude)! - Rename TinyLRU into LRUCache

- [#1866](https://github.com/belgattitude/httpx/pull/1866) [`59e5b25`](https://github.com/belgattitude/httpx/commit/59e5b255d7658993c6524e5798a47ffbdca5380d) Thanks [@belgattitude](https://github.com/belgattitude)! - Add iterator symbol

  ```typescript
  const lru = new LRUCache({ maxSize: 2 });
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

  const lru = new LRUCacheLRU({
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

- [`76556f0`](https://github.com/belgattitude/httpx/commit/76556f07d831a8f0d21943817e08f1f08a499c5e) - Rename LRUCache in LRUCache

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
