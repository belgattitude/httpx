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
[lru-cache](https://github.com/isaacs/node-lru-cache). Less than 1Kb.

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

```
 RUN  v4.1.0 /home/sebastien/github/httpx/packages/lru

 ✓ bench/compare/lru-cache/eviction.bench.ts > LruCache.set() 1000 items / maxSize: 500 4270ms
     name                                            hz     min      max    mean     p75     p99    p995     p999      rme  samples
   · @httpx/lru.set() - ts files (dev)         8,453.97  0.0731   1.2166  0.1183  0.1319  0.3368  0.5063   0.9037   ±1.55%     4228
   · @httpx/lru.set() - compiled (dist)        3,838.93  0.0634   5.1007  0.2605  0.3324  0.7530  0.9338   1.8119   ±3.28%     1920
   · @httpx/time-lru.set() - ts file (dev)     3,540.84  0.1224  26.9776  0.2824  0.2351  0.8009  0.9583  22.8761  ±20.02%     1802
   · @httpx/time-lru.set() - compiled (dist)   6,094.84  0.1007  10.6649  0.1641  0.1420  0.4745  0.8052  10.2684   ±9.03%     3048
   · quick-lru@7.3.0.set()                    11,641.99  0.0715   2.3239  0.0859  0.0829  0.1873  0.3532   0.8820   ±1.67%     5821
   · lru-cache@11.2.7.set()                    7,579.52  0.0953   7.0204  0.1319  0.1278  0.3226  0.5249   1.0098   ±3.04%     3790
   · lru-cache@11.2.7.set(/with ttl/)          7,764.74  0.0926  11.0658  0.1288  0.1220  0.2597  0.3977   3.5167   ±5.50%     3883

 ✓ bench/compare/lru-cache/get.bench.ts > LruCache.get() - 1000 items / maxSize: 1000 3705ms
     name                                            hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.get() - ts files (dev)        43,003.63  0.0192  0.7170  0.0233  0.0227  0.0548  0.0692  0.1737  ±0.82%    21502
   · @httpx/lru.get() - compiled (dist)       46,051.84  0.0187  1.5442  0.0217  0.0220  0.0446  0.0608  0.1214  ±1.02%    23026
   · @httpx/time-lru.get() - ts files (dev)   15,879.63  0.0567  2.3384  0.0630  0.0590  0.1160  0.1626  0.7025  ±1.43%     7940
   · @httpx/time-lru.get() - compiled (dist)  15,285.30  0.0567  1.2795  0.0654  0.0609  0.1457  0.1978  0.7312  ±1.28%     7643
   · quick-lru@7.3.0.get()                     7,921.80  0.1039  1.5087  0.1262  0.1286  0.3456  0.4925  1.2672  ±1.56%     3962
   · lru-cache@11.2.7.get()                   40,731.53  0.0194  1.0994  0.0246  0.0256  0.0517  0.0746  0.3114  ±1.11%    20366

 ✓ bench/compare/lru-cache/set.bench.ts > LruCache.set() 1000 items / maxSize: 1000 3095ms
     name                                            hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.set() - ts files (dev)        34,608.47  0.0253  3.6463  0.0289  0.0279  0.0534  0.0695  0.1907  ±1.60%    17305
   · @httpx/lru.set() - compiled (dist)       29,410.25  0.0247  3.0612  0.0340  0.0321  0.0955  0.1920  0.7031  ±2.94%    14706
   · @httpx/time-lru.set() - compiled (dist)  13,549.85  0.0624  3.0306  0.0738  0.0685  0.1568  0.2404  0.9160  ±1.99%     6775
   · quick-lru@7.3.0.set()                    11,331.85  0.0391  6.1870  0.0882  0.1145  0.3272  0.4248  0.8947  ±3.22%     5666
   · lru-cache@11.2.7.set()                   16,196.49  0.0534  0.8078  0.0617  0.0595  0.1371  0.2135  0.6066  ±1.12%     8099

 ✓ bench/compare/lru-cache/peek.bench.ts > LruCache.peek() - 1000 items / maxSize: 1000 2526ms
     name                                        hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.peek() - ts files (dev)   86,782.34  0.0095  1.6151  0.0115  0.0100  0.0275  0.0399  0.1150  ±1.32%    43393
   · @httpx/lru.peek() - compiled (dist)  87,604.38  0.0093  5.0238  0.0114  0.0095  0.0252  0.0384  0.0965  ±2.50%    43803
   · quick-lru@7.3.0.peek()               12,534.60  0.0622  1.2795  0.0798  0.0860  0.1701  0.2409  0.6351  ±1.23%     6268
   · lru-cache@11.2.7.peek()              48,332.49  0.0159  1.0363  0.0207  0.0216  0.0563  0.0830  0.2996  ±1.32%    24167

 ✓ bench/compare/lru-cache/iterate.bench.ts > LruCache iterator - 1000 items 2447ms
     name                                           hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru - forEach - ts files (dev)   22,460.42  0.0304  5.2948  0.0445  0.0433  0.1756  0.2575  0.5983  ±2.56%    11231
   · @httpx/lru - forEach - compiled (dist)  20,784.98  0.0293  1.5184  0.0481  0.0460  0.1866  0.3347  0.7055  ±1.89%    10395
   · quick-lru@7.3.0 - forEach                8,156.76  0.0992  1.2396  0.1226  0.1125  0.4542  0.6308  1.0597  ±1.82%     4079
   · lru-cache@11.2.7 - forEach              12,397.63  0.0593  3.6991  0.0807  0.0751  0.2947  0.4388  0.9210  ±2.52%     6199

 BENCH  Summary

  quick-lru@7.3.0.set() - bench/compare/lru-cache/eviction.bench.ts > LruCache.set() 1000 items / maxSize: 500
    1.38x faster than @httpx/lru.set() - ts files (dev)
    1.50x faster than lru-cache@11.2.7.set(/with ttl/)
    1.54x faster than lru-cache@11.2.7.set()
    1.91x faster than @httpx/time-lru.set() - compiled (dist)
    3.03x faster than @httpx/lru.set() - compiled (dist)
    3.29x faster than @httpx/time-lru.set() - ts file (dev)

  @httpx/lru.get() - compiled (dist) - bench/compare/lru-cache/get.bench.ts > LruCache.get() - 1000 items / maxSize: 1000
    1.07x faster than @httpx/lru.get() - ts files (dev)
    1.13x faster than lru-cache@11.2.7.get()
    2.90x faster than @httpx/time-lru.get() - ts files (dev)
    3.01x faster than @httpx/time-lru.get() - compiled (dist)
    5.81x faster than quick-lru@7.3.0.get()

  @httpx/lru - forEach - ts files (dev) - bench/compare/lru-cache/iterate.bench.ts > LruCache iterator - 1000 items
    1.08x faster than @httpx/lru - forEach - compiled (dist)
    1.81x faster than lru-cache@11.2.7 - forEach
    2.75x faster than quick-lru@7.3.0 - forEach

  @httpx/lru.peek() - compiled (dist) - bench/compare/lru-cache/peek.bench.ts > LruCache.peek() - 1000 items / maxSize: 1000
    1.01x faster than @httpx/lru.peek() - ts files (dev)
    1.81x faster than lru-cache@11.2.7.peek()
    6.99x faster than quick-lru@7.3.0.peek()

  @httpx/lru.set() - ts files (dev) - bench/compare/lru-cache/set.bench.ts > LruCache.set() 1000 items / maxSize: 1000
    1.18x faster than @httpx/lru.set() - compiled (dist)
    2.14x faster than lru-cache@11.2.7.set()
    2.55x faster than @httpx/time-lru.set() - compiled (dist)
    3.05x faster than quick-lru@7.3.0.set()
```

> See [benchmark file](https://github.com/belgattitude/httpx/blob/main/packages/lru/bench) for details.

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/lru/.size-limit.ts)

| Scenario (esm)                                        | Size (brotli) |
| ----------------------------------------------------- | ------------: |
| `import { LruCache } from '@httpx/lru`                |        ~ 597B |
| `import { TimeLruCache } from '@httpx/lru`            |        ~ 662B |
| `import { getOrCreateLruCache } from '@httpx/lru`     |        ~ 693B |
| `import { getOrCreateTimeLruCache } from '@httpx/lru` |        ~ 770B |

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
