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
 RUN  v3.1.4 /home/sebastien/github/httpx/packages/lru


 ✓ bench/compare/lru-cache/get.bench.ts > LruCache.get() - 1000 items / maxSize: 1000 3691ms
     name                                            hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.get() - ts files (dev)        42,405.13  0.0111  0.3326  0.0236  0.0244  0.0670  0.0747  0.1128  ±0.73%    21203   fastest
   · @httpx/lru.get() - compiled (dist)       38,697.48  0.0125  0.2658  0.0258  0.0279  0.0769  0.0945  0.1628  ±0.97%    19349
   · @httpx/time-lru.get() - ts files (dev)   10,286.54  0.0385  0.7843  0.0972  0.1697  0.2713  0.3135  0.4499  ±2.02%     5144
   · @httpx/time-lru.get() - compiled (dist)  30,573.80  0.0129  0.2965  0.0327  0.0567  0.1081  0.1332  0.2113  ±1.25%    15287
   · quick-lru@7.0.1.get()                     5,094.69  0.0771  1.4515  0.1963  0.3373  0.6360  0.8556  1.0155  ±2.96%     2549   slowest
   · lru-cache@11.1.0.get()                   34,463.75  0.0134  0.3255  0.0290  0.0445  0.0920  0.1093  0.1646  ±1.08%    17232

 ✓ bench/compare/lru-cache/eviction.bench.ts > LruCache.set() 1000 items / maxSize: 500 3049ms
     name                                            hz     min      max    mean     p75     p99    p995    p999      rme  samples
   · @httpx/lru.set() - ts files (dev)         4,509.30  0.0605  14.5395  0.2218  0.2462  0.9715  6.2385  9.3204  ±12.47%     2255   slowest        
   · @httpx/lru.set() - compiled (dist)        6,480.95  0.0475   3.3455  0.1543  0.1856  0.5587  0.6244  1.4191   ±3.01%     3241
   · @httpx/time-lru.set() - compiled (dist)   5,968.81  0.0505   2.7786  0.1675  0.2591  0.5994  0.7967  1.5231   ±3.22%     2985
   · quick-lru@7.0.1.set()                    16,532.55  0.0239   1.1930  0.0605  0.0994  0.2428  0.3688  0.9218   ±2.32%     8267   fastest        
   · lru-cache@11.1.0.set()                    7,367.21  0.0476   2.2883  0.1357  0.2173  0.3905  0.4858  1.5726   ±2.65%     3685

 ✓ bench/compare/lru-cache/set.bench.ts > LruCache.set() 1000 items / maxSize: 1000 3063ms
     name                                            hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.set() - ts files (dev)        21,091.59  0.0176  0.2796  0.0474  0.0739  0.1185  0.1394  0.2052  ±1.17%    10547
   · @httpx/lru.set() - compiled (dist)       29,087.80  0.0198  0.2193  0.0344  0.0325  0.0978  0.1051  0.1349  ±0.71%    14544
   · @httpx/time-lru.set() - compiled (dist)  35,151.91  0.0200  0.1908  0.0284  0.0283  0.0769  0.0841  0.0994  ±0.42%    17576
   · quick-lru@7.0.1.set()                    14,710.78  0.0231  1.1529  0.0680  0.0866  0.2288  0.5122  0.9337  ±2.09%     7356   slowest
   · lru-cache@11.1.0.set()                   37,232.72  0.0182  0.5392  0.0269  0.0248  0.0875  0.0951  0.1472  ±0.70%    18617   fastest

 ✓ bench/compare/lru-cache/iterate.bench.ts > LruCache iterator - 1000 items 2444ms
     name                                           hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru - forEach - ts files (dev)   18,562.39  0.0205  1.6580  0.0539  0.0810  0.1873  0.2947  0.4141  ±1.60%     9282
   · @httpx/lru - forEach - compiled (dist)  27,641.72  0.0204  0.5506  0.0362  0.0377  0.1089  0.1430  0.2972  ±1.04%    13821   fastest
   · quick-lru@7.0.1 - forEach                9,100.31  0.0510  0.8452  0.1099  0.1398  0.4057  0.4698  0.6423  ±2.07%     4552   slowest
   · lru-cache@11.1.0 - forEach              16,448.05  0.0370  0.9403  0.0608  0.0593  0.1687  0.2128  0.3754  ±1.21%     8225

 ✓ bench/compare/lru-cache/peek.bench.ts > LruCache.peek() - 1000 items / maxSize: 1000 2487ms
     name                                        hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.peek() - ts files (dev)   98,492.49  0.0073  1.0316  0.0102  0.0098  0.0237  0.0264  0.0357  ±0.67%    49247   fastest
   · @httpx/lru.peek() - compiled (dist)  87,879.22  0.0074  1.6646  0.0114  0.0114  0.0272  0.0286  0.0468  ±1.07%    43940
   · quick-lru@7.0.1.peek()               16,194.20  0.0422  0.9650  0.0618  0.0616  0.1535  0.1643  0.2312  ±0.94%     8098   slowest
   · lru-cache@11.1.0.peek()              59,101.42  0.0125  0.2308  0.0169  0.0169  0.0306  0.0418  0.0495  ±0.27%    29551

 BENCH  Summary

  quick-lru@7.0.1.set() - bench/compare/lru-cache/eviction.bench.ts > LruCache.set() 1000 items / maxSize: 500
    2.24x faster than lru-cache@11.1.0.set()
    2.55x faster than @httpx/lru.set() - compiled (dist)
    2.77x faster than @httpx/time-lru.set() - compiled (dist)
    3.67x faster than @httpx/lru.set() - ts files (dev)

  @httpx/lru.get() - ts files (dev) - bench/compare/lru-cache/get.bench.ts > LruCache.get() - 1000 items / maxSize: 1000
    1.10x faster than @httpx/lru.get() - compiled (dist)
    1.23x faster than lru-cache@11.1.0.get()
    1.39x faster than @httpx/time-lru.get() - compiled (dist)
    4.12x faster than @httpx/time-lru.get() - ts files (dev)
    8.32x faster than quick-lru@7.0.1.get()

  @httpx/lru - forEach - compiled (dist) - bench/compare/lru-cache/iterate.bench.ts > LruCache iterator - 1000 items
    1.49x faster than @httpx/lru - forEach - ts files (dev)
    1.68x faster than lru-cache@11.1.0 - forEach
    3.04x faster than quick-lru@7.0.1 - forEach

  @httpx/lru.peek() - ts files (dev) - bench/compare/lru-cache/peek.bench.ts > LruCache.peek() - 1000 items / maxSize: 1000
    1.12x faster than @httpx/lru.peek() - compiled (dist)
    1.67x faster than lru-cache@11.1.0.peek()
    6.08x faster than quick-lru@7.0.1.peek()

  lru-cache@11.1.0.set() - bench/compare/lru-cache/set.bench.ts > LruCache.set() 1000 items / maxSize: 1000
    1.06x faster than @httpx/time-lru.set() - compiled (dist)
    1.28x faster than @httpx/lru.set() - compiled (dist)
    1.77x faster than @httpx/lru.set() - ts files (dev)
    2.53x faster than quick-lru@7.0.1.set()

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

