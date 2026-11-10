# @httpx/lru

[![npm](https://img.shields.io/npm/v/@httpx/lru?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/lru) [![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/lru/CHANGELOG.md) [![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-lru-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Flru) [![bundles](https://img.shields.io/static/v1?label=&message=esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/lru/.size-limit.ts) [![node](https://img.shields.io/static/v1?label=Node&message=22%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](#compatibility) [![browserslist](https://img.shields.io/static/v1?label=Browsers&message=%3E96%25&logo=googlechrome&style=for-the-badge&labelColor=444&color=informational)](#compatibility) [![downloads](https://img.shields.io/npm/dm/@httpx/lru?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/lru) [![license](https://img.shields.io/npm/l/@httpx/lru?style=for-the-badge&labelColor=444)](https://github.com/belgattitude/httpx/blob/main/LICENSE)

LRU cache optimized for performance and low memory usage. 2x-4x times faster on `get()` than [quick-lru](https://github.com/sindresorhus/quick-lru) without [memory overhead](https://github.com/sindresorhus/quick-lru?tab=readme-ov-file#trade-offs) and 6 times smaller than [lru-cache](https://github.com/isaacs/node-lru-cache). TimeLru is less than 700b. Lru less than 600b.

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
- 🛡️&nbsp; Tested on [node 22-26, browser, bun, cloudflare, deno and runtime/edge](#compatibility).
- 🗝️&nbsp; Available in ESM.

## Documentation

## TimeLruCache

TimeLruCache allows to work with expiry time (TTL). Time-to-live are expressed in milliseconds. The API is similar to LruCache.

| Method | Description |
| --- | --- |
| `set(key, value, ttl?): boolean` | Add a new entry and return true if entry was overwritten |
| `get(key): TValue \| undefined` | Retrieve an entry if exists and hasn't expired. |
| `has(key): boolean` | Check if an entry exist and hasn't expired |
| `delete(key): boolean` | Remove an entry, returns bool indicating if the entry was existing |
| `getOrSet(key, valueOrFn, options?): TValue` | Return the entry if exists otherwise save a new entry (value or callback) |
| `clear(): number` | Clear the cache and return the actual number of deleted entries |

### TimeLruCache maxTTL

The optional `maxTTL` param caps the `defaultTTL` and any `ttl` given to `set()` or `getOrSet()` (shorter ones are kept). Ie: keep the cache running but very short lived in development.

```typescript
import { TimeLruCache } from "@httpx/lru";

const lru = new TimeLruCache({
  maxSize: 1000,
  defaultTTL: 60_000,
  maxTTL: process.env.NODE_ENV === "development" ? 50 : undefined,
});

lru.set("key1", "value1", 600_000); // 👈 expires after 50ms in development
lru.params; // 👈 { maxSize: 1000, defaultTTL: 60000, maxTTL: 50 }
```

### TimeLruCache.getOrSet()

Get an item from the cache, if the item doesn't exist or has expired it will create a new entry with the provided value or function and returns it.

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
lru.getOrSet("key2", () => "value2", {
  ttl: 2_000,
  forceRevalidate: false, // default
}); // 👈 returns 'value2'
lru.has("key2"); // 👈 true (it was added)
lru.get("key1"); // 👈 'value1'

// Will trigger an eviction as maxSize capacity (2) is reached.
lru.getOrSet("key3", () => "value3"); // 👈 returns 'value3'

lru.get("key1"); // 👈 undefined (first entry was evicted)
```

### TimeLruCache.has()

Checks whether an entry exist and hasn't expired. If the entry exists but has expired, it will be removed automatically and trigger the `onEviction` callback if present.

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

### TimeLruCache.expiresIn()

> [!WARNING]
> Deprecated, use [`expiresAt()`](#timelrucacheexpiresat) instead (see [UPGRADE.md](https://github.com/belgattitude/httpx/blob/main/packages/lru/UPGRADE.md)).

Returns the remaining time to live of an entry in milliseconds, or `undefined` if the entry doesn't exist or has expired. Like `peek()`, it doesn't mark the entry as recently used and doesn't evict expired entries.

```typescript
import { TimeLruCache } from "@httpx/lru";

const lru = new TimeLruCache({ maxSize: 10, defaultTTL: 1000 });

lru.set("key1", "value1", 500);

lru.expiresIn("key1"); // 👈 500 (or slightly less as time passes)
lru.expiresIn("unknown"); // 👈 undefined (item does not exist)

// 🕛 wait 1 second, time for the item to expire

lru.expiresIn("key1"); // 👈 undefined (item is present but expired)
```

### TimeLruCache.expiresAt()

Returns the expiry time of an entry (epoch milliseconds), or `undefined` if the entry doesn't exist. Unlike `expiresIn()`, it's also returned for expired entries that are still present (ie: to know when an entry expired). It doesn't mark the entry as recently used and doesn't evict expired entries.

```typescript
import { TimeLruCache } from "@httpx/lru";

const lru = new TimeLruCache({ maxSize: 10, defaultTTL: 1000 });

lru.set("key1", "value1", 500);

lru.expiresAt("key1"); // 👈 Date.now() + 500
lru.expiresAt("unknown"); // 👈 undefined (item does not exist)

// 🕛 wait 1 second, time for the item to expire

lru.expiresAt("key1"); // 👈 still the expiry time (item is present but expired)
```

## LruCache

LruCache provides a base LRU implementation. It is a simple cache with a fixed capacity. When the cache is full, the least recently used item is removed. Under the hood it uses a doubly linked list implementation to allow `get()` in O(1). If you're looking for a cache with expiry time (TTL) consider using [TimeLruCache](#timelrucache) instead.

### API

| Method | Description |
| --- | --- |
| `set(key, value): boolean` | Add a new entry and return true if entry was overwritten |
| `get(key): TValue \| undefined` | Retrieve a cache entry by key |
| `has(key): boolean` | Check if an entry exist |
| `delete(key): boolean` | Remove an entry, returns bool indicating if the entry was existing |
| `getOrSet(key, valueOrFn): TValue` | Return the entry if exists otherwise save a new entry |
| `clear(): number` | Clear the cache and return the actual number of deleted entries |

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

As an alternative to using the constructors directly, the package provides helpers to ensure only one instance of `LruCache` or `TimeLruCache` is created for a given name. This is particularly useful for hybrid application such as NextJs that might loose their references due to their specific module loading strategy. Under the hood instances are preserved on `globalThis`.

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

Can be useful to clean up resources or trigger side effects. onEviction callback is called right before an entry is evicted.

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

### Node 26.13

```
 RUN  v5.1.0 /Users/sebastien/github/httpx/packages/lru

 ✓  bench  bench/compare/lru-cache/eviction.bench.ts (1 test) 3779ms
   ✓ LruCache.set() 1000 items / maxSize: 500 (1)
     ✓ LruCache.set() 1000 items / maxSize: 500 3778ms
       name                                     hz     min     max    mean     p75     p99    p995    p999     rme  samples
       quick-lru@7.3.0.set()             19,382.85  0.0398  2.6744  0.0526  0.0513  0.0860  0.0927  0.1650  ±1.37%     9502   fastest
       lru-cache@11.5.3.set()            13,050.43  0.0670  2.1333  0.0774  0.0773  0.0951  0.1067  0.2198  ±0.86%     6462
       lru-cache@11.5.3.set(/with ttl/)  12,841.70  0.0663  1.6443  0.0788  0.0783  0.0960  0.1215  0.2198  ±0.91%     6345
       @httpx/lru.set()                  14,426.50  0.0603  3.5169  0.0854  0.0692  0.1337  2.1797  3.1546  ±6.38%     5852
       @httpx/time-lru.set()             10,556.79  0.0835  3.6600  0.1152  0.0951  0.1642  2.7528  3.3869  ±6.18%     4340   slowest
 ✓  bench  bench/compare/lru-cache/get.bench.ts (1 test) 3040ms
   ✓ LruCache.get() - 1000 items / maxSize: 1000 (1)
     ✓ LruCache.get() - 1000 items / maxSize: 1000 3039ms
       name                           hz     min     max    mean     p75     p99    p995    p999     rme  samples
       lru-cache@11.5.3.get()  71,870.15  0.0131  0.1082  0.0140  0.0140  0.0187  0.0222  0.0257  ±0.10%    35799   fastest
       @httpx/lru.get()        61,545.60  0.0152  0.0817  0.0163  0.0163  0.0219  0.0246  0.0366  ±0.11%    30630
       @httpx/time-lru.get()   23,598.45  0.0406  0.2337  0.0425  0.0423  0.0510  0.0532  0.0840  ±0.16%    11761
       quick-lru@7.3.0.get()   14,031.75  0.0663  0.2248  0.0717  0.0747  0.0844  0.0967  0.1647  ±0.23%     6978   slowest
 ✓  bench  bench/compare/lru-cache/peek.bench.ts (1 test) 2301ms
   ✓ LruCache.peek() - 1000 items / maxSize: 1000 (1)
     ✓ LruCache.peek() - 1000 items / maxSize: 1000 2300ms
       name                             hz     min     max    mean     p75     p99    p995    p999     rme  samples
       @httpx/lru.peek()        213,222.83  0.0045  0.1427  0.0047  0.0047  0.0057  0.0059  0.0135  ±0.10%   106031   fastest
       lru-cache@11.5.3.peek()   89,696.21  0.0109  0.0965  0.0112  0.0112  0.0133  0.0179  0.0224  ±0.09%    44696
       quick-lru@7.3.0.peek()    24,064.33  0.0389  0.1633  0.0417  0.0419  0.0506  0.0525  0.0864  ±0.15%    11991   slowest
 ✓  bench  bench/compare/lru-cache/iterate.bench.ts (1 test) 2278ms
   ✓ LruCache iterator - 1000 items (1)
     ✓ LruCache iterator - 1000 items 2277ms
       name                               hz     min     max    mean     p75     p99    p995    p999     rme  samples
       @httpx/lru - forEach        34,032.25  0.0251  0.1446  0.0298  0.0298  0.0409  0.0537  0.1139  ±0.29%    16802   fastest
       lru-cache@11.5.3 - forEach  17,722.50  0.0487  0.2449  0.0570  0.0572  0.0807  0.1231  0.1717  ±0.31%     8772
       quick-lru@7.3.0 - forEach   14,115.34  0.0648  0.2234  0.0713  0.0713  0.0889  0.1326  0.1580  ±0.25%     7012   slowest
 ✓  bench  bench/compare/lru-cache/set.bench.ts (1 test) 2282ms
   ✓ LruCache.set() 1000 items / maxSize: 1000 (1)
     ✓ LruCache.set() 1000 items / maxSize: 1000 2281ms
       name                           hz     min      max    mean     p75     p99    p995    p999     rme  samples
       @httpx/lru.set()        45,254.40  0.0154   1.1693  0.0241  0.0264  0.0694  0.0869  0.1458  ±0.85%    20781   fastest
       quick-lru@7.3.0.set()   44,470.46  0.0186  18.2436  0.0264  0.0262  0.0666  0.1156  0.3583  ±7.52%    18925
       lru-cache@11.5.3.set()  24,587.32  0.0353   0.1860  0.0409  0.0405  0.0514  0.0586  0.1281  ±0.21%    12228   slowest
```

### Bun 1.4.4

```
 RUN  v5.1.0 /Users/sebastien/github/httpx/packages/lru

 ✓  bench  bench/compare/lru-cache/eviction.bench.ts (1 test) 3788ms
   ✓ LruCache.set() 1000 items / maxSize: 500 (1)
     ✓ LruCache.set() 1000 items / maxSize: 500 3787ms
       name                                     hz     min     max    mean     p75     p99    p995    p999     rme  samples
       quick-lru@7.3.0.set()             24,602.96  0.0376  3.3482  0.0423  0.0420  0.0659  0.0775  0.1766  ±1.87%    11829   fastest
       @httpx/lru.set()                  22,893.06  0.0341  3.4980  0.0507  0.0453  0.1758  0.2225  0.9131  ±2.76%     9865
       @httpx/time-lru.set()             15,412.31  0.0535  3.4444  0.0726  0.0665  0.2181  0.2592  0.9356  ±2.56%     6891
       lru-cache@11.5.3.set()            13,826.93  0.0649  3.3198  0.0742  0.0740  0.0926  0.1014  0.5758  ±1.64%     6739
       lru-cache@11.5.3.set(/with ttl/)  13,546.78  0.0658  3.3402  0.0761  0.0754  0.1014  0.1771  0.5991  ±1.94%     6568   slowest
 ✓  bench  bench/compare/lru-cache/get.bench.ts (1 test) 3035ms
   ✓ LruCache.get() - 1000 items / maxSize: 1000 (1)
     ✓ LruCache.get() - 1000 items / maxSize: 1000 3034ms
       name                           hz     min     max    mean     p75     p99    p995    p999     rme  samples
       @httpx/lru.get()        85,688.01  0.0107  0.1073  0.0117  0.0118  0.0146  0.0188  0.0261  ±0.12%    42610   fastest
       lru-cache@11.5.3.get()  48,273.10  0.0194  1.0065  0.0209  0.0207  0.0272  0.0297  0.0364  ±0.61%    23905
       @httpx/time-lru.get()   32,010.88  0.0301  0.1389  0.0313  0.0314  0.0392  0.0426  0.0496  ±0.12%    15949
       quick-lru@7.3.0.get()   20,095.53  0.0438  2.2021  0.0510  0.0524  0.0689  0.0783  0.1827  ±1.39%     9804   slowest
 ✓  bench  bench/compare/lru-cache/peek.bench.ts (1 test) 2295ms
   ✓ LruCache.peek() - 1000 items / maxSize: 1000 (1)
     ✓ LruCache.peek() - 1000 items / maxSize: 1000 2294ms
       name                             hz     min     max    mean     p75     p99    p995    p999     rme  samples
       @httpx/lru.peek()        209,242.53  0.0042  0.0611  0.0048  0.0049  0.0060  0.0061  0.0151  ±0.08%   104009   fastest
       lru-cache@11.5.3.peek()   54,916.16  0.0168  0.8795  0.0185  0.0182  0.0247  0.0286  0.0412  ±0.68%    27036
       quick-lru@7.3.0.peek()    32,052.51  0.0301  0.2383  0.0313  0.0310  0.0391  0.0422  0.0483  ±0.14%    15968   slowest
 ✓  bench  bench/compare/lru-cache/set.bench.ts (1 test) 2280ms
   ✓ LruCache.set() 1000 items / maxSize: 1000 (1)
     ✓ LruCache.set() 1000 items / maxSize: 1000 2278ms
       name                           hz     min     max    mean     p75     p99    p995    p999     rme  samples
       @httpx/lru.set()        56,440.50  0.0165  0.0744  0.0178  0.0180  0.0224  0.0258  0.0327  ±0.09%    28120   fastest
       quick-lru@7.3.0.set()   46,382.55  0.0194  1.6924  0.0224  0.0220  0.0321  0.0362  0.1217  ±1.37%    22366
       lru-cache@11.5.3.set()  22,448.74  0.0377  1.0425  0.0448  0.0452  0.0547  0.0574  0.0868  ±0.44%    11158   slowest
 ✓  bench  bench/compare/lru-cache/iterate.bench.ts (1 test) 2278ms
   ✓ LruCache iterator - 1000 items (1)
     ✓ LruCache iterator - 1000 items 2277ms
       name                               hz     min     max    mean     p75     p99    p995    p999     rme  samples
       @httpx/lru - forEach        53,889.87  0.0165  0.8098  0.0189  0.0188  0.0242  0.0270  0.0378  ±0.86%    26482   fastest
       lru-cache@11.5.3 - forEach  28,365.70  0.0300  1.9901  0.0369  0.0397  0.0613  0.0820  0.1309  ±1.20%    13536
       quick-lru@7.3.0 - forEach   21,378.93  0.0328  1.2189  0.0486  0.0514  0.0849  0.1045  0.1337  ±1.00%    10292   slowest

```

> See [benchmark file](https://github.com/belgattitude/httpx/blob/main/packages/lru/bench) for details.

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/lru/.size-limit.ts)

| Scenario (esm)                                        | Size (brotli) |
| ----------------------------------------------------- | ------------: |
| `import { LruCache } from '@httpx/lru`                |        ~ 570B |
| `import { TimeLruCache } from '@httpx/lru`            |        ~ 705B |
| `import { getOrCreateLruCache } from '@httpx/lru`     |        ~ 695B |
| `import { getOrCreateTimeLruCache } from '@httpx/lru` |        ~ 785B |

## Upgrade

> Refer to the [UPGRADE.md](https://github.com/belgattitude/httpx/blob/main/packages/lru/UPGRADE.md) for detailed information.

## Compatibility

| Level | CI | Description |
| --- | --- | --- |
| Node | ✅ | CI for 22.x, 24.x & 26.x. |
| Browser | ✅ | Tested with latest chrome (vitest/playwright) |
| Browserslist | ✅ | [defaults, > 0.26%, last 2 versions, Firefox ESR, not dead](https://github.com/belgattitude/httpx/blob/main/packages/lru/.browserslistrc) |
| Bun | ✅ | Tested with latest (at time of writing >= 1.3.3) |
| Deno | ✅ | Tested with latest lts |
| Edge | ✅ | Ensured on CI with [@vercel/edge-runtime](https://github.com/vercel/edge-runtime). |
| Cloudflare | ✅ | Ensured with @cloudflare/vitest-plugin (see [wrangler.toml](https://github.com/belgattitude/httpx/blob/main/devtools/vitest/wrangler.toml) |
| Typescript | ✅ | TS 5.0 + / [are-the-type-wrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io) checks on CI. |
| ES2022 | ✅ | Dist files checked with [es-check](https://github.com/yowainwright/es-check) |
| Performance | ✅ | Monitored with [codspeed.io](https://codspeed.io/belgattitude/httpx) |

> For _older_ browsers: most frontend frameworks can transpile the library (ie: [nextjs](https://nextjs.org/docs/app/api-reference/next-config-js/transpilePackages)...)

## Comparison with other libraries

| Name | Import | Size | (gzip) | BundleJs |
| --- | --- | --: | --: | --- |
| @httpx/lru | `{ LruCache }` | 1.49 KB | 0.65 KB | [![size](https://deno.bundlejs.com/badge?q=@httpx/lru@0.12.5&treeshake=[{+LruCache+}])](https://bundlejs.com/?q=%40httpx%2Flru%400.12.5&treeshake=%5B%7B+LruCache+%7D%5D) |
| @httpx/lru | `{ TimeLruCache }` | 1.91 KB | 0.78 KB | [![size](https://deno.bundlejs.com/badge?q=@httpx/lru@0.12.5&treeshake=[{+TimeLruCache+}])](https://bundlejs.com/?q=%40httpx%2Flru%400.12.5&treeshake=%5B%7B+TimeLruCache+%7D%5D) |
| lru-cache | `{ LruCache }` | 17.30 KB | 5.71 KB | [![size](https://deno.bundlejs.com/badge?q=lru-cache@11.2.4&treeshake=[{+LRUCache+}])](https://bundlejs.com/?q=lru-cache%4011.2.4&treeshake=%5B%7B+LRUCache+%7D%5D) |
| quick-lru | `{ default }` | 3.36 KB | 1.17 KB | [![size](https://deno.bundlejs.com/badge?q=quick-lru@7.3.0&treeshake=[{+default+}])](https://bundlejs.com/?q=quick-lru%407.3.0&treeshake=%5B%7B+default+%7D%5D) |

## Contributors

Contributions are welcome. Have a look to the [CONTRIBUTING](https://github.com/belgattitude/httpx/blob/main/CONTRIBUTING.md) document.

## Sponsors

If my OSS work brightens your day, let's take it to new heights together! [Sponsor](<[sponsorship](https://github.com/sponsors/belgattitude)>), [coffee](<(https://ko-fi.com/belgattitude)>), or star – any gesture of support fuels my passion to improve. Thanks for being awesome! 🙏❤️

### Special thanks to

<table>
  <tr>
    <td>
      <a href="https://www.jetbrains.com/?ref=belgattitude" target="_blank">
         <img width="65" src="https://asset.brandfetch.io/idarKiKkI-/id53SttZhi.jpeg" alt="Jetbrains logo" />
      </a>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://www.jetbrains.com/?ref=belgattitude" target="_blank">JetBrains</a>
    </td>
   </tr>
</table>

## License

MIT © [Sébastien Vanvelthem](https://github.com/belgattitude) and contributors.
