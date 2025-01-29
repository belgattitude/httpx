# @httpx/memo-intl

LRU-based memoizer for [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) 
and [Intl.DateFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) constructors.

[![npm](https://img.shields.io/npm/v/@httpx/memo-intl?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/memo-intl)
[![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/memo-intl/CHANGELOG.md)
[![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-memo-intl-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fmemo-intl)
[![bundles](https://img.shields.io/static/v1?label=&message=cjs|esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/memo-intl/.size-limit.cjs)
[![node](https://img.shields.io/static/v1?label=Node&message=18%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
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

### MIntl.NumberFormat

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

### MIntl.DateTimeFormat

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

## Benchmarks

Performance is monitored with [codspeed.io](https://codspeed.io/belgattitude/httpx).

[![CodSpeed Badge](https://img.shields.io/endpoint?url=https://codspeed.io/badge.json)](https://codspeed.io/belgattitude/httpx)


See [bench](https://github.com/belgattitude/httpx/blob/main/packages/memo-intl/bench) for details. 

```
 RUN  v3.0.4 /home/sebastien/github/httpx/packages/memo-intl


 ✓ bench/m-intl.number-formatter.bench.ts > MIntl NumberFormatter benchmarks 9266ms
     name                                                   hz      min      max     mean      p75      p99     p995     p999     rme  samples
   · With memoization `MIntl.NumberFormatter()`        61.4100  16.2165  16.3436  16.2840  16.2996  16.3436  16.3436  16.3436  ±0.18%       10   fastest
   · Without memoization `new Intl.NumberFormatter()`   1.9086   495.64   548.86   523.95   534.82   548.86   548.86   548.86  ±2.22%       10

 ✓ bench/m-intl.date-formatter.bench.ts > MIntl DateFormatter benchmarks 2002ms
     name                                                hz      min     max    mean     p75     p99    p995    p999      rme  samples
   · With memoization `MIntl.DateFormatter()`        336.49   2.9111  3.1260  2.9718  2.9825  3.1260  3.1260  3.1260   ±1.57%       10   fastest
   · Without memoization `new Intl.DateFormatter()`  9.4553  91.5618  159.43  105.76  107.41  159.43  159.43  159.43  ±13.45%       10

 BENCH  Summary

  With memoization `MIntl.DateFormatter()` - bench/m-intl.date-formatter.bench.ts > MIntl DateFormatter benchmarks
    35.59x faster than Without memoization `new Intl.DateFormatter()`

  With memoization `MIntl.NumberFormatter()` - bench/m-intl.number-formatter.bench.ts > MIntl NumberFormatter benchmarks
    32.18x faster than Without memoization `new Intl.NumberFormatter()`

```

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/memo-intl/.size-limit.cjs)

| Scenario                                       | Size with deps (compressed) |
|------------------------------------------------|----------------------------:|
| `import { MIntl } from '@httpx/memo-intl'      |                      ~ 900B |

> Note that per-se the library weights less than 300 bytes, the size limit accounts for the @httpx/lru dependency.
> For CJS usage (not recommended) track the size on [bundlephobia](https://bundlephobia.com/package/@httpx/memo-intl@latest).

## Compatibility

| Level        | CI | Description                                                                                                                                                                                                                                                                                                                                                  |
|--------------|----|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|  
| Node         | ✅  | CI for 18.x, 20.x & 22.x.                                                                                                                                                                                                                                                                                                                                    |
| Browser      | ✅  | Tested with latest chrome (vitest/playwright)                                                                                                                                                                                                                                                                                                                |
| Browsers   | ✅  | [> 94%](https://browserslist.dev/?q=ZGVmYXVsdHMsIGNocm9tZSA%2BPSA5NixmaXJlZm94ID49IDkwLGVkZ2UgPj0gOTEsc2FmYXJpID49IDE0LGlvcyA%2BPSAxNCxvcGVyYSA%2BPSA5MA%3D%3D) on 01/2025. Mins to [defaults, chrome >= 96,firefox >= 90,edge >= 91,safari >= 14,ios >= 14,opera >= 90](https://github.com/belgattitude/httpx/blob/main/packages/memo-intl/.browserslistrc) |
| Edge         | ✅  | Ensured on CI with [@vercel/edge-runtime](https://github.com/vercel/edge-runtime).                                                                                                                                                                                                                                                                           | 
| Cloudflare   | ✅  | Ensured with @cloudflare/vitest-pool-workers (see [wrangler.toml](https://github.com/belgattitude/httpx/blob/main/devtools/vitest/wrangler.toml)                                                                                                                                                                                                             | 
| Typescript | ✅  | TS 5.0 + / [are-the-type-wrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io) checks on CI.                                                                                                                                                                                                                                                |
| ES2022     | ✅  | Dist files checked with [es-check](https://github.com/yowainwright/es-check)                                                                                                                                                                                                                                                                                 |
| Performance| ✅  | Monitored with with [codspeed.io](https://codspeed.io/belgattitude/httpx)                                                                                                                                                                                                                                                                                    |

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
