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

```
 RUN  v4.1.0 /home/sebastien/github/httpx/packages/compress


 ✓ bench/compress-string.bench.ts > Compressor 3372ms
     name                                                                               hz      min      max     mean      p75      p99     p995     p999      rme  samples
   · Compressor('gzip').toEncodedString/base64 (original size: 10 MB)              14.6228  51.2665   105.03  68.3865  62.2349   105.03   105.03   105.03  ±21.33%        8
   · Compressor('gzip').toEncodedString/base64_urlsafe (original size: 10 MB)      17.4693  51.7026  76.1508  57.2432  53.6072  76.1508  76.1508  76.1508  ±12.73%        9
   · Compressor('deflate').toEncodedString/base64 (original size: 10 MB)           17.9078  50.0100  64.0214  55.8416  56.9880  64.0214  64.0214  64.0214   ±7.29%        9
   · Compressor('deflate').toEncodedString/base64-url_safe (original size: 10 MB)  18.4466  47.9274  77.2346  54.2105  56.3455  77.2346  77.2346  77.2346  ±11.81%       10

 ✓ bench/decompress-string.bench.ts > Decompressor 2353ms
     name                                                                                     hz     min     max    mean     p75     p99    p995    p999      rme  samples
   · Decompressor('gzip').fromEncodedString (compressed size: 40.5 kB / total: 10 MB)     7.9639  113.95  146.56  125.57  127.04  146.56  146.56  146.56  ±19.29%        4
   · Decompressor('deflate').fromEncodedString (compressed size: 40.5 kB / total: 10 MB)  7.7943  120.79  135.43  128.30  130.74  135.43  135.43  135.43   ±7.76%        4

 ✓ bench/decompress-uint8array.bench.ts > Decompressor 2439ms
     name                                                                                  hz      min     max    mean     p75     p99    p995    p999      rme  samples
   · Decompressor('gzip').fromUint8Array (compressed size: 30.4 kB / total: 10 MB)     7.4025   108.34  183.06  135.09  135.23  183.06  183.06  183.06  ±40.07%        4
   · Decompressor('deflate').fromUint8Array (compressed size: 30.4 kB / total: 10 MB)  9.2430  92.0323  124.78  108.19  116.49  124.78  124.78  124.78  ±14.55%        5

 ✓ bench/compress-uint8array.bench.ts > Compressor 1663ms
     name                                                            hz      min      max     mean      p75      p99     p995     p999      rme  samples
   · Compressor('gzip').toUint8Array (original size: 10 MB)     15.7262  54.1742  81.3818  63.5881  60.8143  81.3818  81.3818  81.3818  ±12.71%        8
   · Compressor('deflate').toUint8Array (original size: 10 MB)  18.2422  47.6582  68.4186  54.8180  60.0257  68.4186  68.4186  68.4186  ±10.48%       10

 BENCH  Summary

  Compressor('deflate').toEncodedString/base64-url_safe (original size: 10 MB) - bench/compress-string.bench.ts > Compressor
    1.03x faster than Compressor('deflate').toEncodedString/base64 (original size: 10 MB)
    1.06x faster than Compressor('gzip').toEncodedString/base64_urlsafe (original size: 10 MB)
    1.26x faster than Compressor('gzip').toEncodedString/base64 (original size: 10 MB)

  Compressor('deflate').toUint8Array (original size: 10 MB) - bench/compress-uint8array.bench.ts > Compressor
    1.16x faster than Compressor('gzip').toUint8Array (original size: 10 MB)

  Decompressor('gzip').fromEncodedString (compressed size: 40.5 kB / total: 10 MB) - bench/decompress-string.bench.ts > Decompressor
    1.02x faster than Decompressor('deflate').fromEncodedString (compressed size: 40.5 kB / total: 10 MB)

  Decompressor('deflate').fromUint8Array (compressed size: 30.4 kB / total: 10 MB) - bench/decompress-uint8array.bench.ts > Decompressor
    1.25x faster than Decompressor('gzip').fromUint8Array (compressed size: 30.4 kB / total: 10 MB)
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
