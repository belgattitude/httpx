# @httpx/compress

Lightweight compression helpers based on widely available [Compression Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Compression_Streams_API).
Works in node, bun, edge, cloudflare and browsers. Provides support for string encoding (base64 and base64-urlsafe).

[![npm](https://img.shields.io/npm/v/@httpx/compress?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/compress)
[![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/compress/CHANGELOG.md)
[![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-compress-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fcompress)
[![bundles](https://img.shields.io/static/v1?label=&message=cjs|esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/compress/.size-limit.cjs)
[![node](https://img.shields.io/static/v1?label=Node&message=20%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![browserslist](https://img.shields.io/static/v1?label=Browser&message=%3E96%25&logo=googlechrome&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![size](https://img.shields.io/bundlephobia/minzip/@httpx/compress@latest?label=Max&style=for-the-badge&labelColor=444&color=informational)](https://bundlephobia.com/package/@httpx/compress@latest)
[![downloads](https://img.shields.io/npm/dm/@httpx/compress?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/compress)
[![license](https://img.shields.io/npm/l/@httpx/compress?style=for-the-badge&labelColor=444)](https://github.com/belgattitude/httpx/blob/main/LICENSE)

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
- 🗝️&nbsp; Available in ESM and CJS formats.

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

| Method              | Description                                                                                                                                              |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `toUint8Array()`    | Compress a string or a Uint8Array to a binary [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array). |
| `toEncodedString()` | Compress a string or a Uint8Array to a encoded string.                                                                                                   |

### Decompressor

| Method                | Description                                                       |
| --------------------- | ----------------------------------------------------------------- |
| `fromUint8Array()`    | Decompresses a compressed Uint8Array to its original binary form. |
| `fromEncodedString()` | Compress a string or a Uint8Array to a encoded string.            |

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

### Node 24

```
 RUN  v4.1.5 /home/sebastien/github/httpx/packages/compress

 ✓ bench/decompress-string.bench.ts > Decompressor 2599ms
     name                                                                                     hz     min     max    mean     p75     p99    p995    p999      rme  samples
   · Decompressor('gzip').fromEncodedString (compressed size: 40.5 kB / total: 10 MB)     8.2768  114.35  130.45  120.82  125.14  130.45  130.45  130.45   ±7.07%        5
   · Decompressor('deflate').fromEncodedString (compressed size: 40.5 kB / total: 10 MB)  7.7771  109.35  164.30  128.58  127.66  164.30  164.30  164.30  ±31.05%        4

 ✓ bench/decompress-uint8array.bench.ts > Decompressor 2408ms
     name                                                                                  hz     min     max    mean     p75     p99    p995    p999      rme  samples
   · Decompressor('gzip').fromUint8Array (compressed size: 30.4 kB / total: 10 MB)     8.3570  103.47  139.05  119.66  122.70  139.05  139.05  139.05  ±13.43%        5
   · Decompressor('deflate').fromUint8Array (compressed size: 30.4 kB / total: 10 MB)  8.9012  103.14  122.16  112.34  116.46  122.16  122.16  122.16   ±8.00%        5

 ✓ bench/compress-string.bench.ts > Compressor 3357ms
     name                                                                               hz      min      max     mean      p75      p99     p995     p999      rme  samples
   · Compressor('gzip').toEncodedString/base64 (original size: 10 MB)              15.6900  49.7846  97.8111  63.7350  64.5830  97.8111  97.8111  97.8111  ±23.72%        8
   · Compressor('gzip').toEncodedString/base64_urlsafe (original size: 10 MB)      16.6442  53.0216  77.2079  60.0811  68.0045  77.2079  77.2079  77.2079  ±11.48%        9
   · Compressor('deflate').toEncodedString/base64 (original size: 10 MB)           19.2947  47.4060  70.8287  51.8276  51.7732  70.8287  70.8287  70.8287   ±9.78%       10
   · Compressor('deflate').toEncodedString/base64-url_safe (original size: 10 MB)  17.0343  47.4363  73.3762  58.7052  60.0841  73.3762  73.3762  73.3762  ±10.38%        9

 ✓ bench/compress-uint8array.bench.ts > Compressor 1698ms
     name                                                            hz      min      max     mean      p75      p99     p995     p999      rme  samples
   · Compressor('gzip').toUint8Array (original size: 10 MB)     17.5662  50.8913  77.9940  56.9274  55.4450  77.9940  77.9940  77.9940  ±12.23%        9
   · Compressor('deflate').toUint8Array (original size: 10 MB)  17.9343  47.4480  64.8101  55.7592  60.6946  64.8101  64.8101  64.8101   ±8.72%        9

 BENCH  Summary

  Compressor('deflate').toEncodedString/base64 (original size: 10 MB) - bench/compress-string.bench.ts > Compressor
    1.13x faster than Compressor('deflate').toEncodedString/base64-url_safe (original size: 10 MB)
    1.16x faster than Compressor('gzip').toEncodedString/base64_urlsafe (original size: 10 MB)
    1.23x faster than Compressor('gzip').toEncodedString/base64 (original size: 10 MB)

  Compressor('deflate').toUint8Array (original size: 10 MB) - bench/compress-uint8array.bench.ts > Compressor
    1.02x faster than Compressor('gzip').toUint8Array (original size: 10 MB)

  Decompressor('gzip').fromEncodedString (compressed size: 40.5 kB / total: 10 MB) - bench/decompress-string.bench.ts > Decompressor
    1.06x faster than Decompressor('deflate').fromEncodedString (compressed size: 40.5 kB / total: 10 MB)

  Decompressor('deflate').fromUint8Array (compressed size: 30.4 kB / total: 10 MB) - bench/decompress-uint8array.bench.ts > Decompressor
    1.07x faster than Decompressor('gzip').fromUint8Array (compressed size: 30.4 kB / total: 10 MB)
```

### Bun 1.3.13

```
 RUN  v4.1.5 /home/sebastien/github/httpx/packages/compress

 ✓ bench/compress-string.bench.ts > Compressor 2681ms
     name                                                                               hz      min      max     mean      p75      p99     p995     p999      rme  samples
   · Compressor('gzip').toEncodedString/base64 (original size: 10 MB)              35.7228  10.4090  54.8768  27.9933  35.0521  54.8768  54.8768  54.8768  ±22.40%       18
   · Compressor('gzip').toEncodedString/base64_urlsafe (original size: 10 MB)      38.8395  13.2784  51.0637  25.7470  31.2537  51.0637  51.0637  51.0637  ±19.08%       20
   · Compressor('deflate').toEncodedString/base64 (original size: 10 MB)           60.3501  11.4952  34.1153  16.5700  17.5864  34.1153  34.1153  34.1153   ±8.47%       31
   · Compressor('deflate').toEncodedString/base64-url_safe (original size: 10 MB)  34.5599  16.3495  66.9976  28.9352  30.7476  66.9976  66.9976  66.9976  ±19.62%       19

 ✓ bench/decompress-string.bench.ts > Decompressor 3302ms
     name                                                                                     hz     min     max    mean     p75     p99    p995    p999      rme  samples
   · Decompressor('gzip').fromEncodedString (compressed size: 80.9 kB / total: 10 MB)     5.6077  153.89  197.60  178.33  197.60  197.60  197.60  197.60  ±20.20%        4
   · Decompressor('deflate').fromEncodedString (compressed size: 80.9 kB / total: 10 MB)  5.9644  138.87  178.91  167.66  178.52  178.91  178.91  178.91  ±18.32%        4

 ✓ bench/decompress-uint8array.bench.ts > Decompressor 2908ms
     name                                                                                  hz     min     max    mean     p75     p99    p995    p999      rme  samples
   · Decompressor('gzip').fromUint8Array (compressed size: 60.7 kB / total: 10 MB)     6.1927  147.94  170.98  161.48  170.24  170.98  170.98  170.98  ±10.98%        4
   · Decompressor('deflate').fromUint8Array (compressed size: 60.7 kB / total: 10 MB)  6.6295  141.58  169.43  150.84  149.47  169.43  169.43  169.43  ±13.57%        4

 ✓ bench/compress-uint8array.bench.ts > Compressor 1352ms
     name                                                            hz      min      max     mean      p75      p99     p995     p999      rme  samples
   · Compressor('gzip').toUint8Array (original size: 10 MB)     47.8415  10.6342  53.2631  20.9023  24.1018  53.2631  53.2631  53.2631  ±17.63%       24
   · Compressor('deflate').toUint8Array (original size: 10 MB)  32.4733  22.3662  60.6708  30.7945  33.9284  60.6708  60.6708  60.6708  ±19.80%       17

 BENCH  Summary

  Compressor('gzip').toUint8Array (original size: 10 MB) - bench/compress-uint8array.bench.ts > Compressor
    1.47x faster than Compressor('deflate').toUint8Array (original size: 10 MB)

  Decompressor('deflate').fromUint8Array (compressed size: 60.7 kB / total: 10 MB) - bench/decompress-uint8array.bench.ts > Decompressor
    1.07x faster than Decompressor('gzip').fromUint8Array (compressed size: 60.7 kB / total: 10 MB)

  Compressor('deflate').toEncodedString/base64 (original size: 10 MB) - bench/compress-string.bench.ts > Compressor
    1.55x faster than Compressor('gzip').toEncodedString/base64_urlsafe (original size: 10 MB)
    1.69x faster than Compressor('gzip').toEncodedString/base64 (original size: 10 MB)
    1.75x faster than Compressor('deflate').toEncodedString/base64-url_safe (original size: 10 MB)

  Decompressor('deflate').fromEncodedString (compressed size: 80.9 kB / total: 10 MB) - bench/decompress-string.bench.ts > Decompressor
    1.06x faster than Decompressor('gzip').fromEncodedString (compressed size: 80.9 kB / total: 10 MB)
```

> See [benchmark file](https://github.com/belgattitude/httpx/blob/main/packages/compress/bench/comparative.bench.ts) for details.

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/compress/.size-limit.ts)

| Scenario (esm)                        | Size (compressed) |
| ------------------------------------- | ----------------: |
| `import { Compressor }`               |            ~ 568B |
| `import { Decompressor }`             |            ~ 450B |
| `import { Decompressor, Compressor }` |            ~ 697B |

> For CJS usage (not recommended) track the size on [bundlephobia](https://bundlephobia.com/package/@httpx/compress@latest).

## Compatibility

| Level        | CI  | Description                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------ | --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Node         | ✅  | CI for 20.x, 22.x, 24.x & 25.x.                                                                                                                                                                                                                                                                                                                                                               |
| Browser      | ✅  | Tested with latest chrome (vitest/playwright)                                                                                                                                                                                                                                                                                                                                                 |
| Browserslist | ✅  | [> 95%](https://browserslist.dev/?q=ZGVmYXVsdHMsIGNocm9tZSA%2BPSA5NiwgZmlyZWZveCA%2BPSAxMDUsIGVkZ2UgPj0gMTEzLCBzYWZhcmkgPj0gMTUsIGlvcyA%2BPSAxNSwgb3BlcmEgPj0gMTAzLCBub3QgZGVhZA%3D%3D) on 01/2025. [defaults, chrome >= 96, firefox >= 105, edge >= 113, safari >= 15, ios >= 15, opera >= 103, not dead](https://github.com/belgattitude/httpx/blob/main/packages/compress/.browserslistrc) |
| Bun          | ✅  | Tested with latest (at time of writing >= 1.3.3)                                                                                                                                                                                                                                                                                                                                              |
| Edge         | ✅  | Ensured on CI with [@vercel/edge-runtime](https://github.com/vercel/edge-runtime).                                                                                                                                                                                                                                                                                                            |
| Cloudflare   | ✅  | Ensured with @cloudflare/vitest-pool-workers (see [wrangler.toml](https://github.com/belgattitude/httpx/blob/main/devtools/vitest/wrangler.toml)                                                                                                                                                                                                                                              |
| Typescript   | ✅  | TS 5.4 + / [are-the-type-wrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io) checks on CI.                                                                                                                                                                                                                                                                                 |
| ES2022       | ✅  | Dist files checked with [es-check](https://github.com/yowainwright/es-check)                                                                                                                                                                                                                                                                                                                  |
| Performance  | ✅  | Monitored with [codspeed.io](https://codspeed.io/belgattitude/httpx)                                                                                                                                                                                                                                                                                                                          |

> For _older_ browsers: most frontend frameworks can transpile the library (ie: [nextjs](https://nextjs.org/docs/app/api-reference/next-config-js/transpilePackages)...)

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
