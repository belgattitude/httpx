# @httpx/lru

[![npm](https://img.shields.io/npm/v/@httpx/lru?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/lru)
[![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/lru/CHANGELOG.md)
[![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-lru-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Flru)
[![bundles](https://img.shields.io/static/v1?label=&message=cjs|esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/lru/.size-limit.cjs)
[![node](https://img.shields.io/static/v1?label=Node&message=18%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![browserslist](https://img.shields.io/static/v1?label=Browser&message=%3E96%25&logo=googlechrome&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![size](https://img.shields.io/bundlephobia/minzip/@httpx/lru@latest?label=Max&style=for-the-badge&labelColor=444&color=informational)](https://bundlephobia.com/package/@httpx/lru@latest)
[![downloads](https://img.shields.io/npm/dm/@httpx/lru?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/lru)
[![license](https://img.shields.io/npm/l/@httpx/lru?style=for-the-badge&labelColor=444)](https://github.com/belgattitude/httpx/blob/main/LICENSE)

## Install

```bash
$ npm install @httpx/lru
$ yarn add @httpx/lru
$ pnpm add @httpx/lru
```

## Features

- 🚀&nbsp; Fast `cache.get()` in O(1) thx to [doubly linked list](https://en.wikipedia.org/wiki/Doubly_linked_list).
- 📐&nbsp; Lightweight ([~535B](#bundle-size)) 
- 🛡️&nbsp; Tested on [node 18-22, browser, cloudflare workers and runtime/edge](#compatibility).
- 🗝️&nbsp; Available in ESM and CJS formats.

## Documentation

```typescript
// bundle size: ~500B
import { LRUCache } from '@httpx/lru';

const lru = new LRUCache({ maxSize: 1000 });

lru.set('🦄', ['cool', 'stuff']);

if (lru.has('🦄')) {;
 console.log(lru.get('🦄'));
 // ['cool', 'stuff']
}

lru.delete('🦄');
lru.clear();
```

## Usage

### Iterable

```typescript
import { LRUCache } from '@httpx/lru';

const lru = new LRUCache({ maxSize: 2 });

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

const lru = new LRUCache({
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


 ✓ bench/compare/lru-cache/iterate.bench.ts > LRUCache iterator - 1000 items 2442ms
     name                                           hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru - forEach - ts files (dev)   34,902.06  0.0221  0.9028  0.0287  0.0279  0.0794  0.0927  0.2815  ±0.88%    17452   fastest
   · @httpx/lru - forEach - compiled (dist)  33,415.30  0.0227  1.3977  0.0299  0.0298  0.0937  0.1131  0.1902  ±0.84%    16709
   · quick-lru@7.0.0 - forEach               24,043.90  0.0310  0.6072  0.0416  0.0406  0.1177  0.1458  0.3901  ±0.93%    12022
   · lru-cache@11.0.2 - forEach              18,692.02  0.0389  0.9620  0.0535  0.0527  0.1578  0.1944  0.2975  ±0.96%     9358   slowest

 ✓ bench/compare/lru-cache/set.bench.ts > LRUCache.set() 1000 items / maxSize: 500 2438ms
     name                                       hz     min      max    mean     p75     p99    p995     p999      rme  samples
   · @httpx/lru.set() - ts files (dev)    6,505.49  0.0580  17.2624  0.1537  0.0988  0.6561  3.5929  10.5129  ±15.27%     3253   slowest
   · @httpx/lru.set() - compiled (dist)   9,382.90  0.0516   1.9482  0.1066  0.1080  0.3110  0.5594   1.2600   ±2.23%     4692
   · quick-lru@7.0.0.set()               30,127.38  0.0251   0.6143  0.0332  0.0330  0.0867  0.1924   0.3293   ±1.04%    15064   fastest
   · lru-cache@11.0.2.set()              11,515.22  0.0574   1.8515  0.0868  0.0869  0.2429  0.3960   1.2257   ±1.84%     5759

 ✓ bench/compare/lru-cache/peek.bench.ts > LRUCache.peek() - 1000 items / maxSize: 500 2533ms
     name                                         hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.peek() - ts files (dev)   113,618.01  0.0064  0.4988  0.0088  0.0089  0.0184  0.0261  0.0593  ±0.41%    56810
   · @httpx/lru.peek() - compiled (dist)  125,609.48  0.0065  0.3238  0.0080  0.0082  0.0116  0.0188  0.0512  ±0.33%    62805   fastest
   · quick-lru@7.0.0.peek()                50,329.00  0.0151  0.7934  0.0199  0.0201  0.0392  0.0474  0.1252  ±0.62%    25165   slowest
   · lru-cache@11.0.2.peek()              108,351.01  0.0070  1.9459  0.0092  0.0090  0.0196  0.0203  0.0356  ±0.90%    54176

 ✓ bench/compare/lru-cache/get.bench.ts > LRUCache.get() - 1000 items / maxSize: 500 2464ms
     name                                       hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru.get() - ts files (dev)   47,992.86  0.0115  7.2249  0.0208  0.0229  0.0423  0.0519  0.1573  ±3.22%    23997
   · @httpx/lru.get() - compiled (dist)  44,748.92  0.0129  1.2364  0.0223  0.0260  0.0455  0.0497  0.1212  ±0.80%    22375
   · quick-lru@7.0.0.get()               16,261.07  0.0349  0.9033  0.0615  0.0820  0.1471  0.2089  0.4077  ±1.29%     8131   slowest
   · lru-cache@11.0.2.get()              82,501.07  0.0079  0.7662  0.0121  0.0131  0.0275  0.0294  0.0715  ±0.68%    41251   fastest
                                                                                                                                                                                                                                    
 BENCH  Summary                                                                                                                                                                                                                     
                                                                                                                                                                                                                                    
  lru-cache@11.0.2.get() - bench/compare/lru-cache/get.bench.ts > LRUCache.get() - 1000 items / maxSize: 500                                                                                                                        
    1.72x faster than @httpx/lru.get() - ts files (dev)                                                                                                                                                                             
    1.84x faster than @httpx/lru.get() - compiled (dist)                                                                                                                                                                            
    5.07x faster than quick-lru@7.0.0.get()                                                                                                                                                                                         

  @httpx/lru - forEach - ts files (dev) - bench/compare/lru-cache/iterate.bench.ts > LRUCache iterator - 1000 items
    1.04x faster than @httpx/lru - forEach - compiled (dist)
    1.45x faster than quick-lru@7.0.0 - forEach
    1.87x faster than lru-cache@11.0.2 - forEach

  @httpx/lru.peek() - compiled (dist) - bench/compare/lru-cache/peek.bench.ts > LRUCache.peek() - 1000 items / maxSize: 500
    1.11x faster than @httpx/lru.peek() - ts files (dev)
    1.16x faster than lru-cache@11.0.2.peek()
    2.50x faster than quick-lru@7.0.0.peek()

  quick-lru@7.0.0.set() - bench/compare/lru-cache/set.bench.ts > LRUCache.set() 1000 items / maxSize: 500
    2.62x faster than lru-cache@11.0.2.set()
    3.21x faster than @httpx/lru.set() - compiled (dist)
    4.63x faster than @httpx/lru.set() - ts files (dev)

```

> See [benchmark file](https://github.com/belgattitude/httpx/blob/main/packages/lru/bench) for details.

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/lru/.size-limit.ts)

| Scenario (esm)                                     | Size (compressed) |
|----------------------------------------------------|------------------:|
| `import { LRUCache  } from '@httpx/lru`            |            ~ 538B |

> For CJS usage (not recommended) track the size on [bundlephobia](https://bundlephobia.com/package/@httpx/lru@latest).

## Compatibility

| Level      | CI | Description                                                                                                                                                                                                                                                                                                                                                                              |
|------------|----|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|  
| Node       | ✅  | CI for 18.x, 20.x & 22.x.                                                                                                                                                                                                                                                                                                                                                                |
| Browser      | ✅  | Tested with latest chrome (vitest/playwright)                                                                                                                                                                                                                                                                                                                                            |
| Browserslist | ✅  | [> 95%](https://browserslist.dev/?q=ZGVmYXVsdHMsIGNocm9tZSA%2BPSA5NiwgZmlyZWZveCA%2BPSAxMDUsIGVkZ2UgPj0gMTEzLCBzYWZhcmkgPj0gMTUsIGlvcyA%2BPSAxNSwgb3BlcmEgPj0gMTAzLCBub3QgZGVhZA%3D%3D) on 01/2025. [defaults, chrome >= 96, firefox >= 105, edge >= 113, safari >= 15, ios >= 15, opera >= 103, not dead](https://github.com/belgattitude/httpx/blob/main/packages/lru/.browserslistrc) |
| Edge         | ✅  | Ensured on CI with [@vercel/edge-runtime](https://github.com/vercel/edge-runtime).                                                                                                                                                                                                                                                                                                       | 
| Cloudflare   | ✅  | Ensured with @cloudflare/vitest-pool-workers (see [wrangler.toml](https://github.com/belgattitude/httpx/blob/main/devtools/vitest/wrangler.toml)                                                                                                                                                                                                                                         |
| Typescript | ✅  | TS 5.0 + / [are-the-type-wrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io) checks on CI.                                                                                                                                                                                                                                                                            |
| ES2022     | ✅  | Dist files checked with [es-check](https://github.com/yowainwright/es-check)                                                                                                                                                                                                                                                                                                             |
| Performance| ✅  | Monitored with [codspeed.io](https://codspeed.io/belgattitude/httpx)                                                                                                                                                                                                                                                                                                                     |

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
