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
 RUN  v3.2.4 /home/sebastien/github/httpx/packages/lru


 ✓ bench/compare/lru-cache/get.bench.ts > LruCache.get() - 1000 items / maxSize: 1000 3675ms
     name                                            hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.get() - ts files (dev)        39,417.78  0.0145  0.8932  0.0254  0.0292  0.0536  0.0629  0.1706  ±0.84%    19710
   · @httpx/lru.get() - compiled (dist)       46,283.31  0.0145  0.7629  0.0216  0.0219  0.0448  0.0486  0.0994  ±0.55%    23142
   · @httpx/time-lru.get() - ts files (dev)   15,229.96  0.0442  0.6785  0.0657  0.0670  0.1498  0.2017  0.4098  ±1.09%     7616
   · @httpx/time-lru.get() - compiled (dist)  15,886.96  0.0443  0.7520  0.0629  0.0638  0.1517  0.1703  0.3636  ±0.95%     7944
   · quick-lru@7.1.0.get()                     8,585.63  0.0851  0.7100  0.1165  0.1155  0.2724  0.3436  0.6238  ±0.97%     4293
   · lru-cache@11.1.0.get()                   37,798.70  0.0153  0.5031  0.0265  0.0300  0.0759  0.0808  0.1802  ±0.84%    18900

 ✓ bench/compare/lru-cache/set.bench.ts > LruCache.set() 1000 items / maxSize: 1000 3053ms
     name                                            hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.set() - ts files (dev)        32,305.19  0.0214  0.5094  0.0310  0.0306  0.0702  0.0737  0.1198  ±0.59%    16153
   · @httpx/lru.set() - compiled (dist)       28,455.87  0.0244  0.8735  0.0351  0.0335  0.0800  0.0985  0.2080  ±0.80%    14228
   · @httpx/time-lru.set() - compiled (dist)  13,452.60  0.0501  1.0145  0.0743  0.0794  0.1797  0.2263  0.4412  ±1.18%     6727
   · quick-lru@7.1.0.set()                    22,787.89  0.0237  0.9914  0.0439  0.0484  0.1789  0.3010  0.6739  ±1.73%    11396
   · lru-cache@11.1.0.set()                   12,520.82  0.0473  1.8785  0.0799  0.0943  0.1983  0.2557  0.5155  ±1.49%     6261

 ✓ bench/compare/lru-cache/eviction.bench.ts > LruCache.set() 1000 items / maxSize: 500 3644ms
     name                                            hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.set() - ts files (dev)         6,480.60  0.0663  8.5648  0.1543  0.1172  1.8995  3.2860  6.3725  ±8.96%     3248
   · @httpx/lru.set() - compiled (dist)       10,067.67  0.0519  3.7007  0.0993  0.1008  0.3181  0.5151  1.3723  ±2.70%     5034
   · @httpx/time-lru.set() - compiled (dist)   6,503.08  0.0877  3.4591  0.1538  0.1608  0.4652  0.7752  2.2068  ±2.93%     3252
   · quick-lru@7.1.0.set()                    12,733.02  0.0557  2.2314  0.0785  0.0752  0.2494  0.3120  0.5770  ±1.49%     6367
   · lru-cache@11.1.0.set()                    8,293.03  0.0817  2.2818  0.1206  0.1163  0.3071  0.3787  1.1990  ±1.80%     4147
   · lru-cache@11.1.0.set(/with ttl/)          7,760.70  0.0831  2.8830  0.1289  0.1324  0.3174  0.4880  2.1526  ±2.39%     3881

 ✓ bench/compare/lru-cache/peek.bench.ts > LruCache.peek() - 1000 items / maxSize: 1000 2496ms
     name                                         hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.peek() - ts files (dev)   105,498.43  0.0062  0.7040  0.0095  0.0096  0.0202  0.0210  0.0459  ±0.53%    52750
   · @httpx/lru.peek() - compiled (dist)   96,736.81  0.0064  0.7053  0.0103  0.0108  0.0207  0.0232  0.0614  ±0.60%    48369
   · quick-lru@7.1.0.peek()                14,986.59  0.0463  0.5177  0.0667  0.0654  0.1715  0.2109  0.3917  ±1.01%     7494
   · lru-cache@11.1.0.peek()               57,661.62  0.0113  0.8534  0.0173  0.0171  0.0380  0.0442  0.1158  ±0.66%    28831

 ✓ bench/compare/lru-cache/iterate.bench.ts > LruCache iterator - 1000 items 2433ms
     name                                           hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru - forEach - ts files (dev)   26,606.49  0.0212  3.1924  0.0376  0.0374  0.1206  0.1612  0.3398  ±1.79%    13304
   · @httpx/lru - forEach - compiled (dist)  24,239.94  0.0221  0.6429  0.0413  0.0458  0.1322  0.1909  0.3321  ±1.18%    12120
   · quick-lru@7.1.0 - forEach                9,543.37  0.0575  1.4015  0.1048  0.1259  0.3191  0.4035  0.5947  ±1.58%     4772
   · lru-cache@11.1.0 - forEach              13,098.41  0.0419  0.5822  0.0763  0.0861  0.2238  0.3041  0.4944  ±1.24%     6550

 BENCH  Summary
                                                                                                                                                   
  quick-lru@7.1.0.set() - bench/compare/lru-cache/eviction.bench.ts > LruCache.set() 1000 items / maxSize: 500
    1.26x faster than @httpx/lru.set() - compiled (dist)
    1.54x faster than lru-cache@11.1.0.set()
    1.64x faster than lru-cache@11.1.0.set(/with ttl/)
    1.96x faster than @httpx/time-lru.set() - compiled (dist)
    1.96x faster than @httpx/lru.set() - ts files (dev)

  @httpx/lru.get() - compiled (dist) - bench/compare/lru-cache/get.bench.ts > LruCache.get() - 1000 items / maxSize: 1000
    1.17x faster than @httpx/lru.get() - ts files (dev)
    1.22x faster than lru-cache@11.1.0.get()
    2.91x faster than @httpx/time-lru.get() - compiled (dist)
    3.04x faster than @httpx/time-lru.get() - ts files (dev)
    5.39x faster than quick-lru@7.1.0.get()

  @httpx/lru - forEach - ts files (dev) - bench/compare/lru-cache/iterate.bench.ts > LruCache iterator - 1000 items
    1.10x faster than @httpx/lru - forEach - compiled (dist)
    2.03x faster than lru-cache@11.1.0 - forEach
    2.79x faster than quick-lru@7.1.0 - forEach

  @httpx/lru.peek() - ts files (dev) - bench/compare/lru-cache/peek.bench.ts > LruCache.peek() - 1000 items / maxSize: 1000
    1.09x faster than @httpx/lru.peek() - compiled (dist)
    1.83x faster than lru-cache@11.1.0.peek()
    7.04x faster than quick-lru@7.1.0.peek()

  @httpx/lru.set() - ts files (dev) - bench/compare/lru-cache/set.bench.ts > LruCache.set() 1000 items / maxSize: 1000
    1.14x faster than @httpx/lru.set() - compiled (dist)
    1.42x faster than quick-lru@7.1.0.set()
    2.40x faster than @httpx/time-lru.set() - compiled (dist)
    2.58x faster than lru-cache@11.1.0.set()
```

> See [benchmark file](https://github.com/belgattitude/httpx/blob/main/packages/lru/bench) for details.

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/lru/.size-limit.ts)

| Scenario (esm)                              | Size (compressed) |
|---------------------------------------------|------------------:|
| `import { LruCache } from '@httpx/lru`      |            ~ 570B |
| `import { TimeLruCache } from '@httpx/lru`  |            ~ 670B |

> For CJS usage (not recommended) track the size on [bundlephobia](https://bundlephobia.com/package/@httpx/lru@latest).

## Compatibility

| Level        | CI | Description                                                                                                                                                                                                                                                                                                                                                                              |
|--------------|----|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|  
| Node         | ✅  | CI for 20.x, 22.x & 24.x.                                                                                                                                                                                                                                                                                                                                                                |
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

