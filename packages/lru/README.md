# @httpx/lru

[![npm](https://img.shields.io/npm/v/@httpx/lru?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/lru)
[![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/lru/CHANGELOG.md)
[![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-lru-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Flru)
[![bundles](https://img.shields.io/static/v1?label=&message=cjs|esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/lru/.size-limit.cjs)
[![node](https://img.shields.io/static/v1?label=Node&message=20%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![browserslist](https://img.shields.io/static/v1?label=Browser&message=%3E96%25&logo=googlechrome&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
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
- 🚀&nbsp; Fast `cache.get()` in O(1) thx to [doubly linked list](https://en.wikipedia.org/wiki/Doubly_linked_list).
- ✨&nbsp; Provides convenience [helpers](#helpers) to preserve single instance across your app.
- 📐&nbsp; Lightweight (starts at [~570B](#bundle-size)) 
- 🛡️&nbsp; Tested on [node 20-24, browser, cloudflare workers and runtime/edge](#compatibility).
- 🗝️&nbsp; Available in ESM and CJS formats.

## Documentation

## LruCache

LruCache provides a base LRU implementation. It is a simple cache with a fixed capacity. 
When the cache is full, the least recently used item is removed. Under the hood it uses
a doubly linked list implementation to allow `get()` in O(1). 

### API

| Method                             | Description                                                        |
|------------------------------------|--------------------------------------------------------------------|
| `set(key, value): boolean`         | Add a new entry and return true if entry was overwritten           |
| `get(key): TValue \| undefined`    | Retrieve a cache entry by key                                      |
| `has(key): boolean`                | Check if an entry exist                                            |
| `delete(key): boolean`             | Remove an entry, returns bool indicating if the entry was existing |
| `getOrSet(key, valueOrFn): TValue` | Return the entry if exists otherwise save a new entry              |
| `clear(): number`                  | Clear the cache and return the actual number of deleted entries    |


### Usage

```typescript
// bundle size: ~550B
import { LruCache } from '@httpx/lru';

// 👉 As an alternative to constructor, consider using the helper
//    `getOrCreateLruCache` to ensure only one instance is created
const lru = new LruCache({ maxSize: 1000 });

lru.set('🦄', ['cool', 'stuff']);

if (lru.has('🦄')) {;
 console.log(lru.get('🦄'));
 // ['cool', 'stuff']
}

lru.delete('🦄');
lru.clear();
```

## TimeLruCache

TimeLruCache allows to work with expiry time (TTL). Time-to-live are expressed in milliseconds. The API is similar to LruCache.

| Method                                   | Description                                                               |
|------------------------------------------|---------------------------------------------------------------------------|
| `set(key, value, ttl?): boolean`         | Add a new entry and return true if entry was overwritten                  |
| `get(key): TValue \| undefined`          | Retrieve an entry if exists and hasn't expired.                           |
| `has(key): boolean`                      | Check if an entry exist and hasn't expired                                |
| `delete(key): boolean`                   | Remove an entry, returns bool indicating if the entry was existing        |
| `getOrSet(key, valueOrFn, ttl?): TValue` | Return the entry if exists otherwise save a new entry (value or callback) |
| `clear(): number`                        | Clear the cache and return the actual number of deleted entries           |


### TimeLruCache.has(key)

Checks whether an entry exist and hasn't expired. If the entry exists but has expired, it will be removed
automatically and trigger the `onEviction` callback if present. 

```typescript
import { TimeLruCache } from '@httpx/lru';

const oneSecondInMillis = 1000;

// 👉 As an alternative to constructor, consider using the helper
//    `getOrCreateTimeLruCache` to ensure only one instance is created

const lru = new TimeLruCache({
  maxSize: 1,
  defaultTTL: oneSecondInMillis,
  onEviction: () => { console.log('evicted') }
});

lru.set('key0', 'value0', 2 * oneSecondInMillis);

// 👇 Will evict key0 as maxSize is 1 
lru.set('key1', 'value1', 2 * oneSecondInMillis); 

lru.has('key0'); // 👈 false (item does not exists)
lru.has('key1'); // 👈 true  (item is present and is not expired)

const value = lru.get('key1'); // 👈 'value1' (item is present and is not expired)

// 🕛 wait 3 seconds, time for the item to expire

lru.has('key1'); // 👈 false (item is present but expired - 👋 onEviction will be called)
```

## Helpers

As an alternative to using the constructors directly, the package provides helpers to ensure only one instance
of `LruCache` or `TimeLruCache` is created for a given name. This is particularly useful for hybrid application such as NextJs 
that might loose their references due to their specific module loading strategy. Under the hood instances are
preserved on `globalThis`.

### getOrCreateLruCache

```typescript
import { getOrCreateLruCache } from '@httpx/lru';

const ttlLru = getOrCreateLruCache('main-cache', { maxSize: 500 });
```

### getOrCreateTimeLruCache

```typescript
import { getOrCreateTimeLruCache } from '@httpx/lru';

const ttlLru = getOrCreateTimeLruCache('main-cache', { 
    maxSize: 500, 
    defaultTTL: 60000 
});
```

## API

### Iterable

```typescript
import { LruCache } from '@httpx/lru';

const lru = new LruCache({ maxSize: 2 });

// 👇 Fill the cache with 3 entries
lru.set('key1', 'value1');
lru.set('key2', 'value2');
lru.set('key3', 'value3'); // 👈 Will evict key1 as maxSize is 2

lru.get('key2'); // 👈 Trigger a get to move key2 to the head

const results = [];

// 🖖 Iterate over the cache entries
for (const [key, value] of lru) {
  results.push([key, value]);
}

expect(results).toStrictEqual([
   ['key3', 'value3'], // 👈  Least recently used first
   ['key2', 'value2'], // 👈  Most recently used last
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
lru.set('key1', 'value1');
lru.set('key2', 'value2');
lru.set('key3', 'value3'); // 👈 Will evict key1 due to capacity
expect(fn).toHaveBeenCalledExactlyOnceWith('key1', 'value1');
```

## Benchmarks

> Performance is continuously monitored thanks to [codspeed.io](https://codspeed.io/belgattitude/httpx). 
>
> [![CodSpeed Badge](https://img.shields.io/endpoint?url=https://codspeed.io/badge.json)](https://codspeed.io/belgattitude/httpx)

```
 RUN  v3.2.4 /home/sebastien/github/httpx/packages/lru


 ✓ bench/compare/lru-cache/eviction.bench.ts > LruCache.set() 1000 items / maxSize: 500 3670ms
     name                                            hz     min      max    mean     p75     p99    p995     p999      rme  samples
   · @httpx/lru.set() - ts files (dev)         2,566.45  0.0780  54.4255  0.3896  0.2797  1.9418  7.1542  42.7868  ±31.86%     1284
   · @httpx/lru.set() - compiled (dist)        5,437.51  0.0660   6.1961  0.1839  0.1737  0.9279  1.6280   3.2563   ±4.79%     2719
   · @httpx/time-lru.set() - compiled (dist)   4,550.92  0.0966   4.1208  0.2197  0.2208  0.8397  1.3219   2.3813   ±3.33%     2276
   · quick-lru@7.3.0.set()                    11,333.39  0.0565   1.1546  0.0882  0.0870  0.3277  0.3956   0.7497   ±1.60%     5667
   · lru-cache@11.2.2.set()                    4,675.70  0.0941   4.8828  0.2139  0.2332  0.8485  1.1301   2.4387   ±3.92%     2338
   · lru-cache@11.2.2.set(/with ttl/)          5,420.98  0.0854   3.2797  0.1845  0.2024  0.6832  0.7793   2.1497   ±2.94%     2711

 ✓ bench/compare/lru-cache/get.bench.ts > LruCache.get() - 1000 items / maxSize: 1000 3704ms
     name                                            hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.get() - ts files (dev)        35,665.72  0.0122  0.8649  0.0280  0.0294  0.0827  0.1197  0.2463  ±0.96%    17833
   · @httpx/lru.get() - compiled (dist)       29,847.04  0.0152  0.5264  0.0335  0.0402  0.1123  0.1618  0.2839  ±1.06%    14924
   · @httpx/time-lru.get() - ts files (dev)   16,070.87  0.0450  0.5284  0.0622  0.0621  0.1633  0.2009  0.3425  ±0.83%     8036
   · @httpx/time-lru.get() - compiled (dist)   8,985.98  0.0453  0.9356  0.1113  0.1431  0.4046  0.4991  0.7253  ±1.92%     4494
   · quick-lru@7.3.0.get()                     3,960.35  0.0969  2.2397  0.2525  0.3371  0.9244  1.0905  1.4392  ±3.20%     1982
   · lru-cache@11.2.2.get()                   18,481.24  0.0166  1.2963  0.0541  0.0682  0.2395  0.3410  0.4813  ±1.67%     9243

 ✓ bench/compare/lru-cache/set.bench.ts > LruCache.set() 1000 items / maxSize: 1000 3077ms
     name                                            hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.set() - ts files (dev)        18,583.35  0.0208  0.9595  0.0538  0.0639  0.2132  0.2931  0.4377  ±1.58%     9292
   · @httpx/lru.set() - compiled (dist)       22,047.00  0.0239  0.5956  0.0454  0.0446  0.1648  0.2251  0.3993  ±1.39%    11024
   · @httpx/time-lru.set() - compiled (dist)   8,228.70  0.0514  1.4673  0.1215  0.1573  0.5207  0.6206  0.8934  ±2.43%     4115
   · quick-lru@7.3.0.set()                    10,244.95  0.0274  3.7264  0.0976  0.1102  0.5434  0.7287  1.5108  ±3.34%     5123
   · lru-cache@11.2.2.set()                    5,255.95  0.0548  1.5656  0.1903  0.2411  0.5925  0.6781  1.3258  ±2.34%     2628

 ✓ bench/compare/lru-cache/iterate.bench.ts > LruCache iterator - 1000 items 2457ms
     name                                           hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru - forEach - ts files (dev)   15,776.70  0.0236  3.8272  0.0634  0.0723  0.3378  0.4160  0.7300  ±2.49%     7889
   · @httpx/lru - forEach - compiled (dist)  10,475.82  0.0237  1.6487  0.0955  0.1115  0.5201  0.6515  1.0110  ±2.58%     5238
   · quick-lru@7.3.0 - forEach                6,383.69  0.0575  1.1089  0.1566  0.1938  0.5858  0.6371  0.8235  ±2.28%     3193
   · lru-cache@11.2.2 - forEach               8,655.72  0.0426  1.1830  0.1155  0.1616  0.5036  0.6493  0.9067  ±2.44%     4328

 ✓ bench/compare/lru-cache/peek.bench.ts > LruCache.peek() - 1000 items / maxSize: 1000 2496ms
     name                                        hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.peek() - ts files (dev)   62,822.51  0.0079  1.0232  0.0159  0.0172  0.0594  0.0845  0.2353  ±1.21%    31412
   · @httpx/lru.peek() - compiled (dist)  68,210.19  0.0081  1.1163  0.0147  0.0151  0.0473  0.0754  0.2113  ±1.28%    34106
   · quick-lru@7.3.0.peek()               11,923.17  0.0488  0.7470  0.0839  0.0948  0.2467  0.3133  0.4562  ±1.25%     5962
   · lru-cache@11.2.2.peek()              31,313.87  0.0142  0.5847  0.0319  0.0368  0.1179  0.1900  0.3737  ±1.29%    15657

 BENCH  Summary
                                                                                                                                                    
  quick-lru@7.3.0.set() - bench/compare/lru-cache/eviction.bench.ts > LruCache.set() 1000 items / maxSize: 500
    2.08x faster than @httpx/lru.set() - compiled (dist)
    2.09x faster than lru-cache@11.2.2.set(/with ttl/)
    2.42x faster than lru-cache@11.2.2.set()
    2.49x faster than @httpx/time-lru.set() - compiled (dist)
    4.42x faster than @httpx/lru.set() - ts files (dev)

  @httpx/lru.get() - ts files (dev) - bench/compare/lru-cache/get.bench.ts > LruCache.get() - 1000 items / maxSize: 1000
    1.19x faster than @httpx/lru.get() - compiled (dist)
    1.93x faster than lru-cache@11.2.2.get()
    2.22x faster than @httpx/time-lru.get() - ts files (dev)
    3.97x faster than @httpx/time-lru.get() - compiled (dist)
    9.01x faster than quick-lru@7.3.0.get()

  @httpx/lru - forEach - ts files (dev) - bench/compare/lru-cache/iterate.bench.ts > LruCache iterator - 1000 items
    1.51x faster than @httpx/lru - forEach - compiled (dist)
    1.82x faster than lru-cache@11.2.2 - forEach
    2.47x faster than quick-lru@7.3.0 - forEach

  @httpx/lru.peek() - compiled (dist) - bench/compare/lru-cache/peek.bench.ts > LruCache.peek() - 1000 items / maxSize: 1000
    1.09x faster than @httpx/lru.peek() - ts files (dev)
    2.18x faster than lru-cache@11.2.2.peek()
    5.72x faster than quick-lru@7.3.0.peek()

  @httpx/lru.set() - compiled (dist) - bench/compare/lru-cache/set.bench.ts > LruCache.set() 1000 items / maxSize: 1000
    1.19x faster than @httpx/lru.set() - ts files (dev)
    2.15x faster than quick-lru@7.3.0.set()
    2.68x faster than @httpx/time-lru.set() - compiled (dist)
    4.19x faster than lru-cache@11.2.2.set()
```

> See [benchmark file](https://github.com/belgattitude/httpx/blob/main/packages/lru/bench) for details.

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/lru/.size-limit.ts)

| Scenario (esm)                                        | Size (compressed) |
|-------------------------------------------------------|------------------:|
| `import { LruCache } from '@httpx/lru`                |            ~ 568B |
| `import { TimeLruCache } from '@httpx/lru`            |            ~ 661B |
| `import { getOrCreateLruCache } from '@httpx/lru`     |            ~ 642B |
| `import { getOrCreateTimeLruCache } from '@httpx/lru` |            ~ 746B |

> For CJS usage (not recommended) track the size on [bundlephobia](https://bundlephobia.com/package/@httpx/lru@latest).

## Compatibility

| Level        | CI | Description                                                                                                                                                                                                                                                                                                                                                                              |
|--------------|----|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|  
| Node         | ✅   | CI for 20.x, 22.x, 24.x & 25.x.                                                                                                                                                                                                                                                                                                                                                                   |
| Browser      | ✅  | Tested with latest chrome (vitest/playwright)                                                                                                                                                                                                                                                                                                                                            |
| Browserslist | ✅  | [> 95%](https://browserslist.dev/?q=ZGVmYXVsdHMsIGNocm9tZSA%2BPSA5NiwgZmlyZWZveCA%2BPSAxMDUsIGVkZ2UgPj0gMTEzLCBzYWZhcmkgPj0gMTUsIGlvcyA%2BPSAxNSwgb3BlcmEgPj0gMTAzLCBub3QgZGVhZA%3D%3D) on 01/2025. [defaults, chrome >= 96, firefox >= 105, edge >= 113, safari >= 15, ios >= 15, opera >= 103, not dead](https://github.com/belgattitude/httpx/blob/main/packages/lru/.browserslistrc) |
| Edge         | ✅  | Ensured on CI with [@vercel/edge-runtime](https://github.com/vercel/edge-runtime).                                                                                                                                                                                                                                                                                                       | 
| Cloudflare   | ✅  | Ensured with @cloudflare/vitest-pool-workers (see [wrangler.toml](https://github.com/belgattitude/httpx/blob/main/devtools/vitest/wrangler.toml)                                                                                                                                                                                                                                         |
| Typescript   | ✅  | TS 5.0 + / [are-the-type-wrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io) checks on CI.                                                                                                                                                                                                                                                                            |
| ES2022       | ✅  | Dist files checked with [es-check](https://github.com/yowainwright/es-check)                                                                                                                                                                                                                                                                                                             |
| Performance  | ✅  | Monitored with [codspeed.io](https://codspeed.io/belgattitude/httpx)                                                                                                                                                                                                                                                                                                                     |

> For _older_ browsers: most frontend frameworks can transpile the library (ie: [nextjs](https://nextjs.org/docs/app/api-reference/next-config-js/transpilePackages)...)

## Comparison with other libraries

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

