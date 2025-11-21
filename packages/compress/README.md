# @httpx/compress

Lightweight compression helpers based on widely available [Compression Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Compression_Streams_API).
Works in node, bun, edge, cloudflare and browsers. Provides support for string encoding (base64 and base64-urlsafe).

> Note that bun support is polyfilled till Compression Streams API is natively supported.

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
import { Compressor, Decompressor } from '@httpx/compress';

const compressor = new Compressor('gzip');
const gzippedStr = await compressor.toEncodedString('Hello, World! 🦆', {
  encoding: 'base64', // optional, 'base64' by default
});

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
  // Optional.
  // Supported values: 'base64' (default), 'base64_urlsafe'
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
 RUN  v4.0.10 /home/sebastien/github/httpx/packages/compress

 ✓ bench/compress-string.bench.ts > Compressor 2909ms
     name                                                                               hz      min      max     mean      p75      p99     p995     p999     rme  samples
   · Compressor('gzip').toEncodedString/base64 (original size: 10 MB)              23.7417  36.5044  50.2012  42.1200  45.6970  50.2012  50.2012  50.2012  ±6.49%       13
   · Compressor('gzip').toEncodedString/base64_urlsafe (original size: 10 MB)      25.0138  36.3645  48.4145  39.9780  42.7624  48.4145  48.4145  48.4145  ±5.97%       13
   · Compressor('deflate').toEncodedString/base64 (original size: 10 MB)           25.7052  32.4704  44.4953  38.9026  41.5483  44.4953  44.4953  44.4953  ±5.58%       13                                                                                                                              
   · Compressor('deflate').toEncodedString/base64-url_safe (original size: 10 MB)  25.7872  36.2869  43.8019  38.7790  39.3598  43.8019  43.8019  43.8019  ±3.70%       13                                                                                                                              

 ✓ bench/decompress-string.bench.ts > Decompressor 1770ms
     name                                                                                      hz      min      max     mean      p75      p99     p995     p999     rme  samples
   · Decompressor('gzip').fromEncodedString (compressed size: 40.5 kB / total: 10 MB)     13.8849  63.9173  77.2744  72.0209  75.4232  77.2744  77.2744  77.2744  ±5.92%        7
   · Decompressor('deflate').fromEncodedString (compressed size: 40.5 kB / total: 10 MB)  15.9822  58.0578  68.1414  62.5697  63.3899  68.1414  68.1414  68.1414  ±4.40%        8

 ✓ bench/decompress-uint8array.bench.ts > Decompressor 1424ms
     name                                                                                   hz      min      max     mean      p75      p99     p995     p999     rme  samples
   · Decompressor('gzip').fromUint8Array (compressed size: 30.4 kB / total: 10 MB)     25.3188  34.7045  44.3954  39.4964  41.7273  44.3954  44.3954  44.3954  ±4.61%       13
   · Decompressor('deflate').fromUint8Array (compressed size: 30.4 kB / total: 10 MB)  27.8963  32.0022  40.0406  35.8470  37.3682  40.0406  40.0406  40.0406  ±3.88%       14

 ✓ bench/compress-uint8array.bench.ts > Compressor 1453ms
     name                                                            hz      min      max     mean      p75      p99     p995     p999     rme  samples
   · Compressor('gzip').toUint8Array (original size: 10 MB)     25.4082  33.8772  45.0735  39.3574  41.9890  45.0735  45.0735  45.0735  ±5.10%       13
   · Compressor('deflate').toUint8Array (original size: 10 MB)  26.7354  33.5035  42.0188  37.4037  40.4936  42.0188  42.0188  42.0188  ±4.43%       14

 BENCH  Summary
                                                                                                                                                    
  Compressor('deflate').toEncodedString/base64-url_safe (original size: 10 MB) - bench/compress-string.bench.ts > Compressor
    1.00x faster than Compressor('deflate').toEncodedString/base64 (original size: 10 MB)
    1.03x faster than Compressor('gzip').toEncodedString/base64_urlsafe (original size: 10 MB)
    1.09x faster than Compressor('gzip').toEncodedString/base64 (original size: 10 MB)

  Compressor('deflate').toUint8Array (original size: 10 MB) - bench/compress-uint8array.bench.ts > Compressor
    1.05x faster than Compressor('gzip').toUint8Array (original size: 10 MB)

  Decompressor('deflate').fromEncodedString (compressed size: 40.5 kB / total: 10 MB) - bench/decompress-string.bench.ts > Decompressor
    1.15x faster than Decompressor('gzip').fromEncodedString (compressed size: 40.5 kB / total: 10 MB)

  Decompressor('deflate').fromUint8Array (compressed size: 30.4 kB / total: 10 MB) - bench/decompress-uint8array.bench.ts > Decompressor
    1.10x faster than Decompressor('gzip').fromUint8Array (compressed size: 30.4 kB / total: 10 MB)
```

> See [benchmark file](https://github.com/belgattitude/httpx/blob/main/packages/compress/bench/comparative.bench.ts) for details.

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/compress/.size-limit.ts)

| Scenario (esm)                        | Size (compressed) |
|---------------------------------------|------------------:|
| `import { Compressor }`               |            ~ 568B |
| `import { Decompressor }`             |            ~ 450B |
| `import { Decompressor, Compressor }` |            ~ 697B |


> For CJS usage (not recommended) track the size on [bundlephobia](https://bundlephobia.com/package/@httpx/compress@latest).

## Compatibility

| Level        | CI | Description                                                                                                                                                                                                                                                                                                                                                                                   |
|--------------|----|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|  
| Node         | ✅   | CI for 20.x, 22.x, 24.x & 25.x.                                                                                                                                                                                                                                                                                                                                                               |
| Browser      | ✅  | Tested with latest chrome (vitest/playwright)                                                                                                                                                                                                                                                                                                                                                 |
| Browserslist | ✅  | [> 95%](https://browserslist.dev/?q=ZGVmYXVsdHMsIGNocm9tZSA%2BPSA5NiwgZmlyZWZveCA%2BPSAxMDUsIGVkZ2UgPj0gMTEzLCBzYWZhcmkgPj0gMTUsIGlvcyA%2BPSAxNSwgb3BlcmEgPj0gMTAzLCBub3QgZGVhZA%3D%3D) on 01/2025. [defaults, chrome >= 96, firefox >= 105, edge >= 113, safari >= 15, ios >= 15, opera >= 103, not dead](https://github.com/belgattitude/httpx/blob/main/packages/compress/.browserslistrc) |
| Bun          | ✅  | Tested with latest (at time of writing >= 1.3.2)                                                                                                                                                                                                                                                                                                                                              |
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
