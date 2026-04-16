# @httpx/lru

[![npm](https://img.shields.io/npm/v/@httpx/lru?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/lru)
[![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/lru/CHANGELOG.md)
[![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-lru-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Flru)
[![bundles](https://img.shields.io/static/v1?label=&message=cjs|esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/lru/.size-limit.cjs)
[![node](https://img.shields.io/static/v1?label=Node&message=20%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![browserslist](https://img.shields.io/static/v1?label=Browsers&message=%3E96%25&logo=googlechrome&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![downloads](https://img.shields.io/npm/dm/@httpx/lru?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/lru)
[![license](https://img.shields.io/npm/l/@httpx/lru?style=for-the-badge&labelColor=444)](https://github.com/belgattitude/httpx/blob/main/LICENSE)

LRU cache optimized for performance and low memory usage. 2x-4x times faster on `get()` than [quick-lru](https://github.com/sindresorhus/quick-lru)
without [memory overhead](https://github.com/sindresorhus/quick-lru?tab=readme-ov-file#trade-offs) and 6 times smaller than
[lru-cache](https://github.com/isaacs/node-lru-cache). TimeLru is less than 700b. Lru less than 600b.

## Install

```bash
$ npm install @httpx/lru
$ yarn add @httpx/lru
$ pnpm add @httpx/lru
```

## Features

- 🖖&nbsp; Provides [LruCache](#lrucache) and [TimeLruCache](#timelrucache).
- 🚀&nbsp; [Fast](#benchmarks) `cache.get()` in O(1) thx to [doubly linked list](https://en.wikipedia.org/wiki/Doubly_linked_list).
- 🦆&nbsp; Expose `getOrSet()` method to simplify cache usage patterns.
- ✨&nbsp; Provides convenience [helpers](#helpers) to preserve single instance across your app.
- 📐&nbsp; Lightweight (starts at [~600B](#bundle-size))
- 🛡️&nbsp; Tested on [node 20-25, bun, browser, cloudflare workers and runtime/edge](#compatibility).
- 🗝️&nbsp; Available in ESM and CJS formats.

## Documentation

## TimeLruCache

TimeLruCache allows to work with expiry time (TTL). Time-to-live are expressed in milliseconds. The API is similar to LruCache.

| Method                                   | Description                                                               |
| ---------------------------------------- | ------------------------------------------------------------------------- |
| `set(key, value, ttl?): boolean`         | Add a new entry and return true if entry was overwritten                  |
| `get(key): TValue \| undefined`          | Retrieve an entry if exists and hasn't expired.                           |
| `has(key): boolean`                      | Check if an entry exist and hasn't expired                                |
| `delete(key): boolean`                   | Remove an entry, returns bool indicating if the entry was existing        |
| `getOrSet(key, valueOrFn, ttl?): TValue` | Return the entry if exists otherwise save a new entry (value or callback) |
| `clear(): number`                        | Clear the cache and return the actual number of deleted entries           |

### TimeLruCache.getOrSet()

Get an item from the cache, if the item doesn't exist or has expired
it will create a new entry with the provided value or function and returns it.

In case of a new entry (key either doesn't exist or has expired):

- the provided value or the result of the function will be used as value.
- it will be marked as most recently used.
- an eviction will be triggered if the maximum capacity is reached

In case the item exists and hasn't expired:

- the existing value will be returned.
- it will be marked as most recently used.
- the provider function is ignored and won't be executed

```typescript
const lru = new TimeLruCache({ maxSize: 2, defaultTTL: 30_000 });

// The key exists and hasn't expired
lru.set("key1", "value1");
lru.getOrSet("key1", () => "value2"); // 👈 returns 'value1' (entry exists)

// The key doesn't exist, a new entry will be created from the function return value
lru.getOrSet("key2", () => "value2", 2_000); // 👈 returns 'value2'
lru.has("key2"); // 👈 true (it was added)
lru.get("key1"); // 👈 'value1'

// Will trigger an eviction as maxSize capacity (2) is reached.
lru.getOrSet("key3", () => "value3"); // 👈 returns 'value3'

lru.get("key1"); // 👈 undefined (first entry was evicted)
```

### TimeLruCache.has()

Checks whether an entry exist and hasn't expired. If the entry exists but has expired, it will be removed
automatically and trigger the `onEviction` callback if present.

```typescript
import { TimeLruCache } from "@httpx/lru";

const oneSecondInMillis = 1000;

// 👉 As an alternative to constructor, consider using the helper
//    `getOrCreateTimeLruCache` to ensure only one instance is created

const lru = new TimeLruCache({
  maxSize: 1,
  defaultTTL: oneSecondInMillis,
  onEviction: () => {
    console.log("evicted");
  },
});

lru.set("key0", "value0", 2 * oneSecondInMillis);

// 👇 Will evict key0 as maxSize is 1
lru.set("key1", "value1", 2 * oneSecondInMillis);

lru.has("key0"); // 👈 false (item does not exists)
lru.has("key1"); // 👈 true  (item is present and is not expired)

const value = lru.get("key1"); // 👈 'value1' (item is present and is not expired)

// 🕛 wait 3 seconds, time for the item to expire

lru.has("key1"); // 👈 false (item is present but expired - 👋 onEviction will be called)
```

## LruCache

LruCache provides a base LRU implementation. It is a simple cache with a fixed capacity.
When the cache is full, the least recently used item is removed. Under the hood it uses
a doubly linked list implementation to allow `get()` in O(1). If you're looking for a cache with
expiry time (TTL) consider using [TimeLruCache](#timelrucache) instead.

### API

| Method                             | Description                                                        |
| ---------------------------------- | ------------------------------------------------------------------ |
| `set(key, value): boolean`         | Add a new entry and return true if entry was overwritten           |
| `get(key): TValue \| undefined`    | Retrieve a cache entry by key                                      |
| `has(key): boolean`                | Check if an entry exist                                            |
| `delete(key): boolean`             | Remove an entry, returns bool indicating if the entry was existing |
| `getOrSet(key, valueOrFn): TValue` | Return the entry if exists otherwise save a new entry              |
| `clear(): number`                  | Clear the cache and return the actual number of deleted entries    |

### Usage

```typescript
// bundle size: ~550B
import { LruCache } from "@httpx/lru";

// 👉 As an alternative to constructor, consider using the helper
//    `getOrCreateLruCache` to ensure only one instance is created
const lru = new LruCache({ maxSize: 1000 });

lru.set("🦆", ["cool", "stuff"]);

if (lru.has("🦆")) {
  console.log(lru.get("🦆"));
  // ['cool', 'stuff']
}

lru.delete("🦆");
lru.clear();
```

## Helpers

As an alternative to using the constructors directly, the package provides helpers to ensure only one instance
of `LruCache` or `TimeLruCache` is created for a given name. This is particularly useful for hybrid application such as NextJs
that might loose their references due to their specific module loading strategy. Under the hood instances are
preserved on `globalThis`.

### getOrCreateLruCache

```typescript
import { getOrCreateLruCache } from "@httpx/lru";

const ttlLru = getOrCreateLruCache("main-cache", { maxSize: 500 });
```

### getOrCreateTimeLruCache

```typescript
import { getOrCreateTimeLruCache } from "@httpx/lru";

const ttlLru = getOrCreateTimeLruCache("main-cache", {
  maxSize: 500,
  defaultTTL: 60000,
});
```

## API

### Iterable

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

### Callbacks

#### onEviction callback

Can be useful to clean up resources or trigger side effects. onEviction callback
is called right before an entry is evicted.

```typescript
const fn = vi.fn();

const lru = new LruCache({
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

## Benchmarks

> Performance is continuously monitored thanks to [codspeed.io](https://codspeed.io/belgattitude/httpx).
>
> [![CodSpeed Badge](https://img.shields.io/endpoint?url=https://codspeed.io/badge.json)](https://codspeed.io/belgattitude/httpx)

### Node 24

```
 RUN  v4.1.4 /home/sebastien/github/httpx/packages/lru


 ✓ bench/compare/lru-cache/eviction.bench.ts > LruCache.set() 1000 items / maxSize: 500 4275ms
     name                                           hz     min      max    mean     p75     p99    p995    p999      rme  samples
   · @httpx/lru.set() - ts files (dev)        7,606.20  0.0753   1.0920  0.1315  0.1481  0.3451  0.4774  0.9489   ±1.46%     3804
   · @httpx/lru.set() - compiled (dist)       4,164.43  0.0678   4.6691  0.2401  0.3168  0.6627  0.7573  1.4578   ±3.05%     2083
   · @httpx/time-lru.set() - ts file (dev)    3,295.89  0.1167  24.7206  0.3034  0.4190  0.7941  0.9493  5.4614  ±10.22%     1648
   · @httpx/time-lru.set() - compiled (dist)  5,732.64  0.1046   7.0858  0.1744  0.1840  0.6009  0.6929  5.9877   ±5.24%     2867
   · quick-lru@7.3.0.set()                    9,741.42  0.0726   1.3815  0.1027  0.1133  0.3078  0.3574  0.8254   ±1.43%     4871
   · lru-cache@11.3.5.set()                   5,047.85  0.1010   7.1965  0.1981  0.2123  0.8582  1.1546  2.3306   ±4.06%     2524
   · lru-cache@11.3.5.set(/with ttl/)         6,341.28  0.1040   8.5337  0.1577  0.1814  0.3564  0.4398  0.9293   ±3.54%     3171

 ✓ bench/compare/lru-cache/get.bench.ts > LruCache.get() - 1000 items / maxSize: 1000 3715ms
     name                                            hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.get() - ts files (dev)        32,606.79  0.0204  1.6775  0.0307  0.0323  0.1039  0.1488  0.3255  ±1.34%    16304
   · @httpx/lru.get() - compiled (dist)       40,810.43  0.0195  0.5855  0.0245  0.0251  0.0586  0.0767  0.1783  ±0.66%    20406
   · @httpx/time-lru.get() - ts files (dev)   12,347.78  0.0599  1.6096  0.0810  0.0936  0.2051  0.2931  0.4827  ±1.31%     6175
   · @httpx/time-lru.get() - compiled (dist)  12,665.04  0.0612  0.7051  0.0790  0.0915  0.1895  0.2402  0.4198  ±0.93%     6334
   · quick-lru@7.3.0.get()                     6,089.05  0.1064  8.5364  0.1642  0.1883  0.3861  0.5386  1.3580  ±4.82%     3045
   · lru-cache@11.3.5.get()                   25,989.87  0.0273  2.4774  0.0385  0.0397  0.1190  0.1698  0.5474  ±1.63%    12995

 ✓ bench/compare/lru-cache/set.bench.ts > LruCache.set() 1000 items / maxSize: 1000 3110ms
     name                                            hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.set() - ts files (dev)        30,435.97  0.0235  0.9587  0.0329  0.0368  0.0967  0.1477  0.3371  ±1.11%    15219
   · @httpx/lru.set() - compiled (dist)       29,502.90  0.0242  0.7907  0.0339  0.0377  0.0768  0.1034  0.2214  ±0.80%    14752
   · @httpx/time-lru.set() - compiled (dist)  12,191.88  0.0627  1.4304  0.0820  0.0860  0.1745  0.2343  0.4916  ±1.20%     6096
   · quick-lru@7.3.0.set()                    16,463.03  0.0394  1.5975  0.0607  0.0701  0.1798  0.4039  0.6945  ±1.68%     8232
   · lru-cache@11.3.5.set()                   10,141.80  0.0591  2.4485  0.0986  0.1057  0.3696  0.4982  0.9515  ±2.11%     5071

 ✓ bench/compare/lru-cache/peek.bench.ts > LruCache.peek() - 1000 items / maxSize: 1000 2537ms
     name                                        hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.peek() - ts files (dev)   78,651.53  0.0096  2.7237  0.0127  0.0145  0.0342  0.0489  0.1256  ±1.47%    39326
   · @httpx/lru.peek() - compiled (dist)  75,377.83  0.0095  4.5985  0.0133  0.0149  0.0339  0.0517  0.1654  ±2.88%    37690
   · quick-lru@7.3.0.peek()               12,529.71  0.0619  0.9028  0.0798  0.0933  0.1787  0.2522  0.4868  ±1.03%     6265
   · lru-cache@11.3.5.peek()              36,719.56  0.0173  2.0393  0.0272  0.0298  0.0738  0.1092  0.3519  ±1.36%    18362

 ✓ bench/compare/lru-cache/iterate.bench.ts > LruCache iterator - 1000 items 2445ms
     name                                           hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru - forEach - ts files (dev)   23,029.48  0.0294  1.9043  0.0434  0.0432  0.1305  0.2123  0.3665  ±1.35%    11515
   · @httpx/lru - forEach - compiled (dist)  18,451.21  0.0302  8.6200  0.0542  0.0577  0.2092  0.3283  0.7572  ±3.76%     9226
   · quick-lru@7.3.0 - forEach                7,009.02  0.0990  2.1217  0.1427  0.1521  0.5581  0.7072  1.1248  ±2.15%     3505
   · lru-cache@11.3.5 - forEach               8,525.90  0.0584  5.0223  0.1173  0.1122  0.6292  0.8691  2.0061  ±4.07%     4263

 BENCH  Summary
                                                                                                                                                                                    
  quick-lru@7.3.0.set() - bench/compare/lru-cache/eviction.bench.ts > LruCache.set() 1000 items / maxSize: 500
    1.28x faster than @httpx/lru.set() - ts files (dev)
    1.54x faster than lru-cache@11.3.5.set(/with ttl/)
    1.70x faster than @httpx/time-lru.set() - compiled (dist)
    1.93x faster than lru-cache@11.3.5.set()
    2.34x faster than @httpx/lru.set() - compiled (dist)
    2.96x faster than @httpx/time-lru.set() - ts file (dev)

  @httpx/lru.get() - compiled (dist) - bench/compare/lru-cache/get.bench.ts > LruCache.get() - 1000 items / maxSize: 1000
    1.25x faster than @httpx/lru.get() - ts files (dev)
    1.57x faster than lru-cache@11.3.5.get()
    3.22x faster than @httpx/time-lru.get() - compiled (dist)
    3.31x faster than @httpx/time-lru.get() - ts files (dev)
    6.70x faster than quick-lru@7.3.0.get()

  @httpx/lru - forEach - ts files (dev) - bench/compare/lru-cache/iterate.bench.ts > LruCache iterator - 1000 items
    1.25x faster than @httpx/lru - forEach - compiled (dist)
    2.70x faster than lru-cache@11.3.5 - forEach
    3.29x faster than quick-lru@7.3.0 - forEach

  @httpx/lru.peek() - ts files (dev) - bench/compare/lru-cache/peek.bench.ts > LruCache.peek() - 1000 items / maxSize: 1000
    1.04x faster than @httpx/lru.peek() - compiled (dist)
    2.14x faster than lru-cache@11.3.5.peek()
    6.28x faster than quick-lru@7.3.0.peek()

  @httpx/lru.set() - ts files (dev) - bench/compare/lru-cache/set.bench.ts > LruCache.set() 1000 items / maxSize: 1000
    1.03x faster than @httpx/lru.set() - compiled (dist)
    1.85x faster than quick-lru@7.3.0.set()
    2.50x faster than @httpx/time-lru.set() - compiled (dist)
    3.00x faster than lru-cache@11.3.5.set()
```

### Bun 1.3.12

```
 RUN  v4.1.4 /home/sebastien/github/httpx/packages/lru


 ✓ bench/compare/lru-cache/eviction.bench.ts > LruCache.set() 1000 items / maxSize: 500 4304ms
     name                                            hz     min      max    mean     p75     p99     p995     p999      rme  samples
   · @httpx/lru.set() - ts files (dev)         1,208.94  0.0819  19.4513  0.8272  1.4046  4.3530   5.4556  19.4513  ±11.47%      605
   · @httpx/lru.set() - compiled (dist)        2,194.97  0.0806  24.9153  0.4556  0.3359  3.2571   7.2549  19.1626  ±16.93%     1098
   · @httpx/time-lru.set() - ts file (dev)     1,889.67  0.1150  15.5813  0.5292  0.5542  4.1092   5.4960  15.5813  ±11.75%      945
   · @httpx/time-lru.set() - compiled (dist)   1,957.19  0.1321  24.1792  0.5109  0.4177  2.5316   5.0388  24.1792  ±15.64%      980
   · quick-lru@7.3.0.set()                    10,155.83  0.0641  17.2681  0.0985  0.0854  0.2756   0.4458   4.3458   ±9.28%     5078
   · lru-cache@11.3.5.set()                    1,844.63  0.1204  24.7910  0.5421  0.7991  2.9041  10.4649  24.7910  ±15.77%      923
   · lru-cache@11.3.5.set(/with ttl/)          2,729.70  0.1177  19.4577  0.3663  0.2490  2.7674   4.4295  16.0469  ±14.35%     1365

 ✓ bench/compare/lru-cache/get.bench.ts > LruCache.get() - 1000 items / maxSize: 1000 3733ms
     name                                            hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.get() - ts files (dev)        27,516.34  0.0270  2.5643  0.0363  0.0391  0.1170  0.1582  0.3615  ±1.61%    13759
   · @httpx/lru.get() - compiled (dist)       27,529.32  0.0273  4.7759  0.0363  0.0406  0.0887  0.1195  0.2833  ±2.07%    13765
   · @httpx/time-lru.get() - ts files (dev)   12,463.75  0.0587  1.5997  0.0802  0.0882  0.2004  0.2739  0.6845  ±1.33%     6232
   · @httpx/time-lru.get() - compiled (dist)  13,723.57  0.0580  0.7352  0.0729  0.0824  0.1783  0.2262  0.3196  ±0.86%     6862
   · quick-lru@7.3.0.get()                     5,419.75  0.1037  7.7579  0.1845  0.1946  0.5414  0.7198  5.1452  ±4.99%     2710
   · lru-cache@11.3.5.get()                   19,753.25  0.0287  3.3886  0.0506  0.0602  0.1444  0.1845  0.3421  ±2.06%     9877

 ✓ bench/compare/lru-cache/set.bench.ts > LruCache.set() 1000 items / maxSize: 1000 3123ms
     name                                            hz     min      max    mean     p75     p99    p995    p999      rme  samples
   · @httpx/lru.set() - ts files (dev)        24,174.68  0.0285  10.9962  0.0414  0.0397  0.0924  0.1307  0.2546  ±10.46%    12171
   · @httpx/lru.set() - compiled (dist)       27,347.91  0.0284   0.5890  0.0366  0.0411  0.1080  0.1553  0.3278   ±0.94%    13675
   · @httpx/time-lru.set() - compiled (dist)  15,049.47  0.0552   1.7176  0.0664  0.0714  0.1686  0.2196  0.4913   ±1.34%     7525
   · quick-lru@7.3.0.set()                    10,351.96  0.0483   9.3604  0.0966  0.0917  0.3379  0.4558  4.1503   ±6.61%     5176
   · lru-cache@11.3.5.set()                    8,945.49  0.0619  11.9083  0.1118  0.1172  0.3621  0.5428  1.8448   ±5.25%     4473

 ✓ bench/compare/lru-cache/peek.bench.ts > LruCache.peek() - 1000 items / maxSize: 1000 2538ms
     name                                        hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.peek() - ts files (dev)   75,770.74  0.0089  1.0669  0.0132  0.0157  0.0399  0.0635  0.1313  ±0.95%    37886
   · @httpx/lru.peek() - compiled (dist)  72,799.60  0.0106  3.1079  0.0137  0.0126  0.0422  0.0634  0.1550  ±1.75%    36400
   · quick-lru@7.3.0.peek()               16,419.28  0.0481  2.0249  0.0609  0.0672  0.1690  0.2328  0.4811  ±1.33%     8210
   · lru-cache@11.3.5.peek()              27,877.12  0.0188  4.0707  0.0359  0.0412  0.1215  0.1668  0.2957  ±2.83%    13939

 ✓ bench/compare/lru-cache/iterate.bench.ts > LruCache iterator - 1000 items 2505ms
     name                                           hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru - forEach - ts files (dev)   25,659.52  0.0199  8.4911  0.0390  0.0373  0.1709  0.2022  0.4372  ±4.97%    12830
   · @httpx/lru - forEach - compiled (dist)  30,927.83  0.0198  6.0637  0.0323  0.0332  0.1022  0.1411  0.3299  ±5.17%    15465
   · quick-lru@7.3.0 - forEach               11,225.05  0.0644  7.3917  0.0891  0.0931  0.2266  0.3066  2.1378  ±4.62%     5613
   · lru-cache@11.3.5 - forEach              18,227.10  0.0388  5.2593  0.0549  0.0619  0.1200  0.1817  0.3561  ±3.44%     9114

 BENCH  Summary
                                                                                                                                                                                    
  @httpx/lru.set() - compiled (dist) - bench/compare/lru-cache/set.bench.ts > LruCache.set() 1000 items / maxSize: 1000
    1.13x faster than @httpx/lru.set() - ts files (dev)
    1.82x faster than @httpx/time-lru.set() - compiled (dist)
    2.64x faster than quick-lru@7.3.0.set()
    3.06x faster than lru-cache@11.3.5.set()

  @httpx/lru.peek() - ts files (dev) - bench/compare/lru-cache/peek.bench.ts > LruCache.peek() - 1000 items / maxSize: 1000
    1.04x faster than @httpx/lru.peek() - compiled (dist)
    2.72x faster than lru-cache@11.3.5.peek()
    4.61x faster than quick-lru@7.3.0.peek()

  quick-lru@7.3.0.set() - bench/compare/lru-cache/eviction.bench.ts > LruCache.set() 1000 items / maxSize: 500
    3.72x faster than lru-cache@11.3.5.set(/with ttl/)
    4.63x faster than @httpx/lru.set() - compiled (dist)
    5.19x faster than @httpx/time-lru.set() - compiled (dist)
    5.37x faster than @httpx/time-lru.set() - ts file (dev)
    5.51x faster than lru-cache@11.3.5.set()
    8.40x faster than @httpx/lru.set() - ts files (dev)

  @httpx/lru - forEach - compiled (dist) - bench/compare/lru-cache/iterate.bench.ts > LruCache iterator - 1000 items
    1.21x faster than @httpx/lru - forEach - ts files (dev)
    1.70x faster than lru-cache@11.3.5 - forEach
    2.76x faster than quick-lru@7.3.0 - forEach

  @httpx/lru.get() - compiled (dist) - bench/compare/lru-cache/get.bench.ts > LruCache.get() - 1000 items / maxSize: 1000
    1.00x faster than @httpx/lru.get() - ts files (dev)
    1.39x faster than lru-cache@11.3.5.get()
    2.01x faster than @httpx/time-lru.get() - compiled (dist)
    2.21x faster than @httpx/time-lru.get() - ts files (dev)
    5.08x faster than quick-lru@7.3.0.get()
```

> See [benchmark file](https://github.com/belgattitude/httpx/blob/main/packages/lru/bench) for details.

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/lru/.size-limit.ts)

| Scenario (esm)                                        | Size (brotli) |
| ----------------------------------------------------- | ------------: |
| `import { LruCache } from '@httpx/lru`                |        ~ 570B |
| `import { TimeLruCache } from '@httpx/lru`            |        ~ 670B |
| `import { getOrCreateLruCache } from '@httpx/lru`     |        ~ 695B |
| `import { getOrCreateTimeLruCache } from '@httpx/lru` |        ~ 750B |

> For CJS usage (not recommended) track the size on [bundlephobia](https://bundlephobia.com/package/@httpx/lru@latest).

## Compatibility

| Level        | CI  | Description                                                                                                                                      |
| ------------ | --- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Node         | ✅  | CI for 20.x, 22.x, 24.x & 25.x.                                                                                                                  |
| Browser      | ✅  | Tested with latest chrome (vitest/playwright)                                                                                                    |
| Browserslist | ✅  | [defaults, > 0.26%, last 2 versions, Firefox ESR, not dead](https://github.com/belgattitude/httpx/blob/main/packages/lru/.browserslistrc)        |
| Bun          | ✅  | Tested with latest (at time of writing >= 1.3.3)                                                                                                 |
| Edge         | ✅  | Ensured on CI with [@vercel/edge-runtime](https://github.com/vercel/edge-runtime).                                                               |
| Cloudflare   | ✅  | Ensured with @cloudflare/vitest-pool-workers (see [wrangler.toml](https://github.com/belgattitude/httpx/blob/main/devtools/vitest/wrangler.toml) |
| Typescript   | ✅  | TS 5.0 + / [are-the-type-wrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io) checks on CI.                                    |
| ES2022       | ✅  | Dist files checked with [es-check](https://github.com/yowainwright/es-check)                                                                     |
| Performance  | ✅  | Monitored with [codspeed.io](https://codspeed.io/belgattitude/httpx)                                                                             |

> For _older_ browsers: most frontend frameworks can transpile the library (ie: [nextjs](https://nextjs.org/docs/app/api-reference/next-config-js/transpilePackages)...)

## Comparison with other libraries

| Name       | Import             |     Size |  (gzip) | BundleJs                                                                                                                                                                          |
| ---------- | ------------------ | -------: | ------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| @httpx/lru | `{ LruCache }`     |  1.49 KB | 0.65 KB | [![size](https://deno.bundlejs.com/badge?q=@httpx/lru@0.12.5&treeshake=[{+LruCache+}])](https://bundlejs.com/?q=%40httpx%2Flru%400.12.5&treeshake=%5B%7B+LruCache+%7D%5D)         |
| @httpx/lru | `{ TimeLruCache }` |  1.91 KB | 0.78 KB | [![size](https://deno.bundlejs.com/badge?q=@httpx/lru@0.12.5&treeshake=[{+TimeLruCache+}])](https://bundlejs.com/?q=%40httpx%2Flru%400.12.5&treeshake=%5B%7B+TimeLruCache+%7D%5D) |
| lru-cache  | `{ LruCache }`     | 17.30 KB | 5.71 KB | [![size](https://deno.bundlejs.com/badge?q=lru-cache@11.2.4&treeshake=[{+LRUCache+}])](https://bundlejs.com/?q=lru-cache%4011.2.4&treeshake=%5B%7B+LRUCache+%7D%5D)               |
| quick-lru  | `{ default }`      |  3.36 KB | 1.17 KB | [![size](https://deno.bundlejs.com/badge?q=quick-lru@7.3.0&treeshake=[{+default+}])](https://bundlejs.com/?q=quick-lru%407.3.0&treeshake=%5B%7B+default+%7D%5D)                   |

## Contributors

Contributions are welcome. Have a look to the [CONTRIBUTING](https://github.com/belgattitude/httpx/blob/main/CONTRIBUTING.md) document.

## Sponsors

If my OSS work brightens your day, let's take it to new heights together!
[Sponsor](<[sponsorship](https://github.com/sponsors/belgattitude)>), [coffee](<(https://ko-fi.com/belgattitude)>),
or star – any gesture of support fuels my passion to improve. Thanks for being awesome! 🙏❤️

### Special thanks to

<table>
  <tr>
    <td>
      <a href="https://www.jetbrains.com/?ref=belgattitude" target="_blank">
         <img width="65" src="https://asset.brandfetch.io/idarKiKkI-/id53SttZhi.jpeg" alt="Jetbrains logo" />
      </a>
    </td>
    <td>
      <a href="https://www.embie.be/?ref=belgattitude" target="_blank">
        <img width="65" src="https://avatars.githubusercontent.com/u/98402122?s=200&v=4" alt="Jetbrains logo" />    
      </a>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://www.jetbrains.com/?ref=belgattitude" target="_blank">JetBrains</a>
    </td>
    <td align="center">
      <a href="https://www.embie.be/?ref=belgattitude" target="_blank">Embie.be</a>
    </td>
   </tr>
</table>

## License

MIT © [Sébastien Vanvelthem](https://github.com/belgattitude) and contributors.
