# @httpx/xcache

[![npm](https://img.shields.io/npm/v/@httpx/xcache?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/xcache)
[![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/xcache/CHANGELOG.md)
[![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-xcache-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fxcache)
[![bundles](https://img.shields.io/static/v1?label=&message=cjs|esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/xcache/.size-limit.cjs)
[![node](https://img.shields.io/static/v1?label=Node&message=20%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![browserslist](https://img.shields.io/static/v1?label=Browser&message=%3E96%25&logo=googlechrome&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![downloads](https://img.shields.io/npm/dm/@httpx/xcache?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/xcache)
[![license](https://img.shields.io/npm/l/@httpx/xcache?style=for-the-badge&labelColor=444)](https://github.com/belgattitude/httpx/blob/main/LICENSE)

In memory cache utility

## Install

```bash
$ npm install @httpx/xcache
$ yarn add @httpx/xcache
$ pnpm add @httpx/xcache
```

## Features

- 📐&nbsp; Lightweight (starts at [~800B](#bundle-size))
- 🛡️&nbsp; Tested on [node 20-24, bun, browser, cloudflare workers and runtime/edge](#compatibility).
- 🗝️&nbsp; Available in ESM and CJS formats.

## Documentation

## Simple usage

```typescript
import { XMemCache, TimeLruCache } from "@httpx/xcache";

const xMemCache = new XMemCache({
  lru: new TimeLruCache({ maxSize: 50, defaultTTL: 60_000 }),
  namespace: "default",
});

const fetchSmth = async (params: { id: number }) => {
  return { id: params.id, data: `Data for ${params.id}` };
};

const params = { id: 1 };

const { data } = await xMemCache.runAsync({
  key: ["/api/data", params],
  fn: () => fetchSmth(params),
});

// data: { id: 1, data: 'Data for 1' }
```

## With compression

You can use compression to reduce the size of the cached data. The library supports `gzip` compression algorithm
To be able to serialize and deserialize the data, you can use adapters like `DevalueSerializer`,
`SuperjsonSerializer` or `JsonSerializer`.

```typescript
import {
  XMemCache,
  TimeLruCache,
  CacheCompress,
  SuperjsonSerializer,
} from "@httpx/xcache";

const xMemCache = new XMemCache({
  lru: new TimeLruCache({ maxSize: 50, defaultTTL: 120_000 }),

  compressor: new CacheCompress({
    // To enable compression the data needs to be serialized
    // Choose between SuperJsonSerializer, DevalueSerializer, JsonSerializer
    serializer: new SuperjsonSerializer(),
    algorithm: "gzip", // or 'deflate'

    // Skip compression if the achieved compression ratio is less than
    // the provided ratio. 1.3 means that the compression will be skipped
    // if the ratio does not give at least 30% memory reduction
    // @default 1.3
    minimumRatio: 1.3,

    // Skip compression if the result is a string shorter than 1000 characters
    // @default 1000
    minimumStringLength: 1000,

    // Skip compression if the achieved byte saving is less than 16 KB
    // @default 16_384
    minimumByteSaving: 16_384,
  }),
});

const fetchThings = async (params: { name: string }) => {
  return {
    message: `Hello ${params.name}`,
    bigint: BigInt("1234567890123456789012345678901234567890"),
    date: new Date(),
  };
};

// Params will be hashed through @httpx/stable-hash
const params = { name: "cool", createdAt: new Date() };

const { data } = await xMemCache.runAsync({
  key: ["/api/data", params],
  fn: () => fetchThings(params),
});
```

## Benchmarks

> Performance is continuously monitored thanks to [codspeed.io](https://codspeed.io/belgattitude/httpx).
>
> [![CodSpeed Badge](https://img.shields.io/endpoint?url=https://codspeed.io/badge.json)](https://codspeed.io/belgattitude/httpx)

```
RUN  v4.1.10 /home/sebastien/github/httpx/packages/xcache


 ✓ bench/x-mem-cache.bench.ts > XMemCache benchmarks with 46.7 MB 86155ms
     name                                   hz       min       max      mean       p75       p99      p995      p999      rme  samples
   · original function                  2.4964    399.38    401.63    400.57    400.76    401.63    401.63    401.63   ±0.10%       10
   · with cache (just lru)        2,294,091.67    0.0002   84.3230    0.0004    0.0003    0.0013    0.0020    0.0107  ±20.70%  1835274
   · with cache                     390,817.38    0.0016    1.4606    0.0026    0.0029    0.0102    0.0137    0.0418   ±0.72%   312654
   · cache with json + gzip             0.5537  1,540.58  2,759.51  1,806.19  1,829.18  2,759.51  2,759.51  2,759.51  ±14.17%       10
   · cache with superjson + gzip        0.5962  1,549.09  1,801.40  1,677.38  1,712.39  1,801.40  1,801.40  1,801.40   ±3.30%       10
   · cache with devalue + gzip          0.3159  2,935.63  3,741.50  3,165.86  3,232.90  3,741.50  3,741.50  3,741.50   ±5.42%       10

 ✓ bench/serializer.bench.ts > Serializer benchmarks with json 2067ms
     name                                           hz      min      max     mean      p75      p99     p995     p999      rme  samples
   · json.serialize(4.52 MB) - native types    18.0842  42.1456  83.8929  55.2970  68.4269  83.8929  83.8929  83.8929  ±13.05%       15
   · json.deserialize(4.52 MB) - native types  40.4526  18.6044  48.0737  24.7203  27.3071  48.0737  48.0737  48.0737  ±10.66%       33

 ✓ bench/serializer.bench.ts > Serializer benchmarks with devalue 3937ms
     name                                              hz      min      max     mean      p75      p99     p995     p999      rme  samples
   · devalue.serialize(5.66 MB) - native types     4.5440   184.85   253.06   220.07   242.84   253.06   253.06   253.06   ±7.95%       10
   · devalue.deserialize(5.66 MB) - native types  17.0238  44.3678  93.3459  58.7412  69.0345  93.3459  93.3459  93.3459  ±14.46%       14

 ✓ bench/serializer.bench.ts > Serializer benchmarks with superjson 4869ms
     name                                                hz      min      max     mean      p75      p99     p995     p999     rme  samples
   · superjson.serialize(4.52 MB) - native types     3.5745   243.53   319.38   279.76   295.14   319.38   319.38   319.38  ±6.37%       10
   · superjson.deserialize(4.52 MB) - native types  39.4088  20.8105  31.3273  25.3751  26.5762  31.3273  31.3273  31.3273  ±3.81%       32

 ✓ bench/serializer.bench.ts > Serializer benchmarks with devalue 8367ms
     name                                               hz     min     max    mean     p75     p99    p995    p999      rme  samples
   · devalue.serialize(11.6 MB) - extended types    2.0349  424.91  621.70  491.43  524.64  621.70  621.70  621.70   ±8.50%       10
   · devalue.deserialize(11.6 MB) - extended types  6.8920  115.88  265.67  145.10  145.37  265.67  265.67  265.67  ±21.64%       10

 ✓ bench/serializer.bench.ts > Serializer benchmarks with superjson 33460ms
     name                                                 hz       min       max      mean       p75       p99      p995      p999     rme  samples
   · superjson.serialize(16.8 MB) - extended types    0.5405  1,655.40  2,145.28  1,850.07  1,933.58  2,145.28  2,145.28  2,145.28  ±5.81%       10
   · superjson.deserialize(16.8 MB) - extended types  1.3657    664.21    845.49    732.23    761.01    845.49    845.49    845.49  ±5.54%       10

 ✓ bench/cache-key.bench.ts > genCacheKey benches 1004ms
     name                       hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · original function  184,243.15  0.0040  3.8025  0.0054  0.0046  0.0181  0.0296  0.0733  ±1.16%   147395

 BENCH  Summary

  original function - bench/cache-key.bench.ts > genCacheKey benches

  json.deserialize(4.52 MB) - native types - bench/serializer.bench.ts > Serializer benchmarks with json
    2.24x faster than json.serialize(4.52 MB) - native types

  devalue.deserialize(5.66 MB) - native types - bench/serializer.bench.ts > Serializer benchmarks with devalue
    3.75x faster than devalue.serialize(5.66 MB) - native types

  superjson.deserialize(4.52 MB) - native types - bench/serializer.bench.ts > Serializer benchmarks with superjson
    11.03x faster than superjson.serialize(4.52 MB) - native types

  devalue.deserialize(11.6 MB) - extended types - bench/serializer.bench.ts > Serializer benchmarks with devalue
    3.39x faster than devalue.serialize(11.6 MB) - extended types

  superjson.deserialize(16.8 MB) - extended types - bench/serializer.bench.ts > Serializer benchmarks with superjson
    2.53x faster than superjson.serialize(16.8 MB) - extended types

  with cache (just lru) - bench/x-mem-cache.bench.ts > XMemCache benchmarks with 46.7 MB
    5.87x faster than with cache
    918948.19x faster than original function
    3848070.34x faster than cache with superjson + gzip
    4143570.97x faster than cache with json + gzip
    7262773.77x faster than cache with devalue + gzip
```

> See [benchmark file](https://github.com/belgattitude/httpx/blob/main/packages/xcache/bench) for details.

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/xcache/.size-limit.ts)

| Scenario (esm)                             | Size (compressed) |
| ------------------------------------------ | ----------------: |
| `import { XMemCache } from '@httpx/xcache` |            ~ 800B |

> For CJS usage (not recommended) track the size on [bundlephobia](https://bundlephobia.com/package/@httpx/xcache@latest).

## Compatibility

| Level        | CI  | Description                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------ | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Node         | ✅  | CI for 20.x, 22.x, 24.x & 26.x.                                                                                                                                                                                                                                                                                                                                                             |
| Browser      | ✅  | Tested with latest chrome (vitest/playwright)                                                                                                                                                                                                                                                                                                                                               |
| Browserslist | ✅  | [> 95%](https://browserslist.dev/?q=ZGVmYXVsdHMsIGNocm9tZSA%2BPSA5NiwgZmlyZWZveCA%2BPSAxMDUsIGVkZ2UgPj0gMTEzLCBzYWZhcmkgPj0gMTUsIGlvcyA%2BPSAxNSwgb3BlcmEgPj0gMTAzLCBub3QgZGVhZA%3D%3D) on 01/2025. [defaults, chrome >= 96, firefox >= 105, edge >= 113, safari >= 15, ios >= 15, opera >= 103, not dead](https://github.com/belgattitude/httpx/blob/main/packages/xcache/.browserslistrc) |
| Bun          | ✅  | Tested with latest (at time of writing >= 1.3.3)                                                                                                                                                                                                                                                                                                                                            |
| Edge         | ✅  | Ensured on CI with [@vercel/edge-runtime](https://github.com/vercel/edge-runtime).                                                                                                                                                                                                                                                                                                          |
| Cloudflare   | ✅  | Ensured with @cloudflare/vitest-pool-workers (see [wrangler.toml](https://github.com/belgattitude/httpx/blob/main/devtools/vitest/wrangler.toml)                                                                                                                                                                                                                                            |
| Typescript   | ✅  | TS 5.0 + / [are-the-type-wrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io) checks on CI.                                                                                                                                                                                                                                                                               |
| ES2022       | ✅  | Dist files checked with [es-check](https://github.com/yowainwright/es-check)                                                                                                                                                                                                                                                                                                                |
| Performance  | ✅  | Monitored with [codspeed.io](https://codspeed.io/belgattitude/httpx)                                                                                                                                                                                                                                                                                                                        |

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
