# @httpx/md5

[![npm](https://img.shields.io/npm/v/@httpx/md5?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/md5)
[![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/md5/CHANGELOG.md)
[![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-md5-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fmd5)
[![bundles](https://img.shields.io/static/v1?label=&message=esm&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/md5/.size-limit.ts)
[![node](https://img.shields.io/static/v1?label=Node&message=20%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![browserslist](https://img.shields.io/static/v1?label=Browsers&message=%3E96%25&logo=googlechrome&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![downloads](https://img.shields.io/npm/dm/@httpx/md5?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/md5)
[![license](https://img.shields.io/npm/l/@httpx/md5?style=for-the-badge&labelColor=444)](https://github.com/belgattitude/httpx/blob/main/LICENSE)

One of the fastest md5 hash function optimized for small strings (<8Kb). Less than 1.2Kb in browser usage.

Automatically uses the native crypto module on node, bun for the best performance.

## Install

```bash
npm install @httpx/md5
yarn add @httpx/md5
pnpm add @httpx/md5
```

## Features

- 🖖&nbsp; RFC1321 / NodeJs compatible md5 hashes with unicode support.
- 🚀&nbsp; [Fast](#benchmarks) hash for small strings (2x-5x faster than [md5](https://www.npmjs.com/package/md5)).
- ✨&nbsp; Use native crypto module on nodejs and bun (ultra fast).
- 📐&nbsp; Lightweight for browsers usage ([~1.2Kb](#bundle-size))
- 🛡️&nbsp; Tested on [node 20-25, bun, browser, cloudflare workers and runtime/edge](#compatibility).

## Documentation

```ts
import { md5 } from "@httpx/md5";

const hash = md5("Hello: 🌍🚀✨🦄");

// Hexadecimal RFC1321 / NodeJs string
// '8f11a08695d43b4f737a9706dffbf208'
```

## Considerations

MD5 is a non-cryptographic hash function that produces a 128-bit (16-byte) value. More modern hash function
exists nowadays and should be preferred (xxhash, rapidhash...). However, I (the author) had a requirement
to use it in many runtimes (edge, cloudflare, node and the browser) to compute hashes for millions of relatively
small strings. This library is aimed at this use case. Please check alternatives if it doesn't fit your scenario.

## Comparison with other libraries

[spark-md5](https://www.npmjs.com/package/spark-md5) implementation, but relies on some deprecated APIs
(such as [unescape](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/unescape)).

Their performance is equivalent, that said on node, bun and edge runtimes, the native crypto will transparently be used thanks
to a more modern packaging, which generally gives a speed boost.

[npm:md5](https://www.npmjs.com/package/md5) is the most popular library (still 2x-5x slower than this one) and also much bigger.

[hash-wasm](https://www.npmjs.com/package/hash-wasm) is asynchronous and uses WebAssembly which defeats a bit the performance for
small strings. Working with edge, cloudflare workers, bun and runtime/edge is not always easy to set up.

## Benchmarks

### NodeJs

```plain
 RUN  v4.1.0 /home/sebastien/github/httpx/packages/md5


 ✓ bench/compare-md5-unicode.bench.ts > @httpx/md5 compared 5565ms
     name                                             hz      min      max     mean      p75      p99     p995     p999      rme  samples
   · httpx/md5     - 690 chars x 10000 - nodejs  22.4828  34.6378  95.1849  44.4784  43.4613  95.1849  95.1849  95.1849  ±23.43%       12
   · httpx/md5     - 690 chars x 10000 - purejs   5.5168   177.57   187.32   181.26   187.32   187.32   187.32   187.32   ±7.25%        3
   · npm:md5       - 690 chars x 10000            2.5922   383.28   388.26   385.77   388.26   388.26   388.26   388.26   ±8.21%        2
   · npm:spark-md5 - 690 chars x 10000            5.9537   160.26   183.05   167.96   183.05   183.05   183.05   183.05  ±19.33%        3
   · npm:hash-wasm - 690 chars x 10000           17.6759  43.8407  65.1716  56.5742  64.7280  65.1716  65.1716  65.1716  ±11.30%        9

 ✓ bench/compare-md5-ascii.bench.ts > @httpx/md5 compared 4707ms
     name                                                   hz      min      max     mean      p75      p99     p995     p999      rme  samples
   · httpx/md5     - 690 ascii chars x 10000 - nodejs  31.0056  26.0263  65.0080  32.2522  30.7694  65.0080  65.0080  65.0080  ±16.31%       16
   · httpx/md5     - 690 ascii chars x 10000 - purejs  18.5922  48.1123  62.7473  53.7860  54.7879  62.7473  62.7473  62.7473   ±5.24%       10
   · npm:md5       - 690 ascii chars x 10000            3.1793   290.29   338.79   314.54   338.79   338.79   338.79   338.79  ±98.00%        2
   · npm:spark-md5 - 690 ascii chars x 10000           19.5659  48.0715  56.4499  51.1093  52.1478  56.4499  56.4499  56.4499   ±3.52%       10
   · npm:hash-wasm - 690 ascii chars x 10000           31.6650  24.9574  53.9808  31.5806  31.3955  53.9808  53.9808  53.9808  ±13.96%       16

 BENCH  Summary

  npm:hash-wasm - 690 ascii chars x 10000 - bench/compare-md5-ascii.bench.ts > @httpx/md5 compared
    1.02x faster than httpx/md5     - 690 ascii chars x 10000 - nodejs
    1.62x faster than npm:spark-md5 - 690 ascii chars x 10000
    1.70x faster than httpx/md5     - 690 ascii chars x 10000 - purejs
    9.96x faster than npm:md5       - 690 ascii chars x 10000

  httpx/md5     - 690 chars x 10000 - nodejs - bench/compare-md5-unicode.bench.ts > @httpx/md5 compared
    1.27x faster than npm:hash-wasm - 690 chars x 10000
    3.78x faster than npm:spark-md5 - 690 chars x 10000
    4.08x faster than httpx/md5     - 690 chars x 10000 - purejs
    8.67x faster than npm:md5       - 690 chars x 10000
```

### Bun 1.3

```
 RUN  v4.1.0 /home/sebastien/github/httpx/packages/md5


 ✓ bench/compare-md5-unicode.bench.ts > @httpx/md5 compared 7190ms
     name                                             hz      min      max     mean      p75      p99     p995     p999      rme  samples
   · httpx/md5     - 690 chars x 10000 - bun     22.1384  28.4061  62.9272  45.1703  54.6057  62.9272  62.9272  62.9272  ±17.33%       12
   · httpx/md5     - 690 chars x 10000 - purejs   1.7491   571.72   571.72   571.72   571.72   571.72   571.72   571.72   ±0.00%        1
   · npm:md5       - 690 chars x 10000            4.3928   224.16   233.36   227.65   233.36   233.36   233.36   233.36   ±5.45%        3
   · npm:spark-md5 - 690 chars x 10000            4.4499   221.48   229.28   224.72   229.28   229.28   229.28   229.28   ±4.49%        3
   · npm:hash-wasm - 690 chars x 10000           17.0338  41.8800  80.6285  58.7067  63.7949  80.6285  80.6285  80.6285  ±15.09%        9

 ✓ bench/compare-md5-ascii.bench.ts > @httpx/md5 compared 4471ms
     name                                                   hz      min      max     mean      p75      p99     p995     p999      rme  samples
   · httpx/md5     - 690 ascii chars x 10000 - bun     37.3857  17.5595  51.9487  26.7482  31.5268  51.9487  51.9487  51.9487  ±15.21%       19
   · httpx/md5     - 690 ascii chars x 10000 - purejs  18.2047  49.5577  82.1726  54.9309  56.6660  82.1726  82.1726  82.1726  ±12.97%       10
   · npm:md5       - 690 ascii chars x 10000            5.9788   159.30   173.62   167.26   173.62   173.62   173.62   173.62  ±10.84%        3
   · npm:spark-md5 - 690 ascii chars x 10000            8.4966   106.52   133.45   117.69   131.95   133.45   133.45   133.45  ±14.54%        5
   · npm:hash-wasm - 690 ascii chars x 10000           21.3079  33.0858  60.3269  46.9310  51.7589  60.3269  60.3269  60.3269  ±11.62%       11

 BENCH  Summary

  httpx/md5     - 690 ascii chars x 10000 - bun - bench/compare-md5-ascii.bench.ts > @httpx/md5 compared
    1.75x faster than npm:hash-wasm - 690 ascii chars x 10000
    2.05x faster than httpx/md5     - 690 ascii chars x 10000 - purejs
    4.40x faster than npm:spark-md5 - 690 ascii chars x 10000
    6.25x faster than npm:md5       - 690 ascii chars x 10000

  httpx/md5     - 690 chars x 10000 - bun - bench/compare-md5-unicode.bench.ts > @httpx/md5 compared
    1.30x faster than npm:hash-wasm - 690 chars x 10000
    4.97x faster than npm:spark-md5 - 690 chars x 10000
    5.04x faster than npm:md5       - 690 chars x 10000
    12.66x faster than httpx/md5     - 690 chars x 10000 - purejs
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

## Credits

- The [spark-md5](https://github.com/satazor/js-spark-md5) on which most functions have been ported from.
- Joseph Myers for the [underlying approach](http://www.myersdaily.org/joseph/javascript/md5-text.html).

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
