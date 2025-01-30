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

- 📐&nbsp; Lightweight (starts at [~620B](#bundle-size)) 
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
 RUN  v3.0.4 /home/sebastien/github/httpx/packages/lru


 ✓ bench/lru-cache/lru-cache-get.bench.ts > LRUCache.get comparison 2464ms
     name                                hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru                   37,264.34  0.0248  0.4753  0.0268  0.0261  0.0431  0.0657  0.0691  ±0.30%    18633
   · @httpx/lru.get() - compiled  36,992.39  0.0250  0.0870  0.0270  0.0264  0.0529  0.0533  0.0578  ±0.25%    18497
   · quick-lru@7.0.0.get()        12,111.96  0.0772  0.3672  0.0826  0.0823  0.0980  0.1904  0.2396  ±0.34%     6056   slowest
   · lru-cache@11.0.2.get()       47,699.16  0.0185  0.0784  0.0210  0.0206  0.0372  0.0378  0.0597  ±0.23%    23850   fastest

 ✓ bench/lru-cache/lru-cache-set.bench.ts > LRUCache.set comparison 2433ms
     name                                hz     min     max    mean     p75     p99    p995    p999      rme  samples
   · @httpx/lru.set()              4,365.61  0.1218  8.4117  0.2291  0.1538  1.7588  7.6830  8.1496  ±12.66%     2183   slowest
   · @httpx/lru.set() - compiled   7,859.02  0.0934  1.3761  0.1272  0.1215  0.3422  0.6207  1.3161   ±1.91%     3930
   · quick-lru@7.0.0.set()        16,306.63  0.0515  1.6058  0.0613  0.0571  0.1982  0.2514  0.3188   ±1.07%     8154   fastest
   · lru-cache@11.0.2.set()        7,639.91  0.1060  1.4439  0.1309  0.1315  0.2578  0.2918  1.3275   ±1.24%     3820

 BENCH  Summary

  lru-cache@11.0.2.get() - bench/lru-cache/lru-cache-get.bench.ts > LRUCache.get comparison
    1.28x faster than @httpx/lru
    1.29x faster than @httpx/lru.get() - compiled
    3.94x faster than quick-lru@7.0.0.get()

  quick-lru@7.0.0.set() - bench/lru-cache/lru-cache-set.bench.ts > LRUCache.set comparison
    2.07x faster than @httpx/lru.set() - compiled
    2.13x faster than lru-cache@11.0.2.set()
    3.74x faster than @httpx/lru.set()
 
```

> See [benchmark file](https://github.com/belgattitude/httpx/blob/main/packages/lru/bench) for details.

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/lru/.size-limit.ts)

| Scenario (esm)                                     | Size (compressed) |
|----------------------------------------------------|------------------:|
| `import { LRUCache  } from '@httpx/lru`            |            ~ 620B |

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
