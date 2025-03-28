# @httpx/compress

Simple compression helpers that works on node, browsers, edge and Cloudflare workers.
[![npm](https://img.shields.io/npm/v/@httpx/compress?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/compress)
[![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/compress/CHANGELOG.md)
[![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-compress-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fcompress)
[![bundles](https://img.shields.io/static/v1?label=&message=cjs|esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/compress/.size-limit.cjs)
[![node](https://img.shields.io/static/v1?label=Node&message=18%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
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
- 📐&nbsp; Lightweight (starts at [~600B](#bundle-size))
- 🛡️&nbsp; Tested on [node 18-22, browser, cloudflare workers and runtime/edge](#compatibility).
- 🙏&nbsp; Works cross-realms (browser, edge, node, cloudflare...)
- 🗝️&nbsp; Available in ESM and CJS formats.

## Documentation

👉 [Official website](https://belgattitude.github.io/httpx/compress) or [GitHub Readme](https://github.com/belgattitude/httpx/tree/main/packages/compress#readme)

## Quickstart

```typescript
import { Compressor, Decompressor } from '@httpx/compress';

const compressor = new Compressor('gzip');
const gzippedStr = await compressor.toEncodedString('Hello, World! 🦆');

const decompressor = new Decompressor('gzip');
const originalStr = await decompressor.fromEncodedString(gzippedStr);
```

## Api

### Compressor

| Method              | Description                                                                                                                                              | 
|---------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `toUint8Array()`    | Compress a string or a Uint8Array to a binary [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array). |
| `toEncodedString()` | Compress a string or a Uint8Array to a encoded string.                                                                                                   |


### Decompressor

| Method                | Description                                                                                                                                              | 
|-----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `fromUint8Array()`    | Decompresses a compressed Uint8Array to its original binary form.                                                                                       |
| `fromEncodedString()` | Compress a string or a Uint8Array to a encoded string.                                                                                                   |


## Usage

### Compressor

#### toUint8Array

```typescript
import { Compressor } from '@httpx/compress';

const compressor = new Compressor('gzip'); // or 'deflate'
const longString = 'Hello, World! 🦆'.repeat(500_000);
const compressedUInt8 = await compressor.toUint8Array(longString);
```

#### toEncodedString

```typescript
import { Compressor } from '@httpx/compress';

const compressor = new Compressor('gzip'); // or 'deflate'
const longString = 'Hello, World! 🦆'.repeat(500_000);
const compressedString = await compressor.toEncodedString(longString, {
  // Option are optional, use base64 by default.
  // Supported values: 'base64', 'base64_urlsafe'
  encoding: 'base64',
});
```

### Decompressor

#### fromUint8Array

```typescript
import { Decompressor } from '@httpx/compress';

const decompressor = new Decompressor('gzip'); // or 'deflate'
const decompressedUInt8 = await decompressor.fromUint8Array(compressedUInt8);
```

#### fromEncodedString

```typescript
import { Decompressor } from '@httpx/compress';

const decompressor = new Decompressor('gzip'); // or 'deflate'
const decompressedString = await decompressor.fromEncodedString(compressedString);
```

## Benchmarks

> Performance is continuously monitored thanks to [codspeed.io](https://codspeed.io/belgattitude/httpx). 
>
> [![CodSpeed Badge](https://img.shields.io/endpoint?url=https://codspeed.io/badge.json)](https://codspeed.io/belgattitude/httpx)

```
 RUN  v3.0.9 /home/sebastien/github/httpx/packages/compress


 ✓ bench/compress-string.bench.ts > Compressor 3243ms
     name                                                                               hz      min      max     mean      p75      p99     p995     p999     rme  samples
   · Compressor('gzip').toEncodedString/base64 (original size: 10 MB)              18.6250  52.1838  56.8048  53.6914  55.7546  56.8048  56.8048  56.8048  ±2.48%       10   slowest
   · Compressor('gzip').toEncodedString/base64_urlsafe (original size: 10 MB)      19.2092  51.2096  52.5271  52.0585  52.3733  52.5271  52.5271  52.5271  ±0.55%       10
   · Compressor('deflate').toEncodedString/base64 (original size: 10 MB)           20.1292  48.7729  50.6601  49.6790  50.2382  50.6601  50.6601  50.6601  ±0.89%       11
   · Compressor('deflate').toEncodedString/base64-url_safe (original size: 10 MB)  20.1714  48.7836  50.4266  49.5751  49.8648  50.4266  50.4266  50.4266  ±0.63%       11   fastest

 ✓ bench/decompress-string.bench.ts > Decompressor 1845ms
     name                                                                                      hz      min      max     mean      p75      p99     p995     p999     rme  samples
   · Decompressor('gzip').fromEncodedString (compressed size: 40.5 kB / total: 10 MB)     13.4591  69.0043  80.8933  74.2992  76.1238  80.8933  80.8933  80.8933  ±4.73%        7
   · Decompressor('deflate').fromEncodedString (compressed size: 40.5 kB / total: 10 MB)  13.9292  66.5701  83.4795  71.7914  73.4803  83.4795  83.4795  83.4795  ±7.41%        7   fastest

 ✓ bench/decompress-uint8array.bench.ts > Decompressor 1402ms
     name                                                                                   hz      min      max     mean      p75      p99     p995     p999     rme  samples
   · Decompressor('gzip').fromUint8Array (compressed size: 30.4 kB / total: 10 MB)     30.3619  25.7162  45.3852  32.9360  36.7200  45.3852  45.3852  45.3852  ±9.66%       16
   · Decompressor('deflate').fromUint8Array (compressed size: 30.4 kB / total: 10 MB)  36.5280  22.1687  34.0941  27.3763  30.9489  34.0941  34.0941  34.0941  ±6.79%       19   fastest

 ✓ bench/compress-uint8array.bench.ts > Compressor 1626ms
     name                                                            hz      min      max     mean      p75      p99     p995     p999     rme  samples
   · Compressor('gzip').toUint8Array (original size: 10 MB)     18.1687  51.2364  64.0366  55.0396  56.1935  64.0366  64.0366  64.0366  ±5.70%       10
   · Compressor('deflate').toUint8Array (original size: 10 MB)  19.8917  48.6506  54.0161  50.2723  50.4489  54.0161  54.0161  54.0161  ±2.19%       10   fastest

 BENCH  Summary

  Compressor('deflate').toEncodedString/base64-url_safe (original size: 10 MB) - bench/compress-string.bench.ts > Compressor
    1.00x faster than Compressor('deflate').toEncodedString/base64 (original size: 10 MB)
    1.05x faster than Compressor('gzip').toEncodedString/base64_urlsafe (original size: 10 MB)
    1.08x faster than Compressor('gzip').toEncodedString/base64 (original size: 10 MB)

  Compressor('deflate').toUint8Array (original size: 10 MB) - bench/compress-uint8array.bench.ts > Compressor
    1.09x faster than Compressor('gzip').toUint8Array (original size: 10 MB)

  Decompressor('deflate').fromEncodedString (compressed size: 40.5 kB / total: 10 MB) - bench/decompress-string.bench.ts > Decompressor
    1.03x faster than Decompressor('gzip').fromEncodedString (compressed size: 40.5 kB / total: 10 MB)

  Decompressor('deflate').fromUint8Array (compressed size: 30.4 kB / total: 10 MB) - bench/decompress-uint8array.bench.ts > Decompressor
    1.20x faster than Decompressor('gzip').fromUint8Array (compressed size: 30.4 kB / total: 10 MB)

```

> See [benchmark file](https://github.com/belgattitude/httpx/blob/main/packages/compress/bench/comparative.bench.ts) for details.

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/compress/.size-limit.ts)

| Scenario (esm)                        | Size (compressed) |
|---------------------------------------|------------------:|
| `import { Compressor }`               |            ~ 562B |
| `import { Decompressor }`             |            ~ 423B |
| `import { Decompressor, Compressor }` |            ~ 662B |


> For CJS usage (not recommended) track the size on [bundlephobia](https://bundlephobia.com/package/@httpx/compress@latest).

## Compatibility

| Level        | CI | Description                                                                                                                                                                                                                                                                                                                                                                                   |
|--------------|----|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|  
| Node         | ✅  | CI for 18.x, 20.x & 22.x.                                                                                                                                                                                                                                                                                                                                                                     |
| Browser      | ✅  | Tested with latest chrome (vitest/playwright)                                                                                                                                                                                                                                                                                                                                                 |
| Browserslist | ✅  | [> 95%](https://browserslist.dev/?q=ZGVmYXVsdHMsIGNocm9tZSA%2BPSA5NiwgZmlyZWZveCA%2BPSAxMDUsIGVkZ2UgPj0gMTEzLCBzYWZhcmkgPj0gMTUsIGlvcyA%2BPSAxNSwgb3BlcmEgPj0gMTAzLCBub3QgZGVhZA%3D%3D) on 01/2025. [defaults, chrome >= 96, firefox >= 105, edge >= 113, safari >= 15, ios >= 15, opera >= 103, not dead](https://github.com/belgattitude/httpx/blob/main/packages/compress/.browserslistrc) |
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
