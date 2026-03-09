# @httpx/md5

[![npm](https://img.shields.io/npm/v/@httpx/md5?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/md5)
[![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/md5/CHANGELOG.md)
[![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-md5-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fmd5)
[![bundles](https://img.shields.io/static/v1?label=&message=cjs|esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/md5/.size-limit.cjs)
[![node](https://img.shields.io/static/v1?label=Node&message=20%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![browserslist](https://img.shields.io/static/v1?label=Browsers&message=%3E96%25&logo=googlechrome&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![downloads](https://img.shields.io/npm/dm/@httpx/md5?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/md5)
[![license](https://img.shields.io/npm/l/@httpx/md5?style=for-the-badge&labelColor=444)](https://github.com/belgattitude/httpx/blob/main/LICENSE)

1.2Kb [MD5](https://en.wikipedia.org/wiki/MD5) synchronous hash function very fast on small strings (<4Kb).
Automatically uses the native crypto module on node, bun and edge runtimes for the best performance.

## Install

```bash
npm install @httpx/md5
yarn add @httpx/md5
pnpm add @httpx/md5
```

## Features

- 🚀&nbsp; [Fast](#benchmarks) hash for small strings (2x-10x faster than [md5](https://www.npmjs.com/package/md5)).
- 🖖&nbsp; Produce RFC1321 / NodeJs compatible md5 hashes.
- ✨&nbsp; Use native crypto module on nodejs, edge and bun.
- 📐&nbsp; Lightweight for browsers usage ([~1.2Kb](#bundle-size))
- 🛡️&nbsp; Tested on [node 20-25, bun, browser, cloudflare workers and runtime/edge](#compatibility).

## Documentation

```ts
import { md5 } from "@httpx/md5";

const hash = md5("Hello: 🌍🚀✨🦄");
```

## Comparison with other libraries

[spark-md5](https://www.npmjs.com/package/spark-md5) implementation, but relies on some deprecated APIs
(such as [unescape](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/unescape)).

Their performance is equivalent, that said on node, bun and edge runtimes, the native crypto will transparently be used thanks
to a more modern packaging, which generally gives a speed boost.

[npm:md5](https://www.npmjs.com/package/md5) is the most popular library (still 2x-10x slower than this one) and also much bigger.

[hash-wasm](https://www.npmjs.com/package/hash-wasm) is asynchronous and uses WebAssembly which defeats a bit the performance for
small strings. Working with edge, cloudflare workers, bun and runtime/edge is not always easy to set up.

## Benchmarks

### NodeJs

```plain

Benchmarking is an experimental feature.
Breaking changes might not follow SemVer, please pin Vitest's version when using it.

 RUN  v4.0.18 /home/sebastien/github/httpx/packages/md5


 ✓ bench/compare-md5-unicode.bench.ts > @httpx/md5 compared 6536ms
     name                                             hz      min      max     mean      p75      p99     p995     p999      rme  samples
   · httpx/md5     - 690 chars x 10000 - nodejs  13.9609  61.0814   108.85  71.6287  72.4407   108.85   108.85   108.85  ±21.77%        7
   · httpx/md5     - 690 chars x 10000 - purejs   3.4657   286.75   290.33   288.54   290.33   290.33   290.33   290.33   ±7.90%        2
   · npm:md5       - 690 chars x 10000            1.8376   544.20   544.20   544.20   544.20   544.20   544.20   544.20   ±0.00%        1
   · npm:spark-md5 - 690 chars x 10000            4.6467   194.97   228.99   215.21   228.99   228.99   228.99   228.99  ±20.67%        3
   · npm:hash-wasm - 690 chars x 10000           13.9578  59.0143  95.9703  71.6447  89.4958  95.9703  95.9703  95.9703  ±19.26%        7

 ✓ bench/compare-md5-ascii.bench.ts > @httpx/md5 compared 5264ms
     name                                                   hz      min      max     mean      p75      p99     p995     p999      rme  samples
   · httpx/md5     - 690 ascii chars x 10000 - nodejs  22.7386  32.0795  93.1540  43.9781  43.5266  93.1540  93.1540  93.1540  ±21.07%       13
   · httpx/md5     - 690 ascii chars x 10000 - purejs  11.4324  68.9253   119.06  87.4708   105.11   119.06   119.06   119.06  ±24.10%        6
   · npm:md5       - 690 ascii chars x 10000            2.4663   384.96   425.99   405.47   425.99   425.99   425.99   425.99  ±64.31%        2
   · npm:spark-md5 - 690 ascii chars x 10000           13.2383  70.0139  81.0351  75.5386  78.3253  81.0351  81.0351  81.0351   ±4.71%        7
   · npm:hash-wasm - 690 ascii chars x 10000           24.2918  36.8053  47.8226  41.1661  41.3947  47.8226  47.8226  47.8226   ±5.53%       13

 BENCH  Summary

  npm:hash-wasm - 690 ascii chars x 10000 - bench/compare-md5-ascii.bench.ts > @httpx/md5 compared
    1.07x faster than httpx/md5     - 690 ascii chars x 10000 - nodejs
    1.83x faster than npm:spark-md5 - 690 ascii chars x 10000
    2.12x faster than httpx/md5     - 690 ascii chars x 10000 - purejs
    9.85x faster than npm:md5       - 690 ascii chars x 10000

  httpx/md5     - 690 chars x 10000 - nodejs - bench/compare-md5-unicode.bench.ts > @httpx/md5 compared
    1.00x faster than npm:hash-wasm - 690 chars x 10000
    3.00x faster than npm:spark-md5 - 690 chars x 10000
    4.03x faster than httpx/md5     - 690 chars x 10000 - purejs
    7.60x faster than npm:md5       - 690 chars x 10000

```

### Bun

```
 RUN  v4.0.18 /home/sebastien/github/httpx/packages/md5


 ✓ bench/compare-md5-unicode.bench.ts > @httpx/md5 compared 7523ms
     name                                             hz      min      max     mean      p75      p99     p995     p999      rme  samples
   · httpx/md5     - 690 chars x 10000 - bun     22.6683  32.8214  72.7840  44.1144  47.0905  72.7840  72.7840  72.7840  ±18.98%       12
   · httpx/md5     - 690 chars x 10000 - purejs   1.2949   772.27   772.27   772.27   772.27   772.27   772.27   772.27   ±0.00%        1
   · npm:md5       - 690 chars x 10000            3.2587   305.90   307.84   306.87   307.84   307.84   307.84   307.84   ±4.02%        2
   · npm:spark-md5 - 690 chars x 10000            3.2897   300.34   307.61   303.97   307.61   307.61   307.61   307.61  ±15.20%        2
   ↓ npm:hash-wasm - 690 chars x 10000 [skipped]

 ✓ bench/compare-md5-ascii.bench.ts > @httpx/md5 compared 4513ms
     name                                                   hz      min      max     mean      p75      p99     p995     p999      rme  samples
   · httpx/md5     - 690 ascii chars x 10000 - bun     34.9181  23.5001  46.0412  28.6385  31.0043  46.0412  46.0412  46.0412  ±10.91%       18
   · httpx/md5     - 690 ascii chars x 10000 - purejs  12.1064  74.5882  92.9629  82.6011  84.5637  92.9629  92.9629  92.9629   ±6.28%        7
   · npm:md5       - 690 ascii chars x 10000            4.4479   220.70   233.06   224.83   233.06   233.06   233.06   233.06   ±7.88%        3
   · npm:spark-md5 - 690 ascii chars x 10000            6.5922   145.00   155.93   151.69   154.83   155.93   155.93   155.93   ±5.17%        4
   ↓ npm:hash-wasm - 690 ascii chars x 10000 [skipped]

 BENCH  Summary

  httpx/md5     - 690 ascii chars x 10000 - bun - bench/compare-md5-ascii.bench.ts > @httpx/md5 compared
    2.88x faster than httpx/md5     - 690 ascii chars x 10000 - purejs
    5.30x faster than npm:spark-md5 - 690 ascii chars x 10000
    7.85x faster than npm:md5       - 690 ascii chars x 10000

  httpx/md5     - 690 chars x 10000 - bun - bench/compare-md5-unicode.bench.ts > @httpx/md5 compared
    6.89x faster than npm:spark-md5 - 690 chars x 10000
    6.96x faster than npm:md5       - 690 chars x 10000
    17.51x faster than httpx/md5     - 690 chars x 10000 - purejs

```

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/md5/.size-limit.ts)

| Scenario (esm)                    | Size (brotli) |
| --------------------------------- | ------------: |
| `import { md5 } from '@httpx/md5` |       ~ 1200B |

## Compatibility

| Level        | CI  | Description                                                                                                                                      |
| ------------ | --- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Node         | ✅  | CI for 20.x, 22.x, 24.x & 25.x.                                                                                                                  |
| Browser      | ✅  | Tested with latest chrome (vitest/playwright)                                                                                                    |
| Browserslist | ✅  | [defaults, > 0.26%, last 2 versions, Firefox ESR, not dead](https://github.com/belgattitude/httpx/blob/main/packages/md5/.browserslistrc)        |
| Bun          | ✅  | Tested with latest (at time of writing >= 1.3.3)                                                                                                 |
| Edge         | ✅  | Ensured on CI with [@vercel/edge-runtime](https://github.com/vercel/edge-runtime).                                                               |
| Cloudflare   | ✅  | Ensured with @cloudflare/vitest-pool-workers (see [wrangler.toml](https://github.com/belgattitude/httpx/blob/main/devtools/vitest/wrangler.toml) |
| Typescript   | ✅  | TS 5.0 + / [are-the-type-wrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io) checks on CI.                                    |
| ES2022       | ✅  | Dist files checked with [es-check](https://github.com/yowainwright/es-check)                                                                     |
| Performance  | ✅  | Monitored with [codspeed.io](https://codspeed.io/belgattitude/httpx)                                                                             |

## Contributors

Contributions are welcome. Have a look to the [CONTRIBUTING](https://github.com/belgattitude/httpx/blob/main/CONTRIBUTING.md) document.

## Sponsors

[Sponsorship](https://github.com/sponsors/belgattitude) or a [coffee](https://ko-fi.com/belgattitude) highly appreciated.

### Special thanks to

<table>
  <tr>
    <td>
      <a href="https://www.jetbrains.com/?ref=belgattitude" target="_blank">
         <img width="65" src="https://asset.brandfetch.io/idarKiKkI-/id53SttZhi.jpeg" alt="Jetbrains logo" />
      </a>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://www.jetbrains.com/?ref=belgattitude" target="_blank">JetBrains</a>
    </td>
   </tr>
</table>

## License

MIT © [Sébastien Vanvelthem](https://github.com/belgattitude) and contributors.
