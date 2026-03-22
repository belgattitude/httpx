# @httpx/memo-intl

Speeds up Intl operations up to 40x. LRU-based memoizer for [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat),[Intl.DateFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) and other Intl constructors.
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


 ✓ bench/m-intl.date-formatter.bench.ts > MIntl DateFormatter benchmarks (1000 instances) 2280ms
     name                                                hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · With memoization `MIntl.DateFormatter()`        319.62  2.2842  8.7999  3.1287  3.2833  5.5124  8.7999  8.7999  ±3.53%      160
   · Without memoization `new Intl.DateFormatter()`  6.9108  134.01  153.85  144.70  150.15  153.85  153.85  153.85  ±9.89%        4

 ✓ bench/m-intl.number-formatter.bench.ts > MIntl NumberFormatter benchmarks (1000 instances) 1428ms
     name                                                   hz      min      max     mean      p75      p99     p995     p999     rme  samples
   · With memoization `MIntl.NumberFormatter()`         630.46   1.3785   3.3911   1.5861   1.7105   2.9305   3.3167   3.3911  ±2.04%      316
   · Without memoization `new Intl.NumberFormatter()`  27.9431  33.2026  39.5232  35.7870  37.1625  39.5232  39.5232  39.5232  ±3.43%       14

 ✓ bench/m-intl.relative-time-format.bench.ts > MIntl RelativeTimeFormat benchmarks (1000 instances) 1289ms
     name                                                      hz      min      max     mean      p75      p99     p995     p999      rme  samples
   · With memoization `MIntl.RelativeTimeFormat()`         655.89   1.1328   6.1182   1.5246   1.7606   2.8280   3.1006   6.1182   ±3.51%      328
   · Without memoization `new Intl.RelativeTimeFormat()`  34.3497  14.3163  41.4047  29.1123  31.7652  41.4047  41.4047  41.4047  ±10.27%       18

 ✓ bench/m-intl.locale.bench.ts > MIntl Locale benchmarks (1000 instances) 1244ms
     name                                           hz     min      max    mean     p75      p99     p995     p999     rme  samples
   · With memoization `MIntl.Locale()`        2,651.83  0.3070   2.9604  0.3771  0.3572   0.9173   1.1504   2.0406  ±2.21%     1327
   · Without memoization `new Intl.Locale()`    124.48  5.8074  12.0320  8.0335  9.2540  12.0320  12.0320  12.0320  ±4.76%       63

 BENCH  Summary

  With memoization `MIntl.DateFormatter()` - bench/m-intl.date-formatter.bench.ts > MIntl DateFormatter benchmarks (1000 instances)
    46.25x faster than Without memoization `new Intl.DateFormatter()`

  With memoization `MIntl.Locale()` - bench/m-intl.locale.bench.ts > MIntl Locale benchmarks (1000 instances)
    21.30x faster than Without memoization `new Intl.Locale()`

  With memoization `MIntl.NumberFormatter()` - bench/m-intl.number-formatter.bench.ts > MIntl NumberFormatter benchmarks (1000 instances)
    22.56x faster than Without memoization `new Intl.NumberFormatter()`

  With memoization `MIntl.RelativeTimeFormat()` - bench/m-intl.relative-time-format.bench.ts > MIntl RelativeTimeFormat benchmarks (1000 instances)
    19.09x faster than Without memoization `new Intl.RelativeTimeFormat()`
```

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/memo-intl/.size-limit.ts)

| Scenario                                  | Size with deps (compressed) |
| ----------------------------------------- | --------------------------: |
| `import { MIntl } from '@httpx/memo-intl' |                      ~ 790B |

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
