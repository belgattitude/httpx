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


 ✓ bench/compare/lru-cache/get.bench.ts > LruCache.get() - 1000 items / maxSize: 1000 3665ms
     name                                            hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.get() - ts files (dev)        50,846.51  0.0129  0.5729  0.0197  0.0198  0.0447  0.0492  0.0650  ±0.47%    25424
   · @httpx/lru.get() - compiled (dist)       44,691.11  0.0130  1.1781  0.0224  0.0229  0.0517  0.0553  0.0898  ±0.74%    22346
   · @httpx/time-lru.get() - ts files (dev)   19,862.73  0.0382  0.4423  0.0503  0.0523  0.0902  0.1050  0.2066  ±0.50%     9932
   · @httpx/time-lru.get() - compiled (dist)  17,693.14  0.0382  0.8192  0.0565  0.0543  0.1734  0.1837  0.2754  ±1.00%     8847
   · quick-lru@7.2.0.get()                     9,672.62  0.0733  1.2781  0.1034  0.1020  0.2669  0.2958  0.5603  ±1.14%     4837
   · lru-cache@11.2.1.get()                   52,595.46  0.0132  0.6139  0.0190  0.0189  0.0367  0.0451  0.0680  ±0.45%    26298

 ✓ bench/compare/lru-cache/eviction.bench.ts > LruCache.set() 1000 items / maxSize: 500 3642ms
     name                                            hz     min      max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.set() - ts files (dev)         7,091.48  0.0535  12.7365  0.1410  0.1142  1.7436  3.2453  5.0107  ±9.60%     3546
   · @httpx/lru.set() - compiled (dist)       12,575.41  0.0434   1.9085  0.0795  0.0778  0.2256  0.4362  1.4211  ±2.38%     6288
   · @httpx/time-lru.set() - compiled (dist)   9,175.92  0.0724   1.7241  0.1090  0.1061  0.2228  0.4752  1.3814  ±1.91%     4588
   · quick-lru@7.2.0.set()                    14,477.17  0.0487   1.5211  0.0691  0.0674  0.1807  0.2244  0.4034  ±1.12%     7240
   · lru-cache@11.2.1.set()                    8,929.28  0.0705   2.1478  0.1120  0.1063  0.3553  0.4212  1.3438  ±2.08%     4465
   · lru-cache@11.2.1.set(/with ttl/)          8,723.23  0.0711   2.3347  0.1146  0.1141  0.2821  0.3222  1.2264  ±1.93%     4362

 ✓ bench/compare/lru-cache/set.bench.ts > LruCache.set() 1000 items / maxSize: 1000 3054ms
     name                                            hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.set() - ts files (dev)        31,753.67  0.0180  2.3506  0.0315  0.0305  0.0782  0.1012  0.3577  ±1.68%    15877
   · @httpx/lru.set() - compiled (dist)       30,007.48  0.0210  0.4812  0.0333  0.0334  0.0760  0.0811  0.1112  ±0.69%    15005
   · @httpx/time-lru.set() - compiled (dist)  16,310.58  0.0441  0.4981  0.0613  0.0602  0.1587  0.1706  0.2623  ±0.83%     8156
   · quick-lru@7.2.0.set()                    29,047.20  0.0212  1.8865  0.0344  0.0307  0.1125  0.2180  0.4784  ±1.65%    14525
   · lru-cache@11.2.1.set()                   16,645.14  0.0411  1.0199  0.0601  0.0615  0.1637  0.1817  0.2371  ±0.96%     8323

 ✓ bench/compare/lru-cache/peek.bench.ts > LruCache.peek() - 1000 items / maxSize: 1000 2498ms
     name                                         hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.peek() - ts files (dev)   125,683.48  0.0055  0.3893  0.0080  0.0078  0.0202  0.0210  0.0332  ±0.36%    62842
   · @httpx/lru.peek() - compiled (dist)  128,794.30  0.0054  0.1998  0.0078  0.0078  0.0183  0.0188  0.0299  ±0.29%    64398
   · quick-lru@7.2.0.peek()                18,857.22  0.0397  0.7761  0.0530  0.0543  0.0965  0.1108  0.2889  ±0.61%     9429
   · lru-cache@11.2.1.peek()               64,354.39  0.0106  0.1838  0.0155  0.0144  0.0539  0.0547  0.0721  ±0.49%    32178

 ✓ bench/compare/lru-cache/iterate.bench.ts > LruCache iterator - 1000 items 2434ms
     name                                           hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru - forEach - ts files (dev)   30,985.39  0.0191  1.3612  0.0323  0.0320  0.1014  0.1366  0.2630  ±1.11%    15493
   · @httpx/lru - forEach - compiled (dist)  31,883.68  0.0191  0.7676  0.0314  0.0323  0.1005  0.1317  0.2090  ±0.85%    15942
   · quick-lru@7.2.0 - forEach               11,800.87  0.0492  0.8882  0.0847  0.0900  0.2129  0.2768  0.4398  ±1.23%     5901
   · lru-cache@11.2.1 - forEach              16,412.86  0.0357  1.0620  0.0609  0.0597  0.1874  0.2210  0.4427  ±1.33%     8207

 BENCH  Summary
                                                                                                                                                    
  quick-lru@7.2.0.set() - bench/compare/lru-cache/eviction.bench.ts > LruCache.set() 1000 items / maxSize: 500
    1.15x faster than @httpx/lru.set() - compiled (dist)
    1.58x faster than @httpx/time-lru.set() - compiled (dist)
    1.62x faster than lru-cache@11.2.1.set()
    1.66x faster than lru-cache@11.2.1.set(/with ttl/)
    2.04x faster than @httpx/lru.set() - ts files (dev)

  lru-cache@11.2.1.get() - bench/compare/lru-cache/get.bench.ts > LruCache.get() - 1000 items / maxSize: 1000
    1.03x faster than @httpx/lru.get() - ts files (dev)
    1.18x faster than @httpx/lru.get() - compiled (dist)
    2.65x faster than @httpx/time-lru.get() - ts files (dev)
    2.97x faster than @httpx/time-lru.get() - compiled (dist)
    5.44x faster than quick-lru@7.2.0.get()

  @httpx/lru - forEach - compiled (dist) - bench/compare/lru-cache/iterate.bench.ts > LruCache iterator - 1000 items
    1.03x faster than @httpx/lru - forEach - ts files (dev)
    1.94x faster than lru-cache@11.2.1 - forEach
    2.70x faster than quick-lru@7.2.0 - forEach

  @httpx/lru.peek() - compiled (dist) - bench/compare/lru-cache/peek.bench.ts > LruCache.peek() - 1000 items / maxSize: 1000
    1.02x faster than @httpx/lru.peek() - ts files (dev)
    2.00x faster than lru-cache@11.2.1.peek()
    6.83x faster than quick-lru@7.2.0.peek()

  @httpx/lru.set() - ts files (dev) - bench/compare/lru-cache/set.bench.ts > LruCache.set() 1000 items / maxSize: 1000
    1.06x faster than @httpx/lru.set() - compiled (dist)
    1.09x faster than quick-lru@7.2.0.set()
    1.91x faster than lru-cache@11.2.1.set()
    1.95x faster than @httpx/time-lru.set() - compiled (dist)
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

