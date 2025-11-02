# @httpx/memo-intl

LRU-based memoizer for [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat),[Intl.DateFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) and other Intl constructors.
Speeds up Intl operations up to 30x.

[![npm](https://img.shields.io/npm/v/@httpx/memo-intl?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/memo-intl)
[![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/memo-intl/CHANGELOG.md)
[![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-memo-intl-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fmemo-intl)
[![bundles](https://img.shields.io/static/v1?label=&message=cjs|esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/memo-intl/.size-limit.cjs)
[![node](https://img.shields.io/static/v1?label=Node&message=20%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![browserslist](https://img.shields.io/static/v1?label=Browser&message=%3E96%25&logo=googlechrome&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![size](https://img.shields.io/bundlephobia/minzip/@httpx/memo-intl@latest?label=Max&style=for-the-badge&labelColor=444&color=informational)](https://bundlephobia.com/package/@httpx/memo-intl@latest)
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
- 👉&nbsp; Up to 30x faster than non-memoized Intl constructors.
- 👉&nbsp; Decrease memory usage, unwanted memory leaks and garbage collection pressure.
- 👉&nbsp; Max out 50 cache instances by default with [@httpx/lru](https://github.com/belgattitude/httpx/tree/main/packages/lru#readme).
- 👉&nbsp; Lightweight. [Node, browser and edge support](#compatibility).

## Documentation

👉 [Official website](https://belgattitude.github.io/httpx/memo-intl) or [Github Readme](https://github.com/belgattitude/httpx/tree/main/packages/memo-intl#readme)

## Usage

### NumberFormat

[MDN: Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)

```typescript
import { MIntl } from '@httpx/memo-intl';

// Notice: `new Intl.NumberFormat` vs `MIntl.NumberFormat`
const formattedPrice = MIntl.NumberFormat('fr-FR', {
   style: 'currency',
   currency: 'EUR',
   notation: 'compact',
   minimumFractionDigits: 2,
   maximumFractionDigits: 2,
}).format(row.price);
```


### DateTimeFormat

[MDN: Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)


```typescript
import { MIntl } from '@httpx/memo-intl';

// Notice: `new Intl.DateTimeFormat` vs `MIntl.DateTimeFormat
const formatter = MIntl.DateTimeFormat('fr-FR', {
    dateStyle: 'full',
    timeStyle: 'full',
    timeZone: 'UTC'
});
const date = Date.parse('2024-05-29T07:42:43.230Z');
expect(formatter.format(date)).toBe(
    'mercredi 29 mai 2024 à 07:42:43 temps universel coordonné'
);
expectTypeOf(formatter).toEqualTypeOf<Intl.DateTimeFormat>();
```


### Locale

[MDN: Intl.Locale](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)

```typescript
import { MIntl } from '@httpx/memo-intl';

const locale = MIntl.Locale('fr-FR', { caseFirst: 'lower' });
console.log(locale.language); // "fr"
```

### Collator

[MDN: Intl.Collator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator)

```typescript
import { MIntl } from '@httpx/memo-intl';

const collator = MIntl.Collator('de', { sensitivity: 'base' });
console.log(['Z', 'a', 'z', 'ä'].sort(collator.compare));
```

### RelativeTimeFormat

[MDN: Intl.RelativeTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat)

```typescript
import { MIntl } from '@httpx/memo-intl';

const rtf = MIntl.RelativeTimeFormat('en', { style: 'short' });
console.log(rtf.format(3, 'month')); // e.g. "in 3 mos."
```

### ListFormat

[MDN: Intl.ListFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/ListFormat)

```typescript
import { MIntl } from '@httpx/memo-intl';

const listFormatter = MIntl.ListFormat('en', {
  style: 'long',
  type: 'conjunction',
});
console.log(listFormatter.format(['Red', 'Green', 'Blue']));
```

### PluralRules

[MDN: Intl.PluralRules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules)

```typescript
import { MIntl } from '@httpx/memo-intl';

const pr = MIntl.PluralRules('en-US', { type: 'cardinal' });
console.log(pr.select(1)); // "one"
```

### Segmenter

[MDN: Intl.Segmenter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)

```typescript
import { MIntl } from '@httpx/memo-intl';

const segmenter = MIntl.Segmenter('fr', { granularity: 'word' });
const result = segmenter.segment('Bonjour le monde');
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
 RUN  v3.1.1 /home/sebastien/github/httpx/packages/memo-intl


 ✓ bench/m-intl.number-formatter.bench.ts > MIntl NumberFormatter benchmarks (1000 instances) 509ms
     name                                                   hz      min      max     mean      p75      p99     p995     p999      rme  samples
   · With memoization `MIntl.NumberFormatter()`         609.03   1.0427   3.0282   1.6419   2.3901   3.0282   3.0282   3.0282  ±31.97%       10   fastest
   · Without memoization `new Intl.NumberFormatter()`  46.8494  20.1793  25.8985  21.3450  21.6799  25.8985  25.8985  25.8985   ±5.86%       10

 ✓ bench/m-intl.date-formatter.bench.ts > MIntl DateFormatter benchmarks (1000 instances) 1042ms
     name                                                 hz      min      max     mean      p75      p99     p995     p999      rme  samples
   · With memoization `MIntl.DateFormatter()`         714.18   1.2713   1.6793   1.4002   1.5520   1.6793   1.6793   1.6793   ±7.71%       10   fastest
   · Without memoization `new Intl.DateFormatter()`  19.2053  38.3342  85.2885  52.0689  56.6698  85.2885  85.2885  85.2885  ±19.79%       10

 ✓ bench/m-intl.relative-time-format.bench.ts > MIntl RelativeTimeFormat benchmarks (1000 instances) 366ms
     name                                                       hz     min      max     mean      p75      p99     p995     p999      rme  samples
   · With memoization `MIntl.RelativeTimeFormat()`        1,148.10  0.6614   1.2955   0.8710   1.1134   1.2955   1.2955   1.2955  ±18.67%       10   fastest
   · Without memoization `new Intl.RelativeTimeFormat()`   86.5178  8.2824  17.9734  11.5583  16.5455  17.9734  17.9734  17.9734  ±24.10%       10

 ✓ bench/m-intl.locale.bench.ts > MIntl Locale benchmarks (1000 instances)
     name                                           hz     min     max    mean     p75     p99    p995    p999      rme  samples
   · With memoization `MIntl.Locale()`        1,511.86  0.5651  1.0696  0.6614  0.6494  1.0696  1.0696  1.0696  ±16.03%       10   fastest
   · Without memoization `new Intl.Locale()`    300.74  2.9911  3.5926  3.3251  3.4325  3.5926  3.5926  3.5926   ±3.62%       10

 BENCH  Summary

  With memoization `MIntl.DateFormatter()` - bench/m-intl.date-formatter.bench.ts > MIntl DateFormatter benchmarks (1000 instances)
    37.19x faster than Without memoization `new Intl.DateFormatter()`

  With memoization `MIntl.Locale()` - bench/m-intl.locale.bench.ts > MIntl Locale benchmarks (1000 instances)
    5.03x faster than Without memoization `new Intl.Locale()`

  With memoization `MIntl.NumberFormatter()` - bench/m-intl.number-formatter.bench.ts > MIntl NumberFormatter benchmarks (1000 instances)
    13.00x faster than Without memoization `new Intl.NumberFormatter()`

  With memoization `MIntl.RelativeTimeFormat()` - bench/m-intl.relative-time-format.bench.ts > MIntl RelativeTimeFormat benchmarks (1000 instances)
    13.27x faster than Without memoization `new Intl.RelativeTimeFormat()`
```

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/memo-intl/.size-limit.ts)

| Scenario                                       | Size with deps (compressed) |
|------------------------------------------------|----------------------------:|
| `import { MIntl } from '@httpx/memo-intl'      |                      ~ 790B |

> Note that per-se the library weights less than 300 bytes, the size limit accounts for the @httpx/lru dependency.
> For CJS usage (not recommended) track the size on [bundlephobia](https://bundlephobia.com/package/@httpx/memo-intl@latest).

## Compatibility

| Level        | CI | Description                                                                                                                                                                                                                                                                                                                                                                                    |
|--------------|----|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|  
| Node         | ✅   | CI for 20.x, 22.x, 24.x & 25.x.                                                                                                                                                                                                                                                                                                                                                                   |
| Browser      | ✅  | Tested with latest chrome (vitest/playwright)                                                                                                                                                                                                                                                                                                                                                  |
| Browserslist | ✅  | [> 95%](https://browserslist.dev/?q=ZGVmYXVsdHMsIGNocm9tZSA%2BPSA5NiwgZmlyZWZveCA%2BPSAxMDUsIGVkZ2UgPj0gMTEzLCBzYWZhcmkgPj0gMTUsIGlvcyA%2BPSAxNSwgb3BlcmEgPj0gMTAzLCBub3QgZGVhZA%3D%3D) on 01/2025. [defaults, chrome >= 96, firefox >= 105, edge >= 113, safari >= 15, ios >= 15, opera >= 103, not dead](https://github.com/belgattitude/httpx/blob/main/packages/memo-intl/.browserslistrc) |
| Edge         | ✅  | Ensured on CI with [@vercel/edge-runtime](https://github.com/vercel/edge-runtime).                                                                                                                                                                                                                                                                                                             | 
| Cloudflare   | ✅  | Ensured with @cloudflare/vitest-pool-workers (see [wrangler.toml](https://github.com/belgattitude/httpx/blob/main/devtools/vitest/wrangler.toml)                                                                                                                                                                                                                                               | 
| Typescript | ✅  | TS 5.0 + / [are-the-type-wrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io) checks on CI.                                                                                                                                                                                                                                                                                  |
| ES2022     | ✅  | Dist files checked with [es-check](https://github.com/yowainwright/es-check)                                                                                                                                                                                                                                                                                                                   |
| Performance| ✅  | Monitored with with [codspeed.io](https://codspeed.io/belgattitude/httpx)                                                                                                                                                                                                                                                                                                                      |

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
