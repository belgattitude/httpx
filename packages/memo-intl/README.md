# @httpx/memo-intl

Speeds up Intl operations up to 50x (bun) and 40x (node). LRU-based memoizer for [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat),[Intl.DateFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) and other Intl constructors. About 1kb.

[![npm](https://img.shields.io/npm/v/@httpx/memo-intl?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/memo-intl) [![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/memo-intl/CHANGELOG.md) [![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-memo-intl-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fmemo-intl) [![bundles](https://img.shields.io/static/v1?label=&message=esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/memo-intl/.size-limit.ts) [![node](https://img.shields.io/static/v1?label=Node&message=22%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](#compatibility) [![browserslist](https://img.shields.io/static/v1?label=Browser&message=%3E96%25&logo=googlechrome&style=for-the-badge&labelColor=444&color=informational)](#compatibility) [![downloads](https://img.shields.io/npm/dm/@httpx/memo-intl?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/memo-intl) [![license](https://img.shields.io/npm/l/@httpx/memo-intl?style=for-the-badge&labelColor=444)](https://github.com/belgattitude/httpx/blob/main/LICENSE)

## Install

```bash
$ npm install @httpx/memo-intl
$ yarn add @httpx/memo-intl
$ pnpm add @httpx/memo-intl
```

## Features

- 👉&nbsp; Don't re-create the same Intl instance for the same options (memoized).
- 👉&nbsp; Keep the [Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) api untouched. Just replace `new Intl.NumberFormat` by `intl.NumberFormat`...
- 👉&nbsp; Up to 50x faster on bun and 40x on node than non-memoized Intl constructors.
- 👉&nbsp; Decrease memory usage, unwanted memory leaks and garbage collection pressure.
- 👉&nbsp; Max out 50 cache instances by default with [@httpx/lru](https://github.com/belgattitude/httpx/tree/main/packages/lru#readme).
- 👉&nbsp; Lightweight. [Node, bun, browser and edge support](#compatibility).

## Documentation

👉 [Official website](https://belgattitude.github.io/httpx/memo-intl) or [Github Readme](https://github.com/belgattitude/httpx/tree/main/packages/memo-intl#readme)

Upgrading from `MIntl`? See the [UPGRADE](https://github.com/belgattitude/httpx/blob/main/packages/memo-intl/UPGRADE.md) guide.

## Usage

Create a memoized instance once (ie: at module level) and reuse it across your app.

```typescript
import { createMIntl } from "@httpx/memo-intl";

// Options are optional, the LRU cache defaults to 50 entries
export const intl = createMIntl({ lru: { maxSize: 50 } });
```

### NumberFormat

[MDN: Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)

```typescript
// Notice: `new Intl.NumberFormat` vs `intl.NumberFormat`
const formattedPrice = intl
  .NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    notation: "compact",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  .format(row.price);
```

### DateTimeFormat

[MDN: Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)

```typescript
// Notice: `new Intl.DateTimeFormat` vs `intl.DateTimeFormat`
const formatter = intl.DateTimeFormat("fr-FR", {
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
const locale = intl.Locale("fr-FR", { caseFirst: "lower" });
console.log(locale.language); // "fr"
```

### Collator

[MDN: Intl.Collator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator)

```typescript
const collator = intl.Collator("de", { sensitivity: "base" });
console.log(["Z", "a", "z", "ä"].sort(collator.compare));
```

### RelativeTimeFormat

[MDN: Intl.RelativeTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat)

```typescript
const rtf = intl.RelativeTimeFormat("en", { style: "short" });
console.log(rtf.format(3, "month")); // e.g. "in 3 mos."
```

### ListFormat

[MDN: Intl.ListFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/ListFormat)

```typescript
const listFormatter = intl.ListFormat("en", {
  style: "long",
  type: "conjunction",
});
console.log(listFormatter.format(["Red", "Green", "Blue"]));
```

### PluralRules

[MDN: Intl.PluralRules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules)

```typescript
const pr = intl.PluralRules("en-US", { type: "cardinal" });
console.log(pr.select(1)); // "one"
```

### Segmenter

[MDN: Intl.Segmenter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)

```typescript
const segmenter = intl.Segmenter("fr", { granularity: "word" });
const result = segmenter.segment("Bonjour le monde");
console.log([...result].map(({ segment }) => segment));
```

### DisplayNames

[MDN: Intl.DisplayNames](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DisplayNames)

```typescript
const regionNames = intl.DisplayNames("en", { type: "region" });
console.log(regionNames.of("BE")); // "Belgium"
```

### DurationFormat

[MDN: Intl.DurationFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DurationFormat)

> Requires a runtime supporting `Intl.DurationFormat` (Node 23+, Bun, Chrome 129+, Firefox 136+, Safari 16.4+).

```typescript
const formatter = intl.DurationFormat("en", { style: "short" });
console.log(formatter.format({ hours: 1, minutes: 46 })); // "1 hr, 46 min"
```

### Cache

You can clear the cache or check the cache stats.

```typescript
// Clear the cache
intl.cache.clear();

// Check cache stats
console.log(intl.cache.stats());
```

### Memory usage

Cached instances stay in memory until they're evicted from the LRU cache. Most of their memory is native ICU data held outside the JS heap, so it shows up in the process RSS, not in heap snapshots.

Approximate RSS per cached instance, measured with 5000 instances on macOS arm64:

| Constructor        | Node 26.13 | Bun 1.4.4 |
| ------------------ | ---------: | --------: |
| Locale             |    ~0.5 KB |   ~0.5 KB |
| NumberFormat       |      ~1 KB |     ~1 KB |
| Collator           |    ~1.5 KB |   ~1.5 KB |
| PluralRules        |      ~4 KB |     ~5 KB |
| RelativeTimeFormat |      ~8 KB |   ~8.5 KB |
| DateTimeFormat     |     ~30 KB |    ~13 KB |

With the default `maxSize` of 50, the worst case (50 different `DateTimeFormat` options) holds about 1.5 MB. Size the cache for the number of distinct locale/options combinations you actually use: a larger cache that is never filled costs nothing, but every distinct entry stays allocated until evicted.

### Custom and shared instances

Each `createMIntl()` call returns an independent instance with its own LRU cache.

`MIntl` is the default `globalThis`-shared instance. `getOrCreateMIntl` returns that instance when called without arguments. To create additional shared instances, pass a stable name; the first call for a name sets its LRU options, and a later call with different options logs a warning (except when `NODE_ENV` is `production`). The default LRU size is 50.

```typescript
import { getOrCreateMIntl } from "@httpx/memo-intl";

const defaultIntl = getOrCreateMIntl();
const intl = getOrCreateMIntl("my-app", { lru: { maxSize: 200 } });
```

### Usage in libraries

If you publish a library (ie: a UI kit or a date utility) that depends on `@httpx/memo-intl`, don't use `MIntl` or `getOrCreateMIntl()` without a name. Those return the `"default"` instance stored on `globalThis`, which is also the one the app uses. Your formatters would share its LRU slots and evict the app's entries (and the reverse), and a `cache.clear()` on either side would empty both.

Create a private instance instead, sized for the formatters your library actually needs:

```typescript
// my-lib/src/intl.ts
import { createMIntl } from "@httpx/memo-intl";

export const intl = createMIntl({ lru: { maxSize: 10 } });
```

If your library is split into several packages or bundles that should share one cache, use `getOrCreateMIntl` with a name scoped to your package, and pass the same options everywhere:

```typescript
import { getOrCreateMIntl } from "@httpx/memo-intl";

export const intl = getOrCreateMIntl("@my-scope/my-lib", {
  lru: { maxSize: 10 },
});
```

Other recommendations:

- Never call `cache.clear()` on an instance you don't own.
- Keep `maxSize` small: each cached entry stays in memory until evicted, up to ~30 KB for a `DateTimeFormat` (see [Memory usage](#memory-usage)).

## Benchmarks

Performance is monitored with [codspeed.io](https://codspeed.io/belgattitude/httpx).

[![CodSpeed Badge](https://img.shields.io/endpoint?url=https://codspeed.io/badge.json)](https://codspeed.io/belgattitude/httpx)

See [bench](https://github.com/belgattitude/httpx/blob/main/packages/memo-intl/bench) for details.

Each sample formats 1000 rows and asks for a formatter on every row. `hz` is the number of samples per second (higher is better).

| Constructor | Runtime | `intl.X()` (hz) | `new Intl.X()` (hz) | Speedup |
| --- | --- | --: | --: | --: |
| DateTimeFormat | Node 26.13 | 836 | 30.9 | **27x** |
| DateTimeFormat | Bun 1.4.4 | 572 | 12.4 | **46x** |
| NumberFormat | Node 26.13 | 2,101 | 55.3 | **38x** |
| NumberFormat | Bun 1.4.4 | 2,224 | 41.9 | **53x** |
| RelativeTimeFormat | Node 26.13 | 2,466 | 135 | **18x** |
| RelativeTimeFormat | Bun 1.4.4 | 2,665 | 125 | **21x** |
| Locale | Node 26.13 | 8,404 | 362 | **23x** |
| Locale | Bun 1.4.4 | 15,252 | 1,303 | **12x** |

> Measured with `pnpm bench` and `pnpm bench-bun` (vitest 5.1) on macOS (Apple silicon). Results vary by machine.

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/memo-intl/.size-limit.ts)

| Scenario                                  | Size with deps (compressed) |
| ----------------------------------------- | --------------------------: |
| `import { MIntl } from '@httpx/memo-intl' |                    ~ 1.02kB |

> Note that per-se the library weights less than 300 bytes, the size limit accounts for the @httpx/lru dependency.

## Compatibility

| Level | CI | Description |
| --- | --- | --- |
| Node | ✅ | CI for 22.x, 24.x & 26.x. |
| Browser | ✅ | Tested with latest chrome (vitest/playwright) |
| Browserslist | ✅ | [> 95%](https://browserslist.dev/?q=ZGVmYXVsdHMsIGNocm9tZSA%2BPSA5NiwgZmlyZWZveCA%2BPSAxMDUsIGVkZ2UgPj0gMTEzLCBzYWZhcmkgPj0gMTUsIGlvcyA%2BPSAxNSwgb3BlcmEgPj0gMTAzLCBub3QgZGVhZA%3D%3D) on 01/2025. [defaults, chrome >= 96, firefox >= 105, edge >= 113, safari >= 15, ios >= 15, opera >= 103, not dead](https://github.com/belgattitude/httpx/blob/main/packages/memo-intl/.browserslistrc) |
| Bun | ✅ | Tested with latest (at time of writing >= 1.3.3) |
| Edge | ✅ | Ensured on CI with [@vercel/edge-runtime](https://github.com/vercel/edge-runtime). |
| Cloudflare | ✅ | Ensured with @cloudflare/vitest-plugin (see [wrangler.toml](https://github.com/belgattitude/httpx/blob/main/devtools/vitest/wrangler.toml) |
| Typescript | ✅ | TS 5.0 + / [are-the-type-wrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io) checks on CI. |
| ES2022 | ✅ | Dist files checked with [es-check](https://github.com/yowainwright/es-check) |
| Performance | ✅ | Monitored with with [codspeed.io](https://codspeed.io/belgattitude/httpx) |

> For _older_ browsers: most frontend frameworks can transpile the library (ie: [nextjs](https://nextjs.org/docs/app/api-reference/next-config-js/transpilePackages)...)

## Contributors

Contributions are warmly appreciated. Have a look to the [CONTRIBUTING](https://github.com/belgattitude/httpx/blob/main/CONTRIBUTING.md) document.

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

MIT © [belgattitude](https://github.com/belgattitude) and contributors.
