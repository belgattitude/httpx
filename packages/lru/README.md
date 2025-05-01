# @httpx/lru

[![npm](https://img.shields.io/npm/v/@httpx/lru?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/lru)
[![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/lru/CHANGELOG.md)
[![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-lru-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Flru)
[![bundles](https://img.shields.io/static/v1?label=&message=cjs|esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/lru/.size-limit.cjs)
[![node](https://img.shields.io/static/v1?label=Node&message=18%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
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
- 📐&nbsp; Lightweight (starts at [~550B](#bundle-size)) 
- 🛡️&nbsp; Tested on [node 18-22, browser, cloudflare workers and runtime/edge](#compatibility).
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
 RUN  v3.1.2 /home/sebastien/github/httpx/packages/lru


 ✓ bench/compare/lru-cache/get.bench.ts > LruCache.get() - 1000 items / maxSize: 1000 3664ms
     name                                            hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.get() - ts files (dev)        17,088.17  0.0485  0.1188  0.0585  0.0755  0.0853  0.0876  0.1050  ±0.43%     8545
   · @httpx/lru.get() - compiled (dist)       16,209.76  0.0543  0.1492  0.0617  0.0610  0.0838  0.0891  0.0980  ±0.31%     8105
   · @httpx/time-lru.get() - ts files (dev)    7,291.55  0.1194  0.4799  0.1371  0.1412  0.1631  0.1770  0.3694  ±0.33%     3646
   · @httpx/time-lru.get() - compiled (dist)  16,505.55  0.0532  0.3161  0.0606  0.0598  0.0815  0.0854  0.1093  ±0.32%     8253
   · quick-lru@7.0.1.get()                     3,756.27  0.2445  0.5010  0.2662  0.2702  0.4184  0.4600  0.4964  ±0.40%     1879   slowest
   · lru-cache@11.1.0.get()                   22,599.04  0.0389  0.1249  0.0442  0.0441  0.0668  0.0748  0.0956  ±0.31%    11300   fastest

 ✓ bench/compare/lru-cache/eviction.bench.ts > LruCache.set() 1000 items / maxSize: 500 3055ms
     name                                            hz     min     max    mean     p75     p99    p995    p999      rme  samples
   · @httpx/lru.set() - ts files (dev)         4,938.30  0.1725  0.5272  0.2025  0.2002  0.4086  0.4325  0.4867   ±0.71%     2470
   · @httpx/lru.set() - compiled (dist)        3,431.40  0.1648  9.3431  0.2914  0.2104  3.1294  8.1823  9.0634  ±12.50%     1716   slowest
   · @httpx/time-lru.set() - compiled (dist)   3,695.01  0.1662  8.6962  0.2706  0.1940  2.5363  7.9365  8.5588  ±12.48%     1851
   · quick-lru@7.0.1.set()                    10,525.40  0.0785  1.9986  0.0950  0.0957  0.2400  0.3769  0.6571   ±1.70%     5263   fastest
   · lru-cache@11.1.0.set()                    5,333.37  0.1549  2.0036  0.1875  0.1849  0.3825  0.4574  1.7385   ±1.31%     2667

 ✓ bench/compare/lru-cache/set.bench.ts > LruCache.set() 1000 items / maxSize: 1000 3055ms
     name                                            hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.set() - ts files (dev)        13,613.96  0.0656  0.1901  0.0735  0.0841  0.1305  0.1352  0.1439  ±0.35%     6807
   · @httpx/lru.set() - compiled (dist)       13,731.33  0.0636  0.1691  0.0728  0.0829  0.1348  0.1374  0.1444  ±0.37%     6866
   · @httpx/time-lru.set() - compiled (dist)  13,348.57  0.0629  0.1418  0.0749  0.0835  0.0992  0.1043  0.1201  ±0.28%     6675
   · quick-lru@7.0.1.set()                    10,902.74  0.0756  1.3841  0.0917  0.0965  0.2939  0.3262  0.4464  ±0.99%     5454   slowest
   · lru-cache@11.1.0.set()                   17,793.71  0.0496  0.3024  0.0562  0.0564  0.0958  0.1029  0.2430  ±0.47%     8897   fastest

 ✓ bench/compare/lru-cache/iterate.bench.ts > LruCache iterator - 1000 items 2438ms
     name                                           hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru - forEach - ts files (dev)   12,955.69  0.0681  0.7699  0.0772  0.0738  0.1977  0.2212  0.2841  ±0.75%     6478   fastest
   · @httpx/lru - forEach - compiled (dist)  11,474.88  0.0680  1.4570  0.0871  0.0832  0.2204  0.3169  0.4624  ±1.20%     5738
   · quick-lru@7.0.1 - forEach                5,222.60  0.1767  0.6112  0.1915  0.1842  0.3277  0.3460  0.5396  ±0.70%     2612   slowest
   · lru-cache@11.1.0 - forEach               7,949.86  0.1177  0.4297  0.1258  0.1235  0.2411  0.2539  0.2866  ±0.51%     3975

 ✓ bench/compare/lru-cache/peek.bench.ts > LruCache.peek() - 1000 items / maxSize: 1000 2472ms
     name                                        hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.peek() - ts files (dev)   34,090.25  0.0264  0.0910  0.0293  0.0282  0.0484  0.0487  0.0537  ±0.25%    17046
   · @httpx/lru.peek() - compiled (dist)  34,839.11  0.0261  0.0861  0.0287  0.0281  0.0460  0.0468  0.0525  ±0.22%    17420   fastest
   · quick-lru@7.0.1.peek()                7,319.34  0.1123  0.5270  0.1366  0.1377  0.2186  0.2244  0.4333  ±0.62%     3661   slowest
   · lru-cache@11.1.0.peek()              21,094.48  0.0407  0.2623  0.0474  0.0488  0.0746  0.0804  0.0979  ±0.40%    10548

 BENCH  Summary

  quick-lru@7.0.1.set() - bench/compare/lru-cache/eviction.bench.ts > LruCache.set() 1000 items / maxSize: 500
    1.97x faster than lru-cache@11.1.0.set()
    2.13x faster than @httpx/lru.set() - ts files (dev)
    2.85x faster than @httpx/time-lru.set() - compiled (dist)
    3.07x faster than @httpx/lru.set() - compiled (dist)

  lru-cache@11.1.0.get() - bench/compare/lru-cache/get.bench.ts > LruCache.get() - 1000 items / maxSize: 1000
    1.32x faster than @httpx/lru.get() - ts files (dev)
    1.37x faster than @httpx/time-lru.get() - compiled (dist)
    1.39x faster than @httpx/lru.get() - compiled (dist)
    3.10x faster than @httpx/time-lru.get() - ts files (dev)
    6.02x faster than quick-lru@7.0.1.get()

  @httpx/lru - forEach - ts files (dev) - bench/compare/lru-cache/iterate.bench.ts > LruCache iterator - 1000 items
    1.13x faster than @httpx/lru - forEach - compiled (dist)
    1.63x faster than lru-cache@11.1.0 - forEach
    2.48x faster than quick-lru@7.0.1 - forEach

  @httpx/lru.peek() - compiled (dist) - bench/compare/lru-cache/peek.bench.ts > LruCache.peek() - 1000 items / maxSize: 1000
    1.02x faster than @httpx/lru.peek() - ts files (dev)
    1.65x faster than lru-cache@11.1.0.peek()
    4.76x faster than quick-lru@7.0.1.peek()

  lru-cache@11.1.0.set() - bench/compare/lru-cache/set.bench.ts > LruCache.set() 1000 items / maxSize: 1000
    1.30x faster than @httpx/lru.set() - compiled (dist)
    1.31x faster than @httpx/lru.set() - ts files (dev)
    1.33x faster than @httpx/time-lru.set() - compiled (dist)
    1.63x faster than quick-lru@7.0.1.set()


```

> See [benchmark file](https://github.com/belgattitude/httpx/blob/main/packages/lru/bench) for details.

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/lru/.size-limit.ts)

| Scenario (esm)                              | Size (compressed) |
|---------------------------------------------|------------------:|
| `import { LruCache } from '@httpx/lru`      |            ~ 571B |
| `import { TimeLruCache } from '@httpx/lru`  |            ~ 676B |

> For CJS usage (not recommended) track the size on [bundlephobia](https://bundlephobia.com/package/@httpx/lru@latest).

## Compatibility

| Level        | CI | Description                                                                                                                                                                                                                                                                                                                                                                              |
|--------------|----|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|  
| Node         | ✅  | CI for 18.x, 20.x & 22.x.                                                                                                                                                                                                                                                                                                                                                                |
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

