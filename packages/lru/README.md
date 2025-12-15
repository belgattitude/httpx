# @httpx/lru

[![npm](https://img.shields.io/npm/v/@httpx/lru?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/lru)
[![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/lru/CHANGELOG.md)
[![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-lru-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Flru)
[![bundles](https://img.shields.io/static/v1?label=&message=cjs|esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/lru/.size-limit.cjs)
[![node](https://img.shields.io/static/v1?label=Node&message=20%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![browserslist](https://img.shields.io/static/v1?label=Browsers&message=%3E96%25&logo=googlechrome&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![downloads](https://img.shields.io/npm/dm/@httpx/lru?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/lru)
[![license](https://img.shields.io/npm/l/@httpx/lru?style=for-the-badge&labelColor=444)](https://github.com/belgattitude/httpx/blob/main/LICENSE)

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
- 📐&nbsp; Lightweight (starts at [~570B](#bundle-size))
- 🛡️&nbsp; Tested on [node 20-25, bun, browser, cloudflare workers and runtime/edge](#compatibility).
- 🗝️&nbsp; Available in ESM and CJS formats.

## Documentation

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

 RUN  v4.0.15 /home/sebastien/github/httpx/packages/lru


 ✓ bench/compare/lru-cache/get.bench.ts > LruCache.get() - 1000 items / maxSize: 1000 3674ms
     name                                            hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.get() - ts files (dev)        52,858.48  0.0129  0.5259  0.0189  0.0197  0.0391  0.0471  0.0873  ±0.49%    26430
   · @httpx/lru.get() - compiled (dist)       56,755.52  0.0128  1.0615  0.0176  0.0178  0.0306  0.0422  0.1487  ±0.88%    28378
   · @httpx/time-lru.get() - ts files (dev)   20,114.43  0.0416  0.5261  0.0497  0.0492  0.0822  0.1307  0.4384  ±0.77%    10062
   · @httpx/time-lru.get() - compiled (dist)  20,377.54  0.0415  0.4151  0.0491  0.0494  0.0770  0.0994  0.2445  ±0.51%    10189
   · quick-lru@7.3.0.get()                     9,987.43  0.0777  0.5852  0.1001  0.1036  0.2041  0.2495  0.4244  ±0.76%     4994
   · lru-cache@11.2.4.get()                   51,439.83  0.0130  8.2998  0.0194  0.0195  0.0370  0.0505  0.1219  ±4.69%    25720

 ✓ bench/compare/lru-cache/eviction.bench.ts > LruCache.set() 1000 items / maxSize: 500 3642ms
     name                                            hz     min      max    mean     p75     p99    p995     p999      rme  samples
   · @httpx/lru.set() - ts files (dev)         6,884.00  0.0573  65.2638  0.1453  0.0906  0.2435  0.5525  12.9565  ±31.39%     3448
   · @httpx/lru.set() - compiled (dist)       11,853.94  0.0464  11.4618  0.0844  0.0766  0.1654  0.2359   3.4621   ±9.63%     5927
   · @httpx/time-lru.set() - compiled (dist)   8,128.09  0.0749  13.5914  0.1230  0.1047  0.2998  0.4787   9.1927  ±10.49%     4065
   · quick-lru@7.3.0.set()                    14,956.62  0.0525   0.8411  0.0669  0.0670  0.1327  0.1935   0.4599   ±0.93%     7479
   · lru-cache@11.2.4.set()                    9,788.71  0.0728   2.4077  0.1022  0.1090  0.1849  0.2558   0.4856   ±1.32%     4895
   · lru-cache@11.2.4.set(/with ttl/)         10,873.61  0.0719   4.0521  0.0920  0.0916  0.1305  0.1499   0.3988   ±2.49%     5437

 ✓ bench/compare/lru-cache/set.bench.ts > LruCache.set() 1000 items / maxSize: 1000 3049ms
     name                                            hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.set() - ts files (dev)        40,748.52  0.0171  0.5711  0.0245  0.0253  0.0360  0.0423  0.0967  ±0.43%    20375
   · @httpx/lru.set() - compiled (dist)       37,974.99  0.0196  0.3466  0.0263  0.0269  0.0485  0.0581  0.0934  ±0.37%    18988
   · @httpx/time-lru.set() - compiled (dist)  16,922.98  0.0487  0.5760  0.0591  0.0585  0.1032  0.1205  0.2074  ±0.52%     8462
   · quick-lru@7.3.0.set()                    29,619.44  0.0224  0.6579  0.0338  0.0317  0.1571  0.2072  0.3998  ±1.23%    14810
   · lru-cache@11.2.4.set()                   19,530.54  0.0418  1.2038  0.0512  0.0513  0.0831  0.1491  0.1947  ±0.67%     9770

 ✓ bench/compare/lru-cache/peek.bench.ts > LruCache.peek() - 1000 items / maxSize: 1000 2501ms
     name                                         hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.peek() - ts files (dev)   126,547.17  0.0058  0.3844  0.0079  0.0079  0.0117  0.0146  0.0212  ±0.32%    63274
   · @httpx/lru.peek() - compiled (dist)  124,641.88  0.0060  7.0025  0.0080  0.0080  0.0139  0.0163  0.0258  ±2.76%    62321
   · quick-lru@7.3.0.peek()                18,108.38  0.0450  1.4203  0.0552  0.0551  0.0928  0.1046  0.2179  ±0.73%     9055
   · lru-cache@11.2.4.peek()               65,281.78  0.0106  0.4748  0.0153  0.0174  0.0275  0.0312  0.1086  ±0.52%    32641

 ✓ bench/compare/lru-cache/iterate.bench.ts > LruCache iterator - 1000 items 2439ms
     name                                           hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru - forEach - ts files (dev)   39,366.85  0.0184  0.5815  0.0254  0.0244  0.0762  0.0872  0.1657  ±0.67%    19684
   · @httpx/lru - forEach - compiled (dist)  36,523.19  0.0192  0.6397  0.0274  0.0257  0.0871  0.1004  0.1883  ±0.80%    18262
   · quick-lru@7.3.0 - forEach               14,537.02  0.0484  0.5127  0.0688  0.0683  0.1924  0.2138  0.3011  ±0.94%     7269
   · lru-cache@11.2.4 - forEach              19,920.90  0.0365  1.5602  0.0502  0.0502  0.1165  0.1294  0.1901  ±0.81%     9961

 BENCH  Summary

  quick-lru@7.3.0.set() - bench/compare/lru-cache/eviction.bench.ts > LruCache.set() 1000 items / maxSize: 500
    1.26x faster than @httpx/lru.set() - compiled (dist)
    1.38x faster than lru-cache@11.2.4.set(/with ttl/)
    1.53x faster than lru-cache@11.2.4.set()
    1.84x faster than @httpx/time-lru.set() - compiled (dist)
    2.17x faster than @httpx/lru.set() - ts files (dev)

  @httpx/lru.get() - compiled (dist) - bench/compare/lru-cache/get.bench.ts > LruCache.get() - 1000 items / maxSize: 1000
    1.07x faster than @httpx/lru.get() - ts files (dev)
    1.10x faster than lru-cache@11.2.4.get()
    2.79x faster than @httpx/time-lru.get() - compiled (dist)
    2.82x faster than @httpx/time-lru.get() - ts files (dev)
    5.68x faster than quick-lru@7.3.0.get()

  @httpx/lru - forEach - ts files (dev) - bench/compare/lru-cache/iterate.bench.ts > LruCache iterator - 1000 items
    1.08x faster than @httpx/lru - forEach - compiled (dist)
    1.98x faster than lru-cache@11.2.4 - forEach
    2.71x faster than quick-lru@7.3.0 - forEach

  @httpx/lru.peek() - ts files (dev) - bench/compare/lru-cache/peek.bench.ts > LruCache.peek() - 1000 items / maxSize: 1000
    1.02x faster than @httpx/lru.peek() - compiled (dist)
    1.94x faster than lru-cache@11.2.4.peek()
    6.99x faster than quick-lru@7.3.0.peek()

  @httpx/lru.set() - ts files (dev) - bench/compare/lru-cache/set.bench.ts > LruCache.set() 1000 items / maxSize: 1000
    1.07x faster than @httpx/lru.set() - compiled (dist)
    1.38x faster than quick-lru@7.3.0.set()
    2.09x faster than lru-cache@11.2.4.set()
    2.41x faster than @httpx/time-lru.set() - compiled (dist)
```

> See [benchmark file](https://github.com/belgattitude/httpx/blob/main/packages/lru/bench) for details.

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/lru/.size-limit.ts)

| Scenario (esm)                                        | Size (brotli) |
| ----------------------------------------------------- | ------------: |
| `import { LruCache } from '@httpx/lru`                |        ~ 568B |
| `import { TimeLruCache } from '@httpx/lru`            |        ~ 661B |
| `import { getOrCreateLruCache } from '@httpx/lru`     |        ~ 642B |
| `import { getOrCreateTimeLruCache } from '@httpx/lru` |        ~ 746B |

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
