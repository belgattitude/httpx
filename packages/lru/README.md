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
 RUN  v3.0.5 /home/sebastien/github/httpx/packages/lru


 ✓ bench/compare/lru-cache/get.bench.ts > LruCache.get() - 1000 items / maxSize: 1000 3655ms
     name                                            hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.get() - ts files (dev)        23,302.95  0.0389  0.1166  0.0429  0.0412  0.0592  0.0599  0.0652  ±0.24%    11652
   · @httpx/lru.get() - compiled (dist)       22,899.83  0.0406  0.1015  0.0437  0.0441  0.0563  0.0579  0.0648  ±0.11%    11450
   · @httpx/time-lru.get() - ts files (dev)   10,991.66  0.0821  0.5469  0.0910  0.0982  0.1118  0.1451  0.2071  ±0.36%     5496
   · @httpx/time-lru.get() - compiled (dist)  22,819.78  0.0400  0.1242  0.0438  0.0437  0.0617  0.0896  0.0944  ±0.24%    11410
   · quick-lru@7.0.0.get()                     5,145.85  0.1696  0.5210  0.1943  0.1886  0.3176  0.3383  0.4061  ±0.63%     2573   slowest
   · lru-cache@11.0.2.get()                   29,265.85  0.0312  0.1175  0.0342  0.0342  0.0560  0.0618  0.0781  ±0.26%    14633   fastest

 ✓ bench/compare/lru-cache/iterate.bench.ts > LruCache iterator - 1000 items 2433ms
     name                                           hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru - forEach - ts files (dev)   20,133.49  0.0432  0.5043  0.0497  0.0484  0.1173  0.1251  0.1573  ±0.50%    10067
   · @httpx/lru - forEach - compiled (dist)  20,467.73  0.0430  0.9863  0.0489  0.0476  0.1166  0.1208  0.1674  ±0.57%    10234   fastest
   · quick-lru@7.0.0 - forEach                7,695.68  0.1191  0.4148  0.1299  0.1289  0.2052  0.2124  0.2510  ±0.38%     3848   slowest
   · lru-cache@11.0.2 - forEach              11,152.12  0.0817  0.3444  0.0897  0.0893  0.1649  0.1731  0.2228  ±0.41%     5577

 ✓ bench/compare/lru-cache/set.bench.ts > LruCache.set() 1000 items / maxSize: 1000 3049ms
     name                                            hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.set() - ts files (dev)        24,085.16  0.0381  0.0914  0.0415  0.0414  0.0516  0.0558  0.0633  ±0.14%    12043   fastest
   · @httpx/lru.set() - compiled (dist)       20,307.18  0.0442  0.1317  0.0492  0.0516  0.0710  0.0807  0.0999  ±0.23%    10154
   · @httpx/time-lru.set() - compiled (dist)  20,863.73  0.0396  0.1229  0.0479  0.0526  0.0696  0.0744  0.0906  ±0.28%    10432
   · quick-lru@7.0.0.set()                    17,044.46  0.0493  1.5613  0.0587  0.0602  0.1967  0.2802  0.3540  ±1.12%     8523   slowest
   · lru-cache@11.0.2.set()                   23,066.99  0.0355  0.9051  0.0434  0.0424  0.1088  0.1238  0.1630  ±0.65%    11534

 ✓ bench/compare/lru-cache/peek.bench.ts > LruCache.peek() - 1000 items / maxSize: 500 2475ms
     name                                        hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.peek() - ts files (dev)   55,999.04  0.0155  0.2786  0.0179  0.0180  0.0320  0.0327  0.0510  ±0.21%    28000   fastest
   · @httpx/lru.peek() - compiled (dist)  53,955.12  0.0162  0.0447  0.0185  0.0189  0.0280  0.0302  0.0339  ±0.12%    26978
   · quick-lru@7.0.0.peek()               20,934.60  0.0427  0.3113  0.0478  0.0475  0.0652  0.0675  0.1065  ±0.29%    10468   slowest
   · lru-cache@11.0.2.peek()              47,375.30  0.0195  0.1134  0.0211  0.0214  0.0287  0.0367  0.0651  ±0.16%    23688

 BENCH  Summary

  lru-cache@11.0.2.get() - bench/compare/lru-cache/get.bench.ts > LruCache.get() - 1000 items / maxSize: 1000
    1.26x faster than @httpx/lru.get() - ts files (dev)
    1.28x faster than @httpx/lru.get() - compiled (dist)
    1.28x faster than @httpx/time-lru.get() - compiled (dist)
    2.66x faster than @httpx/time-lru.get() - ts files (dev)
    5.69x faster than quick-lru@7.0.0.get()

  @httpx/lru - forEach - compiled (dist) - bench/compare/lru-cache/iterate.bench.ts > LruCache iterator - 1000 items
    1.02x faster than @httpx/lru - forEach - ts files (dev)
    1.84x faster than lru-cache@11.0.2 - forEach
    2.66x faster than quick-lru@7.0.0 - forEach

  @httpx/lru.peek() - ts files (dev) - bench/compare/lru-cache/peek.bench.ts > LruCache.peek() - 1000 items / maxSize: 500
    1.04x faster than @httpx/lru.peek() - compiled (dist)
    1.18x faster than lru-cache@11.0.2.peek()
    2.67x faster than quick-lru@7.0.0.peek()

  @httpx/lru.set() - ts files (dev) - bench/compare/lru-cache/set.bench.ts > LruCache.set() 1000 items / maxSize: 1000
    1.04x faster than lru-cache@11.0.2.set()
    1.15x faster than @httpx/time-lru.set() - compiled (dist)
    1.19x faster than @httpx/lru.set() - compiled (dist)
    1.41x faster than quick-lru@7.0.0.set()

```

> See [benchmark file](https://github.com/belgattitude/httpx/blob/main/packages/lru/bench) for details.

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/lru/.size-limit.ts)

| Scenario (esm)                              | Size (compressed) |
|---------------------------------------------|------------------:|
| `import { LruCache  } from '@httpx/lru`     |            ~ 557B |
| `import { TimeLruCache  } from '@httpx/lru` |            ~ 654B |

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
