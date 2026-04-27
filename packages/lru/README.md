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
 RUN  v4.1.5 /home/sebastien/github/httpx/packages/lru

 ✓ bench/compare/lru-cache/eviction.bench.ts > LruCache.set() 1000 items / maxSize: 500 4270ms
     name                                            hz     min      max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.set() - ts files (dev)         8,164.50  0.0748   1.1611  0.1225  0.1332  0.3879  0.5215  0.8232  ±1.58%     4083
   · @httpx/lru.set() - compiled (dist)        5,154.25  0.0642   5.1284  0.1940  0.2381  0.5406  0.7064  4.7523  ±3.94%     2578
   · @httpx/time-lru.set() - ts file (dev)     4,765.06  0.1146   7.9617  0.2099  0.2292  0.5678  0.6428  2.2445  ±4.67%     2383
   · @httpx/time-lru.set() - compiled (dist)   5,136.00  0.1049   7.6689  0.1947  0.2099  0.5983  0.6783  1.7387  ±4.40%     2568
   · quick-lru@7.3.0.set()                    10,552.56  0.0721   1.1122  0.0948  0.0974  0.2605  0.3649  0.7174  ±1.32%     5277
   · lru-cache@11.3.5.set()                    6,340.02  0.1020  13.0768  0.1577  0.1615  0.4104  0.5492  1.4058  ±5.82%     3171
   · lru-cache@11.3.5.set(/with ttl/)          5,705.81  0.1062   8.6892  0.1753  0.1893  0.5313  0.7838  1.4431  ±3.92%     2853

 ✓ bench/compare/lru-cache/get.bench.ts > LruCache.get() - 1000 items / maxSize: 1000 3730ms
     name                                            hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.get() - ts files (dev)        41,351.14  0.0191  1.5688  0.0242  0.0232  0.0650  0.0914  0.1717  ±0.95%    20676
   · @httpx/lru.get() - compiled (dist)       39,400.57  0.0194  0.5370  0.0254  0.0263  0.0757  0.1092  0.2226  ±0.83%    19701
   · @httpx/time-lru.get() - ts files (dev)   13,219.86  0.0584  1.0197  0.0756  0.0826  0.1952  0.2641  0.5732  ±1.15%     6610
   · @httpx/time-lru.get() - compiled (dist)  13,997.13  0.0573  0.9274  0.0714  0.0744  0.1690  0.2416  0.4840  ±1.03%     7000
   · quick-lru@7.3.0.get()                     6,597.95  0.1047  1.7666  0.1516  0.1608  0.4299  0.6131  1.0933  ±1.81%     3299
   · lru-cache@11.3.5.get()                   26,409.39  0.0264  1.1150  0.0379  0.0401  0.1224  0.1748  0.4350  ±1.37%    13205

 ✓ bench/compare/lru-cache/set.bench.ts > LruCache.set() 1000 items / maxSize: 1000 3106ms
     name                                            hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.set() - ts files (dev)        31,205.40  0.0244  0.7861  0.0320  0.0338  0.0884  0.1266  0.2758  ±0.96%    15603
   · @httpx/lru.set() - compiled (dist)       28,099.26  0.0253  0.9939  0.0356  0.0384  0.1053  0.1380  0.2679  ±1.06%    14050
   · @httpx/time-lru.set() - compiled (dist)  11,239.33  0.0660  1.6308  0.0890  0.0975  0.2358  0.2958  0.6727  ±1.32%     5620
   · quick-lru@7.3.0.set()                    15,958.05  0.0396  1.1708  0.0627  0.0678  0.2002  0.5235  0.8776  ±1.96%     7980
   · lru-cache@11.3.5.set()                   12,827.77  0.0582  1.3904  0.0780  0.0814  0.2157  0.3121  0.6490  ±1.34%     6414

 ✓ bench/compare/lru-cache/iterate.bench.ts > LruCache iterator - 1000 items 2451ms
     name                                           hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru - forEach - ts files (dev)   19,766.95  0.0312  8.3407  0.0506  0.0534  0.1671  0.3045  0.5319  ±3.61%     9884
   · @httpx/lru - forEach - compiled (dist)  20,465.83  0.0316  3.4000  0.0489  0.0488  0.1723  0.3159  0.5197  ±1.93%    10233
   · quick-lru@7.3.0 - forEach                7,865.58  0.1003  2.6077  0.1271  0.1234  0.4546  0.5854  1.2174  ±1.97%     3936
   · lru-cache@11.3.5 - forEach              11,708.66  0.0610  0.9167  0.0854  0.0872  0.2956  0.4017  0.6261  ±1.42%     5855

 ✓ bench/compare/lru-cache/peek.bench.ts > LruCache.peek() - 1000 items / maxSize: 1000 2537ms
     name                                        hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.peek() - ts files (dev)   85,317.30  0.0094  0.6308  0.0117  0.0117  0.0352  0.0546  0.1219  ±0.76%    42659
   · @httpx/lru.peek() - compiled (dist)  85,178.41  0.0095  0.7511  0.0117  0.0125  0.0334  0.0508  0.1157  ±0.76%    42590
   · quick-lru@7.3.0.peek()               12,240.64  0.0621  1.0724  0.0817  0.0865  0.1857  0.2432  0.5161  ±1.09%     6121
   · lru-cache@11.3.5.peek()              36,763.90  0.0171  1.1830  0.0272  0.0293  0.0962  0.1333  0.3213  ±1.29%    18382

 BENCH  Summary
                                                                                                                                                                                                                                    
  quick-lru@7.3.0.set() - bench/compare/lru-cache/eviction.bench.ts > LruCache.set() 1000 items / maxSize: 500
    1.29x faster than @httpx/lru.set() - ts files (dev)
    1.66x faster than lru-cache@11.3.5.set()
    1.85x faster than lru-cache@11.3.5.set(/with ttl/)
    2.05x faster than @httpx/lru.set() - compiled (dist)
    2.05x faster than @httpx/time-lru.set() - compiled (dist)
    2.21x faster than @httpx/time-lru.set() - ts file (dev)

  @httpx/lru.get() - ts files (dev) - bench/compare/lru-cache/get.bench.ts > LruCache.get() - 1000 items / maxSize: 1000
    1.05x faster than @httpx/lru.get() - compiled (dist)
    1.57x faster than lru-cache@11.3.5.get()
    2.95x faster than @httpx/time-lru.get() - compiled (dist)
    3.13x faster than @httpx/time-lru.get() - ts files (dev)
    6.27x faster than quick-lru@7.3.0.get()

  @httpx/lru - forEach - compiled (dist) - bench/compare/lru-cache/iterate.bench.ts > LruCache iterator - 1000 items
    1.04x faster than @httpx/lru - forEach - ts files (dev)
    1.75x faster than lru-cache@11.3.5 - forEach
    2.60x faster than quick-lru@7.3.0 - forEach

  @httpx/lru.peek() - ts files (dev) - bench/compare/lru-cache/peek.bench.ts > LruCache.peek() - 1000 items / maxSize: 1000
    1.00x faster than @httpx/lru.peek() - compiled (dist)
    2.32x faster than lru-cache@11.3.5.peek()
    6.97x faster than quick-lru@7.3.0.peek()

  @httpx/lru.set() - ts files (dev) - bench/compare/lru-cache/set.bench.ts > LruCache.set() 1000 items / maxSize: 1000
    1.11x faster than @httpx/lru.set() - compiled (dist)
    1.96x faster than quick-lru@7.3.0.set()
    2.43x faster than lru-cache@11.3.5.set()
    2.78x faster than @httpx/time-lru.set() - compiled (dist)
```

### Bun 1.3.13

```
 RUN  v4.1.5 /home/sebastien/github/httpx/packages/lru

 ✓ bench/compare/lru-cache/eviction.bench.ts > LruCache.set() 1000 items / maxSize: 500 4421ms
     name                                           hz     min      max    mean     p75     p99     p995     p999      rme  samples
   · @httpx/lru.set() - ts files (dev)        1,197.53  0.0790  14.9795  0.8351  1.3871  5.1009   8.9362  14.9795  ±11.75%      600
   · @httpx/lru.set() - compiled (dist)       1,320.89  0.0787   198.40  0.7571  0.4753  4.6996  14.4950   198.40  ±69.83%      748
   · @httpx/time-lru.set() - ts file (dev)    1,372.69  0.1298  24.0526  0.7285  1.1515  3.7973   5.4988  24.0526  ±12.14%      687
   · @httpx/time-lru.set() - compiled (dist)  2,319.70  0.1211  16.8465  0.4311  0.2664  3.2391   5.8338  14.2897  ±12.01%     1160
   · quick-lru@7.3.0.set()                    7,782.81  0.0815   9.0347  0.1285  0.1104  0.3599   0.9572   6.3448   ±8.65%     3892
   · lru-cache@11.3.5.set()                   2,182.94  0.1220  22.3550  0.4581  0.2988  2.4610  13.2837  15.6275  ±16.71%     1119
   · lru-cache@11.3.5.set(/with ttl/)         2,942.14  0.1173  16.6449  0.3399  0.2224  2.3414   6.0788  14.9192  ±13.94%     1497

 ✓ bench/compare/lru-cache/get.bench.ts > LruCache.get() - 1000 items / maxSize: 1000 3735ms
     name                                            hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.get() - ts files (dev)        31,637.83  0.0244  0.6594  0.0316  0.0309  0.0895  0.1195  0.2390  ±0.80%    15820
   · @httpx/lru.get() - compiled (dist)       29,521.29  0.0279  0.6894  0.0339  0.0336  0.0895  0.1187  0.2856  ±0.87%    14761
   · @httpx/time-lru.get() - ts files (dev)   14,453.53  0.0559  1.3792  0.0692  0.0737  0.1803  0.2438  0.4244  ±1.12%     7227
   · @httpx/time-lru.get() - compiled (dist)  15,003.41  0.0567  0.6732  0.0667  0.0642  0.1652  0.2276  0.4673  ±0.96%     7503
   · quick-lru@7.3.0.get()                     5,764.77  0.1054  6.4383  0.1735  0.1949  0.4753  0.5875  4.7629  ±4.32%     2883
   · lru-cache@11.3.5.get()                   18,771.88  0.0321  7.5666  0.0533  0.0600  0.1750  0.2274  0.4515  ±3.62%     9386

 ✓ bench/compare/lru-cache/set.bench.ts > LruCache.set() 1000 items / maxSize: 1000 3132ms
     name                                            hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.set() - ts files (dev)        28,910.77  0.0286  0.6597  0.0346  0.0339  0.0875  0.1218  0.2933  ±0.85%    14456
   · @httpx/lru.set() - compiled (dist)       28,137.41  0.0303  0.7425  0.0355  0.0330  0.0882  0.1278  0.3447  ±0.93%    14069
   · @httpx/time-lru.set() - compiled (dist)  15,242.75  0.0570  2.1758  0.0656  0.0645  0.1456  0.2023  0.4559  ±1.20%     7622
   · quick-lru@7.3.0.set()                    12,044.40  0.0478  5.8957  0.0830  0.0780  0.3275  0.3754  4.4128  ±5.82%     6023
   · lru-cache@11.3.5.set()                   12,749.64  0.0547  3.3271  0.0784  0.0873  0.2146  0.2990  0.7256  ±2.21%     6375

 ✓ bench/compare/lru-cache/peek.bench.ts > LruCache.peek() - 1000 items / maxSize: 1000 2542ms
     name                                        hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.peek() - ts files (dev)   87,391.64  0.0086  0.5211  0.0114  0.0106  0.0313  0.0541  0.1399  ±0.79%    43696
   · @httpx/lru.peek() - compiled (dist)  77,536.90  0.0105  1.3749  0.0129  0.0110  0.0356  0.0578  0.1300  ±0.95%    38769
   · quick-lru@7.3.0.peek()               18,065.03  0.0473  1.0166  0.0554  0.0559  0.1335  0.1819  0.3078  ±0.85%     9033
   · lru-cache@11.3.5.peek()              28,496.70  0.0186  7.6128  0.0351  0.0390  0.1330  0.1789  0.4001  ±3.90%    14249

 ✓ bench/compare/lru-cache/iterate.bench.ts > LruCache iterator - 1000 items 2516ms
     name                                           hz     min      max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru - forEach - ts files (dev)   22,130.73  0.0211  12.2012  0.0452  0.0411  0.1848  0.2452  0.7212  ±7.13%    11066
   · @httpx/lru - forEach - compiled (dist)  28,602.83  0.0211   7.4535  0.0350  0.0331  0.1028  0.1327  0.3496  ±6.45%    14436
   · quick-lru@7.3.0 - forEach               10,469.20  0.0684   6.3822  0.0955  0.0941  0.2649  0.3710  1.2177  ±4.90%     5235
   · lru-cache@11.3.5 - forEach              17,421.94  0.0386   6.6090  0.0574  0.0608  0.1614  0.2096  0.5616  ±4.49%     8711

 BENCH  Summary
                                                                                                                                                                                                                                    
  @httpx/lru.set() - ts files (dev) - bench/compare/lru-cache/set.bench.ts > LruCache.set() 1000 items / maxSize: 1000
    1.03x faster than @httpx/lru.set() - compiled (dist)
    1.90x faster than @httpx/time-lru.set() - compiled (dist)
    2.27x faster than lru-cache@11.3.5.set()
    2.40x faster than quick-lru@7.3.0.set()

  @httpx/lru.peek() - ts files (dev) - bench/compare/lru-cache/peek.bench.ts > LruCache.peek() - 1000 items / maxSize: 1000
    1.13x faster than @httpx/lru.peek() - compiled (dist)
    3.07x faster than lru-cache@11.3.5.peek()
    4.84x faster than quick-lru@7.3.0.peek()

  quick-lru@7.3.0.set() - bench/compare/lru-cache/eviction.bench.ts > LruCache.set() 1000 items / maxSize: 500
    2.65x faster than lru-cache@11.3.5.set(/with ttl/)
    3.36x faster than @httpx/time-lru.set() - compiled (dist)
    3.57x faster than lru-cache@11.3.5.set()
    5.67x faster than @httpx/time-lru.set() - ts file (dev)
    5.89x faster than @httpx/lru.set() - compiled (dist)
    6.50x faster than @httpx/lru.set() - ts files (dev)

  @httpx/lru - forEach - compiled (dist) - bench/compare/lru-cache/iterate.bench.ts > LruCache iterator - 1000 items
    1.29x faster than @httpx/lru - forEach - ts files (dev)
    1.64x faster than lru-cache@11.3.5 - forEach
    2.73x faster than quick-lru@7.3.0 - forEach

  @httpx/lru.get() - ts files (dev) - bench/compare/lru-cache/get.bench.ts > LruCache.get() - 1000 items / maxSize: 1000
    1.07x faster than @httpx/lru.get() - compiled (dist)
    1.69x faster than lru-cache@11.3.5.get()
    2.11x faster than @httpx/time-lru.get() - compiled (dist)
    2.19x faster than @httpx/time-lru.get() - ts files (dev)
    5.49x faster than quick-lru@7.3.0.get()
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
