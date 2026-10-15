# @httpx/lru

[![npm](https://img.shields.io/npm/v/@httpx/lru?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/lru) [![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/lru/CHANGELOG.md) [![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-lru-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Flru) [![bundles](https://img.shields.io/static/v1?label=&message=cjs|esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/lru/.size-limit.cjs) [![node](https://img.shields.io/static/v1?label=Node&message=20%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](#compatibility) [![browserslist](https://img.shields.io/static/v1?label=Browsers&message=%3E96%25&logo=googlechrome&style=for-the-badge&labelColor=444&color=informational)](#compatibility) [![downloads](https://img.shields.io/npm/dm/@httpx/lru?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/lru) [![license](https://img.shields.io/npm/l/@httpx/lru?style=for-the-badge&labelColor=444)](https://github.com/belgattitude/httpx/blob/main/LICENSE)

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
- 🛡️&nbsp; Tested on [node 20-26, browser, bun, cloudflare, deno and runtime/edge](#compatibility).
- 🗝️&nbsp; Available in ESM and CJS formats.

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

### Node 26.10

```
 RUN  v5.0.4 /Users/sebastien/github/httpx/packages/lru

 ✓  bench  bench/compare/lru-cache/eviction.bench.ts (1 test) 3785ms
   ✓ LruCache.set() 1000 items / maxSize: 500 (1)
     ✓ LruCache.set() 1000 items / maxSize: 500 3785ms
       name                                          hz     min     max    mean     p75     p99    p995    p999     rme  samples
       quick-lru@7.3.0.set()                  30,009.50  0.0299  1.2847  0.0344  0.0345  0.0555  0.0989  0.1952  ±0.85%    14549   fastest
       lru-cache@11.5.3.set()                 19,820.66  0.0433  1.4778  0.0520  0.0525  0.0922  0.1177  0.2439  ±0.99%     9611
       lru-cache@11.5.3.set(/with ttl/)       19,753.13  0.0440  1.3626  0.0523  0.0525  0.0915  0.1266  0.2601  ±1.02%     9564
       @httpx/lru.set() - ts files (dev)      19,380.07  0.0439  3.6255  0.0659  0.0526  0.1281  1.7378  2.8062  ±6.17%     7589
       @httpx/time-lru.set() - ts file (dev)  14,637.12  0.0567  5.0350  0.0860  0.0699  0.2007  2.1435  2.8262  ±6.02%     5816   slowest
 ✓  bench  bench/compare/lru-cache/get.bench.ts (1 test) 3057ms
   ✓ LruCache.get() - 1000 items / maxSize: 1000 (1)
     ✓ LruCache.get() - 1000 items / maxSize: 1000 3057ms
       name                                            hz     min     max    mean     p75     p99    p995    p999     rme  samples
       lru-cache@11.5.3.get()                  114,375.93  0.0079  0.2768  0.0089  0.0090  0.0135  0.0167  0.0294  ±0.19%    56467   fastest
       @httpx/lru.get() - ts files (dev)        98,748.68  0.0090  0.1858  0.0103  0.0103  0.0179  0.0220  0.0558  ±0.26%    48348
       @httpx/time-lru.get() - ts files (dev)   36,179.91  0.0252  0.2001  0.0280  0.0283  0.0410  0.0486  0.0893  ±0.26%    17866
       quick-lru@7.3.0.get()                    21,899.74  0.0409  0.1948  0.0462  0.0467  0.0643  0.0763  0.1696  ±0.31%    10816   slowest
 ✓  bench  bench/compare/lru-cache/peek.bench.ts (1 test) 2328ms
   ✓ LruCache.peek() - 1000 items / maxSize: 1000 (1)
     ✓ LruCache.peek() - 1000 items / maxSize: 1000 2327ms
       name                                        hz     min     max    mean     p75     p99    p995    p999     rme  samples
       @httpx/lru.peek() - ts files (dev)  306,485.87  0.0030  0.0489  0.0033  0.0033  0.0042  0.0044  0.0113  ±0.09%   151938   fastest
       lru-cache@11.5.3.peek()             137,914.05  0.0068  0.0453  0.0073  0.0075  0.0094  0.0105  0.0186  ±0.08%    68574
       quick-lru@7.3.0.peek()               32,077.38  0.0300  1.3433  0.0314  0.0309  0.0410  0.0442  0.0651  ±0.54%    15906   slowest
 ✓  bench  bench/compare/lru-cache/set.bench.ts (1 test) 2287ms
   ✓ LruCache.set() 1000 items / maxSize: 1000 (1)
     ✓ LruCache.set() 1000 items / maxSize: 1000 2286ms
       name                                      hz     min     max    mean     p75     p99    p995    p999     rme  samples
       @httpx/lru.set() - ts files (dev)  92,356.01  0.0099  0.0715  0.0109  0.0109  0.0158  0.0182  0.0285  ±0.12%    45808   fastest
       quick-lru@7.3.0.set()              72,233.38  0.0119  0.1881  0.0142  0.0142  0.0206  0.0249  0.1045  ±0.37%    35304
       lru-cache@11.5.3.set()             38,909.27  0.0240  0.8325  0.0261  0.0263  0.0364  0.0440  0.1097  ±0.42%    19192   slowest
 ✓  bench  bench/compare/lru-cache/iterate.bench.ts (1 test) 2281ms
   ✓ LruCache iterator - 1000 items (1)
     ✓ LruCache iterator - 1000 items 2280ms
       name                                          hz     min     max    mean     p75     p99    p995    p999     rme  samples
       @httpx/lru - forEach - ts files (dev)  54,595.68  0.0157  0.1303  0.0187  0.0188  0.0285  0.0450  0.0896  ±0.31%    26759   fastest
       lru-cache@11.5.3 - forEach             27,289.09  0.0328  0.1546  0.0371  0.0376  0.0538  0.0860  0.1327  ±0.29%    13473
       quick-lru@7.3.0 - forEach              20,983.40  0.0417  0.1915  0.0483  0.0484  0.0844  0.1016  0.1536  ±0.32%    10345   slowest

```

### Bun 1.4.3

```
RUN  v5.0.4 /Users/sebastien/github/httpx/packages/lru

 ✓  bench  bench/compare/lru-cache/eviction.bench.ts (1 test) 3785ms
   ✓ LruCache.set() 1000 items / maxSize: 500 (1)
     ✓ LruCache.set() 1000 items / maxSize: 500 3784ms
       name                                          hz     min      max    mean     p75     p99    p995    p999     rme  samples
       quick-lru@7.3.0.set()                  38,804.75  0.0236   2.1270  0.0270  0.0265  0.0492  0.0727  0.1340  ±1.51%    18502   fastest
       @httpx/lru.set() - ts files (dev)      30,975.71  0.0255   2.9308  0.0370  0.0341  0.1172  0.1431  0.5860  ±2.50%    13497
       lru-cache@11.5.3.set(/with ttl/)       21,301.40  0.0417   2.7691  0.0485  0.0482  0.0653  0.0743  0.4062  ±1.80%    10311
       lru-cache@11.5.3.set()                 21,018.88  0.0410   2.4207  0.0495  0.0500  0.0689  0.0797  0.6030  ±1.72%    10095
       @httpx/time-lru.set() - ts file (dev)  22,194.82  0.0352  16.5023  0.0527  0.0478  0.1492  0.1757  0.7530  ±7.48%     9493   slowest
 ✓  bench  bench/compare/lru-cache/get.bench.ts (1 test) 3039ms
   ✓ LruCache.get() - 1000 items / maxSize: 1000 (1)
     ✓ LruCache.get() - 1000 items / maxSize: 1000 3038ms
       name                                            hz     min     max    mean     p75     p99    p995    p999     rme  samples
       @httpx/lru.get() - ts files (dev)       120,600.79  0.0077  0.0554  0.0083  0.0084  0.0109  0.0116  0.0212  ±0.09%    59991   fastest
       lru-cache@11.5.3.get()                   67,176.23  0.0138  0.7210  0.0151  0.0151  0.0206  0.0234  0.0370  ±0.53%    33187
       @httpx/time-lru.get() - ts files (dev)   49,546.63  0.0194  0.0719  0.0203  0.0200  0.0288  0.0335  0.0413  ±0.12%    24622
       quick-lru@7.3.0.get()                    31,069.00  0.0288  1.5432  0.0330  0.0340  0.0452  0.0506  0.0653  ±1.26%    15132   slowest
 ✓  bench  bench/compare/lru-cache/peek.bench.ts (1 test) 2305ms
   ✓ LruCache.peek() - 1000 items / maxSize: 1000 (1)
     ✓ LruCache.peek() - 1000 items / maxSize: 1000 2304ms
       name                                        hz     min     max    mean     p75     p99    p995    p999     rme  samples
       @httpx/lru.peek() - ts files (dev)  309,512.60  0.0028  0.2154  0.0033  0.0033  0.0043  0.0045  0.0136  ±0.13%   153051   fastest
       lru-cache@11.5.3.peek()              83,173.96  0.0109  0.6974  0.0122  0.0122  0.0184  0.0211  0.0338  ±0.65%    40820
       quick-lru@7.3.0.peek()               50,576.01  0.0190  0.0838  0.0199  0.0195  0.0275  0.0302  0.0384  ±0.12%    25116   slowest
 ✓  bench  bench/compare/lru-cache/set.bench.ts (1 test) 2291ms
   ✓ LruCache.set() 1000 items / maxSize: 1000 (1)
     ✓ LruCache.set() 1000 items / maxSize: 1000 2290ms
       name                                       hz     min     max    mean     p75     p99    p995    p999     rme  samples
       @httpx/lru.set() - ts files (dev)  120,851.57  0.0074  0.0804  0.0084  0.0085  0.0131  0.0160  0.0248  ±0.14%    59661   fastest
       quick-lru@7.3.0.set()               69,775.11  0.0125  1.9018  0.0151  0.0149  0.0241  0.0290  0.0679  ±1.50%    33195
       lru-cache@11.5.3.set()              34,932.35  0.0265  0.7236  0.0289  0.0285  0.0394  0.0437  0.0599  ±0.31%    17322   slowest
 ✓  bench  bench/compare/lru-cache/iterate.bench.ts (1 test) 2282ms
   ✓ LruCache iterator - 1000 items (1)
     ✓ LruCache iterator - 1000 items 2281ms
       name                                          hz     min     max    mean     p75     p99    p995    p999     rme  samples
       @httpx/lru - forEach - ts files (dev)  78,997.70  0.0110  0.8460  0.0130  0.0130  0.0181  0.0216  0.0383  ±0.85%    38541   fastest
       lru-cache@11.5.3 - forEach             41,066.62  0.0192  2.0918  0.0262  0.0301  0.0593  0.0802  0.1566  ±1.25%    19049
       quick-lru@7.3.0 - forEach              36,586.56  0.0252  0.6268  0.0280  0.0279  0.0414  0.0518  0.1532  ±0.75%    17865   slowest

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

| Level | CI | Description |
| --- | --- | --- |
| Node | ✅ | CI for 20.x, 22.x, 24.x & 26.x. |
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
