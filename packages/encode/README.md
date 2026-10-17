# @httpx/encode

[![npm](https://img.shields.io/npm/v/@httpx/encode?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/encode) [![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/encode/CHANGELOG.md) [![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-encode-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fencode) [![bundles](https://img.shields.io/static/v1?label=&message=esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/encode/.size-limit.ts) [![node](https://img.shields.io/static/v1?label=Node&message=22%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](#compatibility) [![browserslist](https://img.shields.io/static/v1?label=Browsers&message=%3E96%25&logo=googlechrome&style=for-the-badge&labelColor=444&color=informational)](#compatibility) [![downloads](https://img.shields.io/npm/dm/@httpx/encode?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/encode) [![license](https://img.shields.io/npm/l/@httpx/encode?style=for-the-badge&labelColor=444)](https://github.com/belgattitude/httpx/blob/main/LICENSE)

Base64 encoding optimized for performance and correctness. 1.5x-7x faster on `decode()` than [js-base64](https://github.com/dankogai/js-base64) and up to 2x on `encode()`. Same options and validation rules as the native [Uint8Array.fromBase64](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/fromBase64) on every runtime. Less than 400b on bun and deno.

## Install

```bash
$ npm install @httpx/encode
$ yarn add @httpx/encode
$ pnpm add @httpx/encode
```

## Features

- 🚀&nbsp; [Fast](#benchmarks): picks the [fastest implementation](#implementations) for the runtime (native, `Buffer` or optimized js).
- 📏&nbsp; Same [options](#options) as the native `Uint8Array.fromBase64()` / `toBase64()`: base64url, padding, `lastChunkHandling`.
- 🌍&nbsp; Unicode safe: utf-8 text, emoji, BOM and lone surrogates (see [notes](#notes)).
- 🦆&nbsp; Works with text (`encode` / `decode`) and bytes (`fromUint8Array` / `toUint8Array`).
- 🛡️&nbsp; Throws on [invalid input](#errors) instead of silently returning corrupted data.
- 📐&nbsp; Lightweight (starts at [~390B](#bundle-size))
- 🛡️&nbsp; Tested on [node 22-26, browser, bun, cloudflare and runtime/edge](#compatibility).
- 🗝️&nbsp; Available in ESM only.

## Documentation

👉 [Official website](https://belgattitude.github.io/httpx/encode) or [GitHub Readme](https://github.com/belgattitude/httpx/tree/main/packages/encode#readme)

## Base64

`Base64` encodes and decodes base64 / base64url. Text is always converted to and from utf-8. The implementation is selected once, when the module is loaded (see [implementations](#implementations)).

### API

| Method | Description |
| --- | --- |
| `encode(text, options?): string` | Encode a string (utf-8) to base64 |
| `decode(base64, options?): string` | Decode a base64 string to a string (utf-8) |
| `fromUint8Array(bytes, options?): string` | Encode bytes to base64 |
| `toUint8Array(base64, options?): Uint8Array` | Decode a base64 string to bytes |

### Usage

```typescript
// bundle size: ~390B (bun, deno), ~1.4kB (browser)
import { Base64 } from "@httpx/encode";

// 👇 Text (utf-8)
Base64.encode("Hello 🌸"); // 👈 "SGVsbG8g8J+MuA=="
Base64.decode("SGVsbG8g8J+MuA=="); // 👈 "Hello 🌸"

// 👇 Bytes
Base64.fromUint8Array(new Uint8Array([0xfb, 0xff])); // 👈 "+/8="
Base64.toUint8Array("+/8="); // 👈 Uint8Array [0xfb, 0xff]

// 👇 base64url, ie: urls, cookies, jwt...
Base64.encode("Hello 🌸", { alphabet: "base64url", omitPadding: true }); // 👈 "SGVsbG8g8J-MuA"
Base64.decode("SGVsbG8g8J-MuA"); // 👈 "Hello 🌸" (both alphabets accepted by default)
```

### Base64.decode()

Decodes a base64 or base64url string to text. Ascii whitespace (ie: line breaks) is ignored, the padding is optional unless `lastChunkHandling` is `"strict"`.

```typescript
Base64.decode("8J+MuA=="); // 👈 "🌸"
Base64.decode("8J-MuA"); // 👈 "🌸" (base64url, no padding)
Base64.decode("8J+M\nuA==\n"); // 👈 "🌸" (whitespace ignored)

Base64.decode("8J+MuA==", { alphabet: "base64url" }); // 👈 throws ('+' not allowed)
Base64.decode("Zm9vYg", { lastChunkHandling: "strict" }); // 👈 throws (missing padding)
Base64.decode("Zm9vYg", { lastChunkHandling: "stop-before-partial" }); // 👈 "foo"

Base64.decode("/w=="); // 👈 "�" (0xff is not valid utf-8)
Base64.decode("/w==", { fatal: true }); // 👈 throws
```

### Base64.toUint8Array()

Decodes a base64 or base64url string to bytes. Always returns a plain `Uint8Array` that owns its memory (never a `Buffer` from node's shared pool).

```typescript
Base64.toUint8Array("+/8="); // 👈 Uint8Array [0xfb, 0xff]
Base64.toUint8Array("-_8"); // 👈 Uint8Array [0xfb, 0xff]
Base64.toUint8Array("-_8=", { alphabet: "base64" }); // 👈 throws ('-' not allowed)
```

### Options

Encode options, used by `encode()` and `fromUint8Array()`, same as [Uint8Array.prototype.toBase64()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/toBase64#options):

| Option | Default | Description |
| --- | --- | --- |
| `alphabet` | `"base64"` | `"base64"` uses `+` and `/` (RFC 4648 §4), `"base64url"` uses `-` and `_` (RFC 4648 §5) |
| `omitPadding` | `false` | Omit the trailing `=` padding characters |

Decode options, used by `decode()` and `toUint8Array()`, same as [Uint8Array.fromBase64()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/fromBase64#options):

| Option | Default | Description |
| --- | --- | --- |
| `alphabet` | both | Restrict to `"base64"` or `"base64url"`. When not set, both alphabets are accepted (even mixed) |
| `lastChunkHandling` | `"loose"` | `"loose"`, `"strict"` or `"stop-before-partial"`, see below |
| `fatal` | `false` | `decode()` only. Throw when the decoded bytes are not valid utf-8 instead of replacing them with U+FFFD (�), see [TextDecoder.fatal](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder/fatal) |

> [!NOTE]
> Unlike `Uint8Array.fromBase64()` that defaults to `"base64"`, the alphabet is not restricted when the option is not set.

How `lastChunkHandling` handles a last chunk of less than 4 characters:

| Input | `"loose"` | `"strict"` | `"stop-before-partial"` |
| --- | --- | --- | --- |
| `"Zm9vYg=="` | `"foob"` | `"foob"` | `"foob"` |
| `"Zm9vYg"` | `"foob"` | throws (missing padding) | `"foo"` |
| `"Zm9vYg="` | throws | throws | `"foo"` |
| `"Zm9vY"` | throws | throws | `"foo"` |
| `"Zh=="` | `"f"` | throws (non-zero bits) | `"f"` |

### Errors

Invalid input throws an `Error`, the original error (if any) is available in `error.cause`.

| Message starts with | When |
| --- | --- |
| `Invalid Base64 input` | Character outside of the alphabet, misplaced or extra `=`, dangling character, `lastChunkHandling: "strict"` |
| `Invalid UTF-8` | `decode()` with `{ fatal: true }` and the decoded bytes are not valid utf-8 |

```typescript
Base64.decode("SGVsbG8*"); // 👈 throws (invalid character)
Base64.decode("SGV$bG8="); // 👈 throws (node's Buffer silently returns corrupted data)
Base64.decode("SGVsbG8=="); // 👈 throws (extra padding)
Base64.decode("SGVsb"); // 👈 throws (dangling character)
```

## Implementations

`import { Base64 } from "@httpx/encode"` resolves to the fastest implementation for the runtime, based on the [benchmarks](#benchmarks):

| Runtime | Implementation |
| --- | --- |
| node 25+, bun, deno, chrome 140+, firefox 133+, safari 18.2+ | native `Uint8Array.fromBase64()` / `toBase64()` |
| node 22 - 24 | `Buffer` |
| older browsers, edge runtimes without the native api | optimized js `encode`, `atob()` based `decode` |

Each implementation can also be imported directly. They all share the same api and behaviour.

```typescript
import { Base64Atob } from "@httpx/encode/base64/base64.atob"; // 👈 atob() / btoa()
import { Base64Node20 } from "@httpx/encode/base64/base64.node20"; // 👈 Buffer, native on node 25+
import { Base64Purejs } from "@httpx/encode/base64/base64.purejs"; // 👈 no runtime dependency
import { Base64Uint8Array } from "@httpx/encode/base64/base64.uint8array"; // 👈 native, requires Uint8Array.fromBase64
```

## Notes

### Text vs binary

`encode()` / `decode()` convert to and from utf-8 text, which is lossy for arbitrary bytes. Use `fromUint8Array()` / `toUint8Array()` for binary data (images, hashes, keys...).

```typescript
Base64.encode(Base64.decode("/w==")); // 👈 "77+9" ❌ (0xff became U+FFFD)
Base64.fromUint8Array(Base64.toUint8Array("/w==")); // 👈 "/w==" ✅
```

### Unicode

Compared to a raw `btoa()` / `atob()`:

| Input | `btoa()` / `atob()` | `Base64` |
| --- | --- | --- |
| `"🌸"` | throws `InvalidCharacterError` | `"8J+MuA=="` |
| `"é"` | `"6Q=="` (latin1, silently differs) | `"w6k="` (utf-8) |
| decode `"w6k="` | `"Ã©"` (mojibake) | `"é"` |
| leading BOM (U+FEFF) | throws | preserved (encode and decode) |
| lone surrogate (U+D800) | throws | encoded as U+FFFD, like `TextEncoder` |
| ~1MB input | `String.fromCharCode(...bytes)` overflows the stack | ✅ |

## Benchmarks

> Performance is continuously monitored thanks to [codspeed.io](https://codspeed.io/belgattitude/httpx).
>
> [![CodSpeed Badge](https://img.shields.io/endpoint?url=https://codspeed.io/badge.json)](https://codspeed.io/belgattitude/httpx)

### Node 26.10

```
 RUN  v5.0.4 /Users/sebastien/github/httpx/packages/encode

 ✓ |bench| bench/base64.bench.ts > Base64 implementations > encode (original size: 11.2 kB) 5127ms
   name                                                hz     min     max    mean     p75     p99    p995    p999     rme  samples
   @httpx/encode node20 (Buffer).encode()      209,819.44  0.0045  0.0812  0.0048  0.0048  0.0063  0.0067  0.0226  ±0.12%   207612   fastest
   @httpx/encode uint8array (native).encode()  209,467.86  0.0044  0.1748  0.0048  0.0048  0.0064  0.0069  0.0225  ±0.13%   207038
   @httpx/encode purejs.encode()                73,449.47  0.0129  0.1810  0.0137  0.0136  0.0180  0.0208  0.0378  ±0.13%    72913
   @httpx/encode atob.encode()                  33,517.66  0.0282  0.9854  0.0301  0.0298  0.0411  0.0750  0.0904  ±0.25%    33178   slowest
 ✓ |bench| bench/base64.bench.ts > Base64 implementations > decode (original size: 11.2 kB) 5077ms
   name                                                hz     min     max    mean     p75     p99    p995    p999     rme  samples
   @httpx/encode uint8array (native).decode()  128,115.64  0.0058  0.1110  0.0079  0.0082  0.0104  0.0117  0.0294  ±0.13%   126368   fastest
   @httpx/encode node20 (Buffer).decode()      125,955.89  0.0058  0.1082  0.0081  0.0083  0.0107  0.0119  0.0295  ±0.13%   124215
   @httpx/encode atob.decode()                  37,204.08  0.0223  0.1559  0.0271  0.0279  0.0348  0.0384  0.0833  ±0.13%    36878
   @httpx/encode purejs.decode()                27,869.73  0.0322  0.7858  0.0361  0.0370  0.0471  0.0530  0.0725  ±0.19%    27671   slowest
 ✓ |bench| bench/base64.bench.ts > Base64 implementations > fromUint8Array (original size: 15.2 kB) 5670ms
   name                                                          hz     min     max    mean     p75     p99    p995    p999     rme  samples
   @httpx/encode uint8array (native).fromUint8Array()  1,464,122.25  0.0005  0.0849  0.0007  0.0007  0.0009  0.0010  0.0020  ±0.22%  1399013   fastest
   @httpx/encode node20 (Buffer).fromUint8Array()      1,463,755.15  0.0005  0.0720  0.0007  0.0007  0.0009  0.0010  0.0020  ±0.22%  1398909
   @httpx/encode purejs.fromUint8Array()                 106,873.97  0.0089  0.3757  0.0094  0.0094  0.0123  0.0131  0.0301  ±0.14%   105972
   @httpx/encode atob.fromUint8Array()                    39,362.38  0.0241  1.2913  0.0257  0.0254  0.0349  0.0729  0.0834  ±0.30%    38899   slowest
 ✓ |bench| bench/base64.bench.ts > Base64 implementations > toUint8Array (original size: 15.2 kB) 5272ms
   name                                                      hz     min     max    mean     p75     p99    p995    p999     rme  samples
   @httpx/encode uint8array (native).toUint8Array()  392,692.06  0.0021  0.9078  0.0027  0.0026  0.0032  0.0034  0.0087  ±0.86%   374841   fastest
   @httpx/encode node20 (Buffer).toUint8Array()      393,620.82  0.0021  0.8117  0.0027  0.0026  0.0032  0.0033  0.0085  ±0.93%   374397
   @httpx/encode atob.toUint8Array()                  50,849.37  0.0172  0.1604  0.0199  0.0218  0.0262  0.0292  0.0432  ±0.13%    50223
   @httpx/encode purejs.toUint8Array()                32,101.48  0.0281  0.9966  0.0315  0.0321  0.0390  0.0430  0.0549  ±0.43%    31721   slowest
 ✓ |bench| bench/base64-compare.bench.ts > Base64 compared to js-base64 and uint8array-extras > encode (original size: 11.2 kB) 3860ms
   name                                            hz     min     max    mean     p75     p99    p995    p999     rme  samples
   npm:js-base64 encode()                  212,167.66  0.0044  0.0889  0.0048  0.0048  0.0062  0.0066  0.0223  ±0.12%   209924   fastest
   @httpx/encode Base64.encode()           210,316.41  0.0044  0.1482  0.0048  0.0048  0.0063  0.0067  0.0226  ±0.13%   207972
   npm:uint8array-extras stringToBase64()   15,953.24  0.0608  0.1523  0.0630  0.0622  0.0853  0.1119  0.1210  ±0.13%    15879   slowest
 ✓ |bench| bench/base64-compare.bench.ts > Base64 compared to js-base64 and uint8array-extras > decode (original size: 11.2 kB) 3796ms
   name                                            hz     min     max    mean     p75     p99    p995    p999     rme  samples
   @httpx/encode Base64.decode()           125,360.36  0.0058  0.1223  0.0081  0.0084  0.0105  0.0118  0.0295  ±0.13%   123676   fastest
   npm:js-base64 decode()                   47,029.92  0.0179  0.7439  0.0214  0.0218  0.0280  0.0298  0.0484  ±0.18%    46677
   npm:uint8array-extras base64ToString()    2,631.16  0.3635  0.7737  0.3812  0.3806  0.4814  0.5002  0.5513  ±0.24%     2624   slowest
 ✓ |bench| bench/base64-compare.bench.ts > Base64 compared to js-base64 and uint8array-extras > fromUint8Array (original size: 15.2 kB) 4441ms
   name                                                  hz     min     max    mean     p75     p99    p995    p999     rme  samples
   npm:js-base64 fromUint8Array()              1,498,730.61  0.0005  0.0966  0.0007  0.0007  0.0009  0.0010  0.0021  ±0.23%  1430470   fastest
   @httpx/encode Base64.fromUint8Array()       1,496,873.02  0.0005  0.1265  0.0007  0.0007  0.0009  0.0010  0.0024  ±0.23%  1428573
   npm:uint8array-extras uint8ArrayToBase64()     17,264.93  0.0567  7.9747  0.0588  0.0574  0.0805  0.1033  0.1140  ±1.66%    17000   slowest
 ✓ |bench| bench/base64-compare.bench.ts > Base64 compared to js-base64 and uint8array-extras > toUint8Array (original size: 15.2 kB) 3897ms
   name                                                hz     min     max    mean     p75     p99    p995    p999     rme  samples
   @httpx/encode Base64.toUint8Array()         406,184.13  0.0019  0.9257  0.0026  0.0026  0.0033  0.0037  0.0097  ±0.90%   383475   fastest
   npm:js-base64 toUint8Array()                 53,658.84  0.0163  0.8963  0.0190  0.0191  0.0250  0.0292  0.0487  ±0.55%    52761
   npm:uint8array-extras base64ToUint8Array()    2,704.57  0.3570  0.5255  0.3706  0.3714  0.4618  0.4730  0.4980  ±0.20%     2699   slowest
```

### Bun 1.4.3

```
 RUN  v5.0.4 /Users/sebastien/github/httpx/packages/encode

 ✓ |bench| bench/base64.bench.ts > Base64 implementations > encode (original size: 11.2 kB) 5110ms
   name                                                hz     min     max    mean     p75     p99    p995    p999     rme  samples
   @httpx/encode uint8array (native).encode()  206,094.03  0.0044  0.5664  0.0050  0.0049  0.0080  0.0113  0.0204  ±0.57%   199966   fastest
   @httpx/encode node20 (Buffer).encode()      203,988.82  0.0044  0.6793  0.0051  0.0050  0.0080  0.0116  0.0209  ±0.58%   197972
   @httpx/encode purejs.encode()                91,362.35  0.0101  0.6279  0.0112  0.0109  0.0169  0.0193  0.0321  ±0.52%    89428
   @httpx/encode atob.encode()                  49,976.67  0.0190  0.8020  0.0204  0.0199  0.0297  0.0373  0.0465  ±0.53%    49115   slowest
 ✓ |bench| bench/base64.bench.ts > Base64 implementations > decode (original size: 11.2 kB) 5080ms
   name                                                hz     min     max    mean     p75     p99    p995    p999     rme  samples
   @httpx/encode uint8array (native).decode()  135,872.28  0.0053  0.6410  0.0076  0.0080  0.0117  0.0142  0.0361  ±0.53%   130974   fastest
   @httpx/encode node20 (Buffer).decode()      132,237.01  0.0052  1.1615  0.0079  0.0082  0.0111  0.0125  0.0340  ±0.77%   127059
   @httpx/encode purejs.decode()                54,290.21  0.0164  0.6461  0.0186  0.0188  0.0253  0.0280  0.0492  ±0.36%    53623
   @httpx/encode atob.decode()                  52,561.19  0.0156  0.5963  0.0194  0.0198  0.0265  0.0326  0.0461  ±0.41%    51679   slowest
 ✓ |bench| bench/base64.bench.ts > Base64 implementations > fromUint8Array (original size: 15.2 kB) 5432ms
   name                                                          hz     min     max    mean     p75     p99    p995    p999     rme  samples
   @httpx/encode node20 (Buffer).fromUint8Array()      1,249,495.76  0.0006  0.6025  0.0009  0.0008  0.0012  0.0013  0.0093  ±0.80%  1161525   fastest
   @httpx/encode uint8array (native).fromUint8Array()  1,243,892.07  0.0006  0.6304  0.0009  0.0008  0.0013  0.0016  0.0092  ±0.81%  1151997
   @httpx/encode purejs.fromUint8Array()                 146,825.57  0.0061  0.9629  0.0070  0.0068  0.0112  0.0147  0.0278  ±0.63%   142204
   @httpx/encode atob.fromUint8Array()                    63,736.44  0.0149  0.6357  0.0159  0.0156  0.0241  0.0324  0.0388  ±0.43%    62726   slowest
 ✓ |bench| bench/base64.bench.ts > Base64 implementations > toUint8Array (original size: 15.2 kB) 5226ms
   name                                                      hz     min     max    mean     p75     p99    p995    p999     rme  samples
   @httpx/encode node20 (Buffer).toUint8Array()      498,884.26  0.0017  0.6283  0.0021  0.0021  0.0028  0.0053  0.0133  ±0.61%   475996   fastest
   @httpx/encode uint8array (native).toUint8Array()  482,012.43  0.0017  0.8528  0.0022  0.0023  0.0033  0.0065  0.0171  ±0.74%   452786
   @httpx/encode atob.toUint8Array()                  79,003.11  0.0118  0.6316  0.0129  0.0125  0.0193  0.0233  0.0346  ±0.41%    77775
   @httpx/encode purejs.toUint8Array()                72,061.20  0.0128  0.7634  0.0140  0.0141  0.0198  0.0248  0.0311  ±0.34%    71320   slowest
 ✓ |bench| bench/base64-compare.bench.ts > Base64 compared to js-base64 and uint8array-extras > encode (original size: 11.2 kB) 3841ms
   name                                            hz     min     max    mean     p75     p99    p995    p999     rme  samples
   npm:js-base64 encode()                  204,033.85  0.0044  0.6682  0.0051  0.0049  0.0085  0.0124  0.0216  ±0.65%   196710   fastest
   @httpx/encode Base64.encode()           202,358.39  0.0045  0.6683  0.0051  0.0050  0.0087  0.0125  0.0235  ±0.66%   194786
   npm:uint8array-extras stringToBase64()   42,083.16  0.0220  0.8210  0.0241  0.0237  0.0337  0.0383  0.0495  ±0.49%    41496   slowest
 ✓ |bench| bench/base64-compare.bench.ts > Base64 compared to js-base64 and uint8array-extras > decode (original size: 11.2 kB) 3800ms
   name                                            hz     min     max    mean     p75     p99    p995    p999     rme  samples
   @httpx/encode Base64.decode()           130,439.43  0.0054  1.0410  0.0080  0.0083  0.0126  0.0168  0.0370  ±0.86%   124441   fastest
   npm:js-base64 decode()                   73,574.14  0.0095  0.8978  0.0143  0.0163  0.0238  0.0293  0.0466  ±0.50%    69875
   npm:uint8array-extras base64ToString()   21,209.53  0.0408  0.7774  0.0481  0.0487  0.0651  0.0723  0.5821  ±0.59%    20775   slowest
 ✓ |bench| bench/base64-compare.bench.ts > Base64 compared to js-base64 and uint8array-extras > fromUint8Array (original size: 15.2 kB) 4131ms
   name                                                  hz     min     max    mean     p75     p99    p995    p999     rme  samples
   npm:js-base64 fromUint8Array()              1,237,376.06  0.0005  0.7423  0.0009  0.0008  0.0013  0.0015  0.0102  ±0.89%  1138126   fastest
   @httpx/encode Base64.fromUint8Array()       1,224,874.00  0.0006  0.8135  0.0009  0.0008  0.0015  0.0021  0.0120  ±1.03%  1104981
   npm:uint8array-extras uint8ArrayToBase64()     50,881.21  0.0189  0.5976  0.0199  0.0194  0.0289  0.0327  0.0424  ±0.34%    50283   slowest
 ✓ |bench| bench/base64-compare.bench.ts > Base64 compared to js-base64 and uint8array-extras > toUint8Array (original size: 15.2 kB) 3890ms
   name                                                hz     min     max    mean     p75     p99    p995    p999     rme  samples
   @httpx/encode Base64.toUint8Array()         501,423.52  0.0017  0.9145  0.0021  0.0021  0.0033  0.0061  0.0132  ±0.74%   472973   fastest
   npm:js-base64 toUint8Array()                149,056.15  0.0060  0.6527  0.0068  0.0069  0.0107  0.0139  0.0229  ±0.38%   146233
   npm:uint8array-extras base64ToUint8Array()   25,034.52  0.0370  0.9187  0.0407  0.0399  0.0534  0.0612  0.1554  ±0.56%    24600   slowest
```

### Node 24.21

```
 RUN  v5.0.4 /Users/sebastien/github/httpx/packages/encode

 ✓ |bench| bench/base64.bench.ts > Base64 implementations > encode (original size: 11.2 kB) 3789ms
   name                                           hz     min     max    mean     p75     p99    p995    p999     rme  samples
   @httpx/encode node20 (Buffer).encode()  55,508.01  0.0164  0.1656  0.0182  0.0181  0.0274  0.0364  0.0722  ±0.16%    54841   fastest
   @httpx/encode purejs.encode()           36,819.97  0.0248  0.2531  0.0276  0.0280  0.0441  0.0552  0.1190  ±0.21%    36269
   @httpx/encode atob.encode()             24,294.31  0.0379  0.1952  0.0415  0.0420  0.0568  0.0837  0.1022  ±0.15%    24119   slowest
 ✓ |bench| bench/base64.bench.ts > Base64 implementations > decode (original size: 11.2 kB) 3789ms
   name                                           hz     min     max    mean     p75     p99    p995    p999     rme  samples
   @httpx/encode node20 (Buffer).decode()  70,925.58  0.0114  0.6844  0.0146  0.0147  0.0263  0.0349  0.0756  ±0.28%    68562   fastest
   @httpx/encode atob.decode()             35,791.95  0.0226  0.1522  0.0282  0.0289  0.0370  0.0405  0.0767  ±0.13%    35436
   @httpx/encode purejs.decode()           27,049.82  0.0323  0.4097  0.0374  0.0382  0.0524  0.0629  0.1304  ±0.20%    26734   slowest
 ✓ |bench| bench/base64.bench.ts > Base64 implementations > fromUint8Array (original size: 15.2 kB) 4060ms
   name                                                    hz     min     max    mean     p75     p99    p995    p999     rme  samples
   @httpx/encode node20 (Buffer).fromUint8Array()  952,656.27  0.0009  1.3467  0.0011  0.0011  0.0014  0.0015  0.0040  ±0.31%   926515   fastest
   @httpx/encode purejs.fromUint8Array()           104,940.94  0.0090  5.6985  0.0097  0.0095  0.0126  0.0143  0.0287  ±1.33%   102963
   @httpx/encode atob.fromUint8Array()              40,588.96  0.0223  0.2355  0.0249  0.0252  0.0329  0.0436  0.0970  ±0.17%    40171   slowest
 ✓ |bench| bench/base64.bench.ts > Base64 implementations > toUint8Array (original size: 15.2 kB) 3803ms
   name                                                  hz     min     max    mean     p75     p99    p995    p999     rme  samples
   @httpx/encode node20 (Buffer).toUint8Array()  117,978.47  0.0079  4.0689  0.0098  0.0084  0.0439  0.0497  0.0792  ±2.40%   102431   fastest
   @httpx/encode atob.toUint8Array()              52,599.49  0.0177  0.9776  0.0192  0.0189  0.0248  0.0271  0.0445  ±0.23%    52192
   @httpx/encode purejs.toUint8Array()            33,410.52  0.0285  1.0480  0.0303  0.0303  0.0379  0.0413  0.0571  ±0.48%    33043   slowest
 ✓ |bench| bench/base64-compare.bench.ts > Base64 compared to js-base64 and uint8array-extras > encode (original size: 11.2 kB) 3780ms
   name                                           hz     min     max    mean     p75     p99    p995    p999     rme  samples
   @httpx/encode Base64.encode()           56,914.62  0.0163  0.1194  0.0177  0.0177  0.0229  0.0245  0.0409  ±0.10%    56620   fastest
   npm:js-base64 encode()                  24,513.63  0.0378  0.1944  0.0411  0.0412  0.0570  0.0835  0.0982  ±0.14%    24349
   npm:uint8array-extras stringToBase64()  13,468.30  0.0712  0.1812  0.0745  0.0743  0.1001  0.1112  0.1294  ±0.12%    13419   slowest
 ✓ |bench| bench/base64-compare.bench.ts > Base64 compared to js-base64 and uint8array-extras > decode (original size: 11.2 kB) 3773ms
   name                                           hz     min     max    mean     p75     p99    p995    p999     rme  samples
   @httpx/encode Base64.decode()           60,665.45  0.0144  0.1523  0.0166  0.0169  0.0220  0.0239  0.0409  ±0.11%    60243   fastest
   npm:js-base64 decode()                   8,700.54  0.1057  1.4065  0.1165  0.1181  0.1966  0.2323  0.2759  ±0.41%     8588
   npm:uint8array-extras base64ToString()   2,432.52  0.3783  1.1403  0.4165  0.4189  0.8120  0.8841  1.0080  ±0.61%     2402   slowest
 ✓ |bench| bench/base64-compare.bench.ts > Base64 compared to js-base64 and uint8array-extras > fromUint8Array (original size: 15.2 kB) 4041ms
   name                                                hz     min     max    mean     p75     p99    p995    p999     rme  samples
   @httpx/encode Base64.fromUint8Array()       950,730.97  0.0009  0.1338  0.0011  0.0011  0.0014  0.0015  0.0043  ±0.17%   924367   fastest
   npm:js-base64 fromUint8Array()               40,820.63  0.0222  0.7279  0.0249  0.0252  0.0347  0.0445  0.1158  ±0.25%    40223
   npm:uint8array-extras uint8ArrayToBase64()   17,543.22  0.0552  0.1793  0.0573  0.0575  0.0762  0.0847  0.1239  ±0.13%    17456   slowest
 ✓ |bench| bench/base64-compare.bench.ts > Base64 compared to js-base64 and uint8array-extras > toUint8Array (original size: 15.2 kB) 3781ms
   name                                               hz     min     max    mean     p75     p99    p995    p999     rme  samples
   @httpx/encode Base64.toUint8Array()         93,225.01  0.0079  4.0238  0.0120  0.0112  0.0460  0.0521  0.0879  ±1.85%    82992   fastest
   npm:js-base64 toUint8Array()                 8,611.64  0.1090  0.7092  0.1175  0.1177  0.1995  0.2300  0.3528  ±0.35%     8513
   npm:uint8array-extras base64ToUint8Array()   2,506.38  0.3699  1.0500  0.4028  0.4036  0.7218  0.7739  0.9109  ±0.51%     2483   slowest
```

> See [benchmark files](https://github.com/belgattitude/httpx/blob/main/packages/encode/bench) for details.

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/encode/.size-limit.ts)

| Scenario (esm) | Size (brotli) |
| --- | --: |
| `import { Base64 } from '@httpx/encode'` (bun, deno) | ~ 390B |
| `import { Base64 } from '@httpx/encode'` (node) | ~ 970B |
| `import { Base64 } from '@httpx/encode'` (browser) | ~ 1.4kB |
| `import { Base64Uint8Array } from '@httpx/encode/base64/base64.uint8array'` | ~ 390B |
| `import { Base64Atob } from '@httpx/encode/base64/base64.atob'` | ~ 880B |
| `import { Base64Purejs } from '@httpx/encode/base64/base64.purejs'` | ~ 1.1kB |

## Compatibility

| Level | CI | Description |
| --- | --- | --- |
| Node | ✅ | CI for 22.x, 24.x & 26.x. |
| Browser | ✅ | Tested with latest chrome (vitest/playwright) |
| Browserslist | ✅ | [defaults, > 0.28%, last 2 versions, Firefox ESR, not dead, not ios <= 15](https://github.com/belgattitude/httpx/blob/main/packages/encode/.browserslistrc) |
| Bun | ✅ | Tested with latest (at time of writing >= 1.3.3) |
| Edge | ✅ | Ensured on CI with [@vercel/edge-runtime](https://github.com/vercel/edge-runtime). |
| Cloudflare | ✅ | Ensured with @cloudflare/vitest-plugin (see [wrangler.toml](https://github.com/belgattitude/httpx/blob/main/devtools/vitest/wrangler.toml) |
| Typescript | ✅ | TS 5.7 + / [are-the-type-wrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io) checks on CI. |
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
