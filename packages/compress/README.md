# @httpx/compress

Lightweight compression helpers based on widely available [Compression Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Compression_Streams_API). Works in node, bun, edge, cloudflare and browsers. Provides support for string encoding (base64 and base64-urlsafe).

[![npm](https://img.shields.io/npm/v/@httpx/compress?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/compress) [![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/compress/CHANGELOG.md) [![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-compress-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fcompress) [![bundles](https://img.shields.io/static/v1?label=&message=esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/compress/.size-limit.ts) [![node](https://img.shields.io/static/v1?label=Node&message=20%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](#compatibility) [![browserslist](https://img.shields.io/static/v1?label=Browser&message=%3E96%25&logo=googlechrome&style=for-the-badge&labelColor=444&color=informational)](#compatibility) [![size](https://img.shields.io/bundlephobia/minzip/@httpx/compress@latest?label=Max&style=for-the-badge&labelColor=444&color=informational)](https://bundlephobia.com/package/@httpx/compress@latest) [![downloads](https://img.shields.io/npm/dm/@httpx/compress?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/compress) [![license](https://img.shields.io/npm/l/@httpx/compress?style=for-the-badge&labelColor=444)](https://github.com/belgattitude/httpx/blob/main/LICENSE)

## Install

```bash
$ npm install @httpx/compress
$ yarn add @httpx/compress
$ pnpm add @httpx/compress
```

## Features

- 👉&nbsp; Compress and decompress strings or Uint8Array.
- 🦄&nbsp; Support base64 encoding for strings (and base64-urlsafe).
- 📐&nbsp; Lightweight (starts at [~570B](#bundle-size))
- 🛡️&nbsp; Tested on [node 20-25, browser, bun, cloudflare workers and runtime/edge](#compatibility).
- 🙏&nbsp; Works cross-realms (workers, browser, bun, edge, node, cloudflare...)
- 🗝️&nbsp; Available in ESM.

## Documentation

👉 [Official website](https://belgattitude.github.io/httpx/compress) or [GitHub Readme](https://github.com/belgattitude/httpx/tree/main/packages/compress#readme)

## Quickstart

```typescript
import { Compressor, Decompressor } from "@httpx/compress";

const compressor = new Compressor("gzip");
const gzippedStr = await compressor.toEncodedString("Hello, World! 🦆", {
  encoding: "base64", // optional, 'base64' by default
});

const decompressor = new Decompressor("gzip");
const originalStr = await decompressor.fromEncodedString(gzippedStr);
```

## Api

### Compressor

| Method | Description |
| --- | --- |
| `toUint8Array()` | Compress a string or a Uint8Array to a binary [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array). |
| `toEncodedString()` | Compress a string or a Uint8Array to a encoded string. |

### Decompressor

| Method | Description |
| --- | --- |
| `fromUint8Array()` | Decompresses a compressed Uint8Array to its original binary form. |
| `fromEncodedString()` | Compress a string or a Uint8Array to a encoded string. |

## Usage

### Compressor

#### toUint8Array

```typescript
import { Compressor } from "@httpx/compress";

const compressor = new Compressor("gzip"); // or 'deflate'
const longString = "Hello, World! 🦆".repeat(500_000);
const compressedUInt8 = await compressor.toUint8Array(longString);
```

#### toEncodedString

```typescript
import { Compressor } from "@httpx/compress";

const compressor = new Compressor("gzip"); // or 'deflate'
const longString = "Hello, World! 🦆".repeat(500_000);
const compressedString = await compressor.toEncodedString(longString, {
  // Optional.
  // Supported values: 'base64' (default), 'base64_urlsafe'
  encoding: "base64",
});
```

### Decompressor

#### fromUint8Array

```typescript
import { Decompressor } from "@httpx/compress";

const decompressor = new Decompressor("gzip"); // or 'deflate'
const decompressedUInt8 = await decompressor.fromUint8Array(compressedUInt8);
```

#### fromEncodedString

```typescript
import { Decompressor } from "@httpx/compress";

const decompressor = new Decompressor("gzip"); // or 'deflate'
const decompressedString =
  await decompressor.fromEncodedString(compressedString);
```

## Benchmarks

> Performance is continuously monitored thanks to [codspeed.io](https://codspeed.io/belgattitude/httpx).
>
> [![CodSpeed Badge](https://img.shields.io/endpoint?url=https://codspeed.io/badge.json)](https://codspeed.io/belgattitude/httpx)

### Node 24.21.0

```
 RUN  v5.0.5 /home/user/github/httpx/packages/compress

 ✓ |bench| bench/compress-string.bench.ts > Compressor > Compressor.toEncodedString 9225ms
   name                                                                                                 hz      min      max     mean      p75      p99     p995     p999     rme  samples
   Compressor('deflate').toEncodedString/base64 (original: 3.31 MB / compressed: 1.07 MB)          12.7453  77.6035  82.1225  78.4761  78.5545  81.7325  81.9275  82.0835  ±0.91%       13   fastest
   Compressor('gzip').toEncodedString/base64 (original: 3.31 MB / compressed: 1.07 MB)             12.7067  78.2275  79.2755  78.6997  78.8480  79.2638  79.2696  79.2743  ±0.23%       13
   Compressor('gzip').toEncodedString/base64_urlsafe (original: 3.31 MB / compressed: 1.07 MB)     12.3829  79.7760  84.1340  80.7747  80.6680  83.9903  84.0621  84.1196  ±0.96%       13
   Compressor('deflate').toEncodedString/base64_urlsafe (original: 3.31 MB / compressed: 1.07 MB)  11.7483  79.7090   115.83  86.1456  85.5781   113.64   114.73   115.61  ±8.01%       12   slowest
 ✓ |bench| bench/decompress-string.bench.ts > Decompressor > Decompressor.fromEncodedString 5045ms
   name                                                                                                     hz      min      max     mean      p75      p99     p995     p999     rme  samples
   Decompressor('deflate').fromEncodedString/base64 (compressed: 1.07 MB / original: 3.31 MB)          89.0010   9.9040  14.7938  11.3323  12.3246  14.5819  14.6879  14.7726  ±2.01%       89   fastest
   Decompressor('gzip').fromEncodedString/base64 (compressed: 1.07 MB / original: 3.31 MB)             84.6527  10.0388  15.4635  11.9274  12.4554  15.2310  15.3472  15.4402  ±2.17%       84
   Decompressor('gzip').fromEncodedString/base64_urlsafe (compressed: 1.07 MB / original: 3.31 MB)     77.6760  11.9233  16.9433  12.9318  13.5896  15.3419  16.1426  16.7832  ±1.58%       78
   Decompressor('deflate').fromEncodedString/base64_urlsafe (compressed: 1.07 MB / original: 3.31 MB)  75.2743  11.9687  16.7283  13.3572  14.0732  16.4362  16.5822  16.6990  ±1.73%       75   slowest
 ✓ |bench| bench/compress-uint8array.bench.ts > Compressor > Compressor.toUint8Array 4621ms
   name                                                                               hz      min      max     mean      p75      p99     p995     p999     rme  samples
   Compressor('deflate').toUint8Array (original: 3.31 MB / compressed: 1.07 MB)  12.5240  78.0126  82.0908  79.8634  80.9149  82.0394  82.0651  82.0857  ±0.92%       13   fastest
   Compressor('gzip').toUint8Array (original: 3.31 MB / compressed: 1.07 MB)     12.3127  77.9430  85.0685  81.2591  82.2691  84.9368  85.0026  85.0553  ±1.44%       13
 ✓ |bench| bench/decompress-uint8array.bench.ts > Decompressor > Decompressor.fromUint8Array 2517ms
   name                                                                                  hz     min      max    mean      p75      p99     p995     p999     rme  samples
   Decompressor('gzip').fromUint8Array (compressed: 1.07 MB / original: 3.31 MB)     111.86  7.2479  13.9325  9.1907  10.3817  13.2496  13.5824  13.8625  ±3.24%      109   fastest
   Decompressor('deflate').fromUint8Array (compressed: 1.07 MB / original: 3.31 MB)  106.67  7.1352  14.3146  9.6228  10.3212  13.3875  13.8425  14.2202  ±3.13%      104
```

### Bun 1.4.3

```
 RUN  v5.0.5 /home/user/github/httpx/packages/compress

 ✓ |bench| bench/compress-string.bench.ts > Compressor > Compressor.toEncodedString 6916ms
   name                                                                                                 hz      min      max     mean      p75      p99     p995     p999     rme  samples
   Compressor('deflate').toEncodedString/base64 (original: 3.31 MB / compressed: 1.09 MB)          23.0670  42.8258  44.8892  43.3579  43.4411  44.8863  44.8877  44.8889  ±0.51%       24   fastest
   Compressor('deflate').toEncodedString/base64_urlsafe (original: 3.31 MB / compressed: 1.09 MB)  22.9634  43.0586  44.9174  43.5523  43.6212  44.8111  44.8643  44.9068  ±0.46%       23
   Compressor('gzip').toEncodedString/base64_urlsafe (original: 3.31 MB / compressed: 1.09 MB)     22.6117  43.3122  47.7166  44.2446  44.2799  47.3951  47.5558  47.6844  ±0.96%       23
   Compressor('gzip').toEncodedString/base64 (original: 3.31 MB / compressed: 1.09 MB)             21.0691  43.8277  66.5849  47.8850  50.8022  63.8492  65.2170  66.3113  ±4.86%       21   slowest
 ✓ |bench| bench/decompress-string.bench.ts > Decompressor > Decompressor.fromEncodedString 5037ms
   name                                                                                                    hz     min      max    mean     p75      p99     p995     p999     rme  samples
   Decompressor('deflate').fromEncodedString/base64 (compressed: 1.09 MB / original: 3.31 MB)          160.56  5.9158   9.7013  6.2538  6.2996   8.5647   8.8361   9.5283  ±1.15%      160   fastest
   Decompressor('gzip').fromEncodedString/base64 (compressed: 1.09 MB / original: 3.31 MB)             150.15  6.2145   9.0339  6.6789  6.8474   8.2441   8.9960   9.0263  ±0.92%      150
   Decompressor('deflate').fromEncodedString/base64_urlsafe (compressed: 1.09 MB / original: 3.31 MB)  130.21  7.1285  10.6706  7.7052  7.8141   9.8755  10.2115  10.5788  ±1.09%      130
   Decompressor('gzip').fromEncodedString/base64_urlsafe (compressed: 1.09 MB / original: 3.31 MB)     128.56  7.3215  10.3359  7.7997  7.9550  10.0484  10.1880  10.3063  ±0.99%      129   slowest
 ✓ |bench| bench/compress-uint8array.bench.ts > Compressor > Compressor.toUint8Array 3424ms
   name                                                                               hz      min      max     mean      p75      p99     p995     p999     rme  samples
   Compressor('deflate').toUint8Array (original: 3.31 MB / compressed: 1.09 MB)  22.7442  43.1852  44.8152  43.9725  44.2885  44.7975  44.8063  44.8134  ±0.48%       23   fastest
   Compressor('gzip').toUint8Array (original: 3.31 MB / compressed: 1.09 MB)     22.7150  43.2287  46.1322  44.0358  44.0897  46.1081  46.1201  46.1298  ±0.74%       23
 ✓ |bench| bench/decompress-uint8array.bench.ts > Decompressor > Decompressor.fromUint8Array 2516ms
   name                                                                                  hz     min     max    mean     p75     p99    p995    p999     rme  samples
   Decompressor('deflate').fromUint8Array (compressed: 1.09 MB / original: 3.31 MB)  256.62  3.6778  5.8420  3.9085  4.0303  4.6724  4.8808  5.6130  ±0.73%      256   fastest
   Decompressor('gzip').fromUint8Array (compressed: 1.09 MB / original: 3.31 MB)     233.80  3.8565  5.9667  4.3075  4.4352  5.5952  5.6334  5.8909  ±1.16%      233
```

> See [benchmark files](https://github.com/belgattitude/httpx/blob/main/packages/compress/bench) for details.

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/compress/.size-limit.ts)

| Scenario (esm)                        | Size (compressed) |
| ------------------------------------- | ----------------: |
| `import { Compressor }`               |          ~ 1.62kB |
| `import { Decompressor }`             |          ~ 1.59kB |
| `import { Decompressor, Compressor }` |          ~ 1.67kB |

## Compatibility

| Level | CI | Description |
| --- | --- | --- |
| Node | ✅ | CI for 20.x, 22.x, 24.x & 26.x. |
| Browser | ✅ | Tested with latest chrome (vitest/playwright) |
| Browserslist | ✅ | [> 95%](https://browserslist.dev/?q=ZGVmYXVsdHMsIGNocm9tZSA%2BPSA5NiwgZmlyZWZveCA%2BPSAxMDUsIGVkZ2UgPj0gMTEzLCBzYWZhcmkgPj0gMTUsIGlvcyA%2BPSAxNSwgb3BlcmEgPj0gMTAzLCBub3QgZGVhZA%3D%3D) on 01/2025. [defaults, chrome >= 96, firefox >= 105, edge >= 113, safari >= 15, ios >= 15, opera >= 103, not dead](https://github.com/belgattitude/httpx/blob/main/packages/compress/.browserslistrc) |
| Bun | ✅ | Tested with latest (at time of writing >= 1.3.3) |
| Edge | ✅ | Ensured on CI with [@vercel/edge-runtime](https://github.com/vercel/edge-runtime). |
| Cloudflare | ✅ | Ensured with @cloudflare/vitest-plugin (see [wrangler.toml](https://github.com/belgattitude/httpx/blob/main/devtools/vitest/wrangler.toml) |
| Typescript | ✅ | TS 5.7+ / [are-the-type-wrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io) checks on CI. |
| ES2022 | ✅ | Dist files checked with [es-check](https://github.com/yowainwright/es-check) |
| Performance | ✅ | Monitored with [codspeed.io](https://codspeed.io/belgattitude/httpx) |

> For _older_ browsers: most frontend frameworks can transpile the library (ie: [nextjs](https://nextjs.org/docs/app/api-reference/next-config-js/transpilePackages)...)

## Contributors

Contributions are welcome. Have a look to the [CONTRIBUTING](https://github.com/belgattitude/httpx/blob/main/CONTRIBUTING.md) document.

## Sponsors

If my OSS work brightens your day, let's take it to new heights together! [Sponsor](<[sponsorship](https://github.com/sponsors/belgattitude)>), [coffee](<(https://ko-fi.com/belgattitude)>), or star – any gesture of support fuels my passion to improve. Thanks for being awesome! 🙏❤️

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
