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

lru.set('🦆', ['cool', 'stuff']);

if (lru.has('🦆')) {;
 console.log(lru.get('🦆'));
 // ['cool', 'stuff']
}

lru.delete('🦆');
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
lru.set('key1', 'value1');
lru.getOrSet('key1', () => 'value2');         // 👈 returns 'value1' (entry exists)

// The key doesn't exist, a new entry will be created from the function return value
lru.getOrSet('key2', () => 'value2', 2_000);  // 👈 returns 'value2'
lru.has('key2');                              // 👈 true (it was added)
lru.get('key1');                              // 👈 'value1'

// Will trigger an eviction as maxSize capacity (2) is reached.
lru.getOrSet('key3', () => 'value3');        // 👈 returns 'value3'

lru.get('key1'); // 👈 undefined (first entry was evicted)
```

### TimeLruCache.has()

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
 RUN  v4.0.14 /home/sebastien/github/httpx/packages/lru


 ✓ bench/compare/lru-cache/eviction.bench.ts > LruCache.set() 1000 items / maxSize: 500 3675ms
     name                                            hz     min      max    mean     p75     p99    p995     p999      rme  samples
   · @httpx/lru.set() - ts files (dev)         8,198.94  0.0570  37.2874  0.1220  0.0864  0.1822  0.5111  11.4711  ±21.51%     4100
   · @httpx/lru.set() - compiled (dist)       11,355.44  0.0470  17.8911  0.0881  0.0695  0.1531  0.1777  10.6576  ±14.37%     5678
   · @httpx/time-lru.set() - compiled (dist)   8,524.57  0.0768  10.0870  0.1173  0.1058  0.2093  0.2888   9.2608   ±8.80%     4263
   · quick-lru@7.3.0.set()                    15,053.34  0.0522   0.7620  0.0664  0.0662  0.1350  0.1732   0.4738   ±0.86%     7527
   · lru-cache@11.2.2.set()                   11,030.56  0.0706   1.6803  0.0907  0.0919  0.1624  0.2174   0.9894   ±1.39%     5516
   · lru-cache@11.2.2.set(/with ttl/)         10,894.70  0.0705   3.7188  0.0918  0.0942  0.1461  0.2297   0.4906   ±1.80%     5448

 ✓ bench/compare/lru-cache/get.bench.ts > LruCache.get() - 1000 items / maxSize: 1000 3665ms
     name                                            hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.get() - ts files (dev)        58,498.98  0.0122  0.7090  0.0171  0.0176  0.0337  0.0381  0.0922  ±0.55%    29251
   · @httpx/lru.get() - compiled (dist)       58,486.64  0.0126  0.5541  0.0171  0.0175  0.0285  0.0374  0.0860  ±0.48%    29244
   · @httpx/time-lru.get() - ts files (dev)   20,092.33  0.0395  1.4163  0.0498  0.0493  0.0943  0.1255  0.3171  ±0.91%    10047
   · @httpx/time-lru.get() - compiled (dist)  20,945.97  0.0413  0.6734  0.0477  0.0480  0.0808  0.1172  0.2082  ±0.58%    10473
   · quick-lru@7.3.0.get()                    10,295.97  0.0766  0.9460  0.0971  0.0942  0.2970  0.6697  0.7408  ±1.56%     5148
   · lru-cache@11.2.2.get()                   60,200.69  0.0120  1.4386  0.0166  0.0163  0.0363  0.0985  0.3723  ±1.59%    30101

 ✓ bench/compare/lru-cache/set.bench.ts > LruCache.set() 1000 items / maxSize: 1000 3048ms
     name                                            hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.set() - ts files (dev)        42,921.44  0.0178  0.6584  0.0233  0.0240  0.0396  0.0538  0.0928  ±0.43%    21461
   · @httpx/lru.set() - compiled (dist)       41,617.85  0.0189  1.0583  0.0240  0.0241  0.0385  0.0519  0.2014  ±0.86%    20809
   · @httpx/time-lru.set() - compiled (dist)  18,299.15  0.0466  1.3663  0.0546  0.0540  0.1040  0.1434  0.2715  ±0.78%     9150
   · quick-lru@7.3.0.set()                    30,679.64  0.0232  0.7704  0.0326  0.0320  0.1325  0.2009  0.3653  ±1.11%    15340
   · lru-cache@11.2.2.set()                   20,376.74  0.0405  3.5587  0.0491  0.0476  0.1092  0.1428  0.4605  ±1.65%    10189

 ✓ bench/compare/lru-cache/peek.bench.ts > LruCache.peek() - 1000 items / maxSize: 1000 2500ms
     name                                         hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.peek() - ts files (dev)   140,035.12  0.0058  0.4400  0.0071  0.0071  0.0112  0.0142  0.0402  ±0.36%    70018
   · @httpx/lru.peek() - compiled (dist)  132,457.35  0.0061  0.3426  0.0075  0.0076  0.0113  0.0136  0.0320  ±0.30%    66229
   · quick-lru@7.3.0.peek()                18,527.87  0.0442  2.4759  0.0540  0.0552  0.0919  0.1132  0.2366  ±1.05%     9264
   · lru-cache@11.2.2.peek()               67,761.49  0.0108  2.8718  0.0148  0.0147  0.0341  0.0487  0.1281  ±1.26%    33881

 ✓ bench/compare/lru-cache/iterate.bench.ts > LruCache iterator - 1000 items 2437ms
     name                                           hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru - forEach - ts files (dev)   39,401.62  0.0189  1.1452  0.0254  0.0242  0.0823  0.0961  0.1842  ±0.86%    19701
   · @httpx/lru - forEach - compiled (dist)  40,259.23  0.0188  0.9283  0.0248  0.0239  0.0807  0.0893  0.1349  ±0.74%    20130
   · quick-lru@7.3.0 - forEach               14,836.44  0.0499  1.7196  0.0674  0.0672  0.1530  0.1832  0.3386  ±1.02%     7419
   · lru-cache@11.2.2 - forEach              19,838.94  0.0391  1.6112  0.0504  0.0493  0.1167  0.1374  0.3014  ±0.92%     9920

 BENCH  Summary
                                                                                                                                                    
  quick-lru@7.3.0.set() - bench/compare/lru-cache/eviction.bench.ts > LruCache.set() 1000 items / maxSize: 500
    1.33x faster than @httpx/lru.set() - compiled (dist)
    1.36x faster than lru-cache@11.2.2.set()
    1.38x faster than lru-cache@11.2.2.set(/with ttl/)
    1.77x faster than @httpx/time-lru.set() - compiled (dist)
    1.84x faster than @httpx/lru.set() - ts files (dev)

  lru-cache@11.2.2.get() - bench/compare/lru-cache/get.bench.ts > LruCache.get() - 1000 items / maxSize: 1000
    1.03x faster than @httpx/lru.get() - ts files (dev)
    1.03x faster than @httpx/lru.get() - compiled (dist)
    2.87x faster than @httpx/time-lru.get() - compiled (dist)
    3.00x faster than @httpx/time-lru.get() - ts files (dev)
    5.85x faster than quick-lru@7.3.0.get()

  @httpx/lru - forEach - compiled (dist) - bench/compare/lru-cache/iterate.bench.ts > LruCache iterator - 1000 items
    1.02x faster than @httpx/lru - forEach - ts files (dev)
    2.03x faster than lru-cache@11.2.2 - forEach
    2.71x faster than quick-lru@7.3.0 - forEach

  @httpx/lru.peek() - ts files (dev) - bench/compare/lru-cache/peek.bench.ts > LruCache.peek() - 1000 items / maxSize: 1000
    1.06x faster than @httpx/lru.peek() - compiled (dist)
    2.07x faster than lru-cache@11.2.2.peek()
    7.56x faster than quick-lru@7.3.0.peek()

  @httpx/lru.set() - ts files (dev) - bench/compare/lru-cache/set.bench.ts > LruCache.set() 1000 items / maxSize: 1000
    1.03x faster than @httpx/lru.set() - compiled (dist)
    1.40x faster than quick-lru@7.3.0.set()
    2.11x faster than lru-cache@11.2.2.set()
    2.35x faster than @httpx/time-lru.set() - compiled (dist)
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
| Bun          | ✅  | Tested with latest (at time of writing >= 1.3.3)                                                                                                                                                                                                                                                                                                                                              |
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

