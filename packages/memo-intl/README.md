# @httpx/memo-intl

Speeds up Intl operations up to 50x. LRU-based memoizer for [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat),[Intl.DateFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) and other Intl constructors.
Less than 1kb.

[![npm](https://img.shields.io/npm/v/@httpx/memo-intl?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/memo-intl)
[![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/memo-intl/CHANGELOG.md)
[![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-memo-intl-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fmemo-intl)
[![bundles](https://img.shields.io/static/v1?label=&message=cjs|esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/memo-intl/.size-limit.cjs)
[![node](https://img.shields.io/static/v1?label=Node&message=20%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![browserslist](https://img.shields.io/static/v1?label=Browser&message=%3E96%25&logo=googlechrome&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![downloads](https://img.shields.io/npm/dm/@httpx/memo-intl?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/memo-intl)
[![license](https://img.shields.io/npm/l/@httpx/memo-intl?style=for-the-badge&labelColor=444)](https://github.com/belgattitude/httpx/blob/main/LICENSE)

## Install

```bash
$ npm install @httpx/memo-intl
$ yarn add @httpx/memo-intl
$ pnpm add @httpx/memo-intl
```

## Features

- 👉&nbsp; Don't re-create the same Intl instance for the same options (memoized).
- 👉&nbsp; Keep the [Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) api untouched. Just replace `new Intl.NumberFormat` by `MIntl.NumberFormat`...
- 👉&nbsp; Up to 40x faster than non-memoized Intl constructors.
- 👉&nbsp; Decrease memory usage, unwanted memory leaks and garbage collection pressure.
- 👉&nbsp; Max out 50 cache instances by default with [@httpx/lru](https://github.com/belgattitude/httpx/tree/main/packages/lru#readme).
- 👉&nbsp; Lightweight. [Node, bun, browser and edge support](#compatibility).

## Documentation

👉 [Official website](https://belgattitude.github.io/httpx/memo-intl) or [Github Readme](https://github.com/belgattitude/httpx/tree/main/packages/memo-intl#readme)

## Usage

### NumberFormat

[MDN: Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)

```typescript
import { MIntl } from "@httpx/memo-intl";

// Notice: `new Intl.NumberFormat` vs `MIntl.NumberFormat`
const formattedPrice = MIntl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  notation: "compact",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format(row.price);
```

### DateTimeFormat

[MDN: Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)

```typescript
import { MIntl } from "@httpx/memo-intl";

// Notice: `new Intl.DateTimeFormat` vs `MIntl.DateTimeFormat
const formatter = MIntl.DateTimeFormat("fr-FR", {
  dateStyle: "full",
  timeStyle: "full",
  timeZone: "UTC",
});
const date = Date.parse("2024-05-29T07:42:43.230Z");
expect(formatter.format(date)).toBe(
  "mercredi 29 mai 2024 à 07:42:43 temps universel coordonné"
);
expectTypeOf(formatter).toEqualTypeOf<Intl.DateTimeFormat>();
```

### Locale

[MDN: Intl.Locale](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)

```typescript
import { MIntl } from "@httpx/memo-intl";

const locale = MIntl.Locale("fr-FR", { caseFirst: "lower" });
console.log(locale.language); // "fr"
```

### Collator

[MDN: Intl.Collator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator)

```typescript
import { MIntl } from "@httpx/memo-intl";

const collator = MIntl.Collator("de", { sensitivity: "base" });
console.log(["Z", "a", "z", "ä"].sort(collator.compare));
```

### RelativeTimeFormat

[MDN: Intl.RelativeTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat)

```typescript
import { MIntl } from "@httpx/memo-intl";

const rtf = MIntl.RelativeTimeFormat("en", { style: "short" });
console.log(rtf.format(3, "month")); // e.g. "in 3 mos."
```

### ListFormat

[MDN: Intl.ListFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/ListFormat)

```typescript
import { MIntl } from "@httpx/memo-intl";

const listFormatter = MIntl.ListFormat("en", {
  style: "long",
  type: "conjunction",
});
console.log(listFormatter.format(["Red", "Green", "Blue"]));
```

### PluralRules

[MDN: Intl.PluralRules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules)

```typescript
import { MIntl } from "@httpx/memo-intl";

const pr = MIntl.PluralRules("en-US", { type: "cardinal" });
console.log(pr.select(1)); // "one"
```

### Segmenter

[MDN: Intl.Segmenter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)

```typescript
import { MIntl } from "@httpx/memo-intl";

const segmenter = MIntl.Segmenter("fr", { granularity: "word" });
const result = segmenter.segment("Bonjour le monde");
console.log([...result].map(({ segment }) => segment));
```

### Cache

You can clear the cache or check the cache stats.

```typescript
// Clear the cache
MIntl.cache.clear();

// Check cache stats
console.log(MIntl.cache.stats());
```

## Benchmarks

Performance is monitored with [codspeed.io](https://codspeed.io/belgattitude/httpx).

[![CodSpeed Badge](https://img.shields.io/endpoint?url=https://codspeed.io/badge.json)](https://codspeed.io/belgattitude/httpx)

See [bench](https://github.com/belgattitude/httpx/blob/main/packages/memo-intl/bench) for details.

```
 RUN  v4.1.0 /home/sebastien/github/httpx/packages/memo-intl


 ✓ bench/m-intl.date-formatter.bench.ts > MIntl DateFormatter benchmarks (1000 instances) 1985ms
     name                                                hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · With memoization `MIntl.DateFormatter()`        400.46  2.0947  6.8366  2.4972  2.7550  3.8448  4.8877  6.8366  ±2.92%      201
   · Without memoization `new Intl.DateFormatter()`  7.9472  122.46  128.16  125.83  128.15  128.16  128.16  128.16  ±3.56%        4

 ✓ bench/m-intl.number-formatter.bench.ts > MIntl NumberFormatter benchmarks (1000 instances) 1351ms
     name                                                   hz      min      max     mean      p75      p99     p995     p999     rme  samples
   · With memoization `MIntl.NumberFormatter()`         662.47   1.2588   3.3460   1.5095   1.6116   2.7973   3.1873   3.3460  ±2.44%      332
   · Without memoization `new Intl.NumberFormatter()`  29.7328  30.5401  40.3873  33.6329  34.5215  40.3873  40.3873  40.3873  ±4.93%       15

 ✓ bench/m-intl.relative-time-format.bench.ts > MIntl RelativeTimeFormat benchmarks (1000 instances) 1274ms
     name                                                      hz      min      max     mean      p75      p99     p995     p999     rme  samples
   · With memoization `MIntl.RelativeTimeFormat()`         815.39   1.0436   3.6512   1.2264   1.2974   2.3457   2.3843   3.6512  ±2.26%      408
   · Without memoization `new Intl.RelativeTimeFormat()`  39.4420  23.4202  28.6828  25.3537  25.8205  28.6828  28.6828  28.6828  ±2.66%       20

 ✓ bench/m-intl.locale.bench.ts > MIntl Locale benchmarks (1000 instances) 1244ms
     name                                           hz     min      max    mean     p75      p99     p995     p999     rme  samples
   · With memoization `MIntl.Locale()`        2,935.58  0.2828   4.9438  0.3406  0.3235   0.8030   0.9692   2.1852  ±2.47%     1468
   · Without memoization `new Intl.Locale()`    150.35  5.0975  24.2801  6.6514  6.7613  24.2801  24.2801  24.2801  ±8.06%       78

 BENCH  Summary

  With memoization `MIntl.DateFormatter()` - bench/m-intl.date-formatter.bench.ts > MIntl DateFormatter benchmarks (1000 instances)
    50.39x faster than Without memoization `new Intl.DateFormatter()`

  With memoization `MIntl.Locale()` - bench/m-intl.locale.bench.ts > MIntl Locale benchmarks (1000 instances)
    19.53x faster than Without memoization `new Intl.Locale()`

  With memoization `MIntl.NumberFormatter()` - bench/m-intl.number-formatter.bench.ts > MIntl NumberFormatter benchmarks (1000 instances)
    22.28x faster than Without memoization `new Intl.NumberFormatter()`

  With memoization `MIntl.RelativeTimeFormat()` - bench/m-intl.relative-time-format.bench.ts > MIntl RelativeTimeFormat benchmarks (1000 instances)
    20.67x faster than Without memoization `new Intl.RelativeTimeFormat()`
```

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/memo-intl/.size-limit.ts)

| Scenario                                  | Size with deps (compressed) |
| ----------------------------------------- | --------------------------: |
| `import { MIntl } from '@httpx/memo-intl' |                      ~ 794B |

> Note that per-se the library weights less than 300 bytes, the size limit accounts for the @httpx/lru dependency.

## Compatibility

| Level        | CI  | Description                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------ | --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Node         | ✅  | CI for 20.x, 22.x, 24.x & 25.x.                                                                                                                                                                                                                                                                                                                                                                |
| Browser      | ✅  | Tested with latest chrome (vitest/playwright)                                                                                                                                                                                                                                                                                                                                                  |
| Browserslist | ✅  | [> 95%](https://browserslist.dev/?q=ZGVmYXVsdHMsIGNocm9tZSA%2BPSA5NiwgZmlyZWZveCA%2BPSAxMDUsIGVkZ2UgPj0gMTEzLCBzYWZhcmkgPj0gMTUsIGlvcyA%2BPSAxNSwgb3BlcmEgPj0gMTAzLCBub3QgZGVhZA%3D%3D) on 01/2025. [defaults, chrome >= 96, firefox >= 105, edge >= 113, safari >= 15, ios >= 15, opera >= 103, not dead](https://github.com/belgattitude/httpx/blob/main/packages/memo-intl/.browserslistrc) |
| Bun          | ✅  | Tested with latest (at time of writing >= 1.3.3)                                                                                                                                                                                                                                                                                                                                               |
| Edge         | ✅  | Ensured on CI with [@vercel/edge-runtime](https://github.com/vercel/edge-runtime).                                                                                                                                                                                                                                                                                                             |
| Cloudflare   | ✅  | Ensured with @cloudflare/vitest-pool-workers (see [wrangler.toml](https://github.com/belgattitude/httpx/blob/main/devtools/vitest/wrangler.toml)                                                                                                                                                                                                                                               |
| Typescript   | ✅  | TS 5.0 + / [are-the-type-wrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io) checks on CI.                                                                                                                                                                                                                                                                                  |
| ES2022       | ✅  | Dist files checked with [es-check](https://github.com/yowainwright/es-check)                                                                                                                                                                                                                                                                                                                   |
| Performance  | ✅  | Monitored with with [codspeed.io](https://codspeed.io/belgattitude/httpx)                                                                                                                                                                                                                                                                                                                      |

> For _older_ browsers: most frontend frameworks can transpile the library (ie: [nextjs](https://nextjs.org/docs/app/api-reference/next-config-js/transpilePackages)...)

## Contributors

Contributions are warmly appreciated. Have a look to the [CONTRIBUTING](https://github.com/belgattitude/httpx/blob/main/CONTRIBUTING.md) document.

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

MIT © [belgattitude](https://github.com/belgattitude) and contributors.
