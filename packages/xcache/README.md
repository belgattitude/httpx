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
 RUN  v4.1.0 /home/sebastien/github/httpx/packages/xcache


 ✓ bench/x-mem-cache.bench.ts > XMemCache benchmarks with 46.7 MB 64878ms
     name                                   hz       min       max      mean       p75       p99      p995      p999     rme  samples
   · original function                  2.4955    400.41    401.00    400.73    400.89    401.00    401.00    401.00  ±0.03%       10
   · with cache (just lru)        5,291,610.29    0.0001    6.1445    0.0002    0.0002    0.0004    0.0007    0.0031  ±2.15%  4233289
   · with cache                     513,034.43    0.0013    2.8092    0.0019    0.0020    0.0055    0.0085    0.0366  ±1.24%   410428
   · cache with json + gzip             0.8131  1,161.82  1,382.36  1,229.84  1,253.09  1,382.36  1,382.36  1,382.36  ±3.54%       10
   · cache with superjson + gzip        0.8313  1,128.63  1,376.68  1,202.91  1,222.47  1,376.68  1,376.68  1,376.68  ±4.08%       10
   · cache with devalue + gzip          0.4417  2,142.59  2,467.50  2,264.21  2,375.01  2,467.50  2,467.50  2,467.50  ±3.48%       10

 ✓ bench/serializer.bench.ts > Serializer benchmarks with json 1924ms
     name                                           hz      min      max     mean      p75      p99     p995     p999      rme  samples
   · json.serialize(4.52 MB) - native types    34.7313  18.3491   114.08  28.7925  30.9104   114.08   114.08   114.08  ±28.57%       28
   · json.deserialize(4.52 MB) - native types  61.1447  14.0582  25.3669  16.3547  17.5522  25.3669  25.3669  25.3669   ±3.67%       49

 ✓ bench/serializer.bench.ts > Serializer benchmarks with devalue 3548ms
     name                                              hz      min      max     mean      p75      p99     p995     p999     rme  samples
   · devalue.serialize(5.66 MB) - native types     5.1668   176.95   244.94   193.54   193.85   244.94   244.94   244.94  ±7.04%       10
   · devalue.deserialize(5.66 MB) - native types  28.5541  29.7521  50.5638  35.0213  39.9162  50.5638  50.5638  50.5638  ±7.47%       23

 ✓ bench/serializer.bench.ts > Serializer benchmarks with superjson 3521ms
     name                                                hz      min      max     mean      p75      p99     p995     p999      rme  samples
   · superjson.serialize(4.52 MB) - native types     5.0457   155.96   258.63   198.19   207.44   258.63   258.63   258.63  ±12.33%       10
   · superjson.deserialize(4.52 MB) - native types  64.9085  14.0191  20.0136  15.4063  15.4649  20.0136  20.0136  20.0136   ±2.51%       52

 ✓ bench/serializer.bench.ts > Serializer benchmarks with devalue 7846ms
     name                                               hz      min     max    mean     p75     p99    p995    p999      rme  samples
   · devalue.serialize(11.6 MB) - extended types    2.0381   419.75  569.72  490.66  551.97  569.72  569.72  569.72   ±8.16%       10
   · devalue.deserialize(11.6 MB) - extended types  8.6823  77.6905  197.99  115.18  124.29  197.99  197.99  197.99  ±20.73%       10

 ✓ bench/serializer.bench.ts > Serializer benchmarks with superjson 24993ms
     name                                                 hz       min       max      mean       p75       p99      p995      p999      rme  samples
   · superjson.serialize(16.8 MB) - extended types    0.7203  1,165.80  2,116.25  1,388.25  1,382.20  2,116.25  2,116.25  2,116.25  ±13.84%       10
   · superjson.deserialize(16.8 MB) - extended types  1.7432    476.36    742.18    573.66    599.53    742.18    742.18    742.18  ±11.37%       10

 ✓ bench/cache-key.bench.ts > genCacheKey benches 1020ms
     name                       hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · original function  250,201.57  0.0031  1.0082  0.0040  0.0035  0.0122  0.0215  0.0540  ±0.78%   200162

 BENCH  Summary

  original function - bench/cache-key.bench.ts > genCacheKey benches

  json.deserialize(4.52 MB) - native types - bench/serializer.bench.ts > Serializer benchmarks with json
    1.76x faster than json.serialize(4.52 MB) - native types

  devalue.deserialize(5.66 MB) - native types - bench/serializer.bench.ts > Serializer benchmarks with devalue
    5.53x faster than devalue.serialize(5.66 MB) - native types

  superjson.deserialize(4.52 MB) - native types - bench/serializer.bench.ts > Serializer benchmarks with superjson
    12.86x faster than superjson.serialize(4.52 MB) - native types

  devalue.deserialize(11.6 MB) - extended types - bench/serializer.bench.ts > Serializer benchmarks with devalue
    4.26x faster than devalue.serialize(11.6 MB) - extended types

  superjson.deserialize(16.8 MB) - extended types - bench/serializer.bench.ts > Serializer benchmarks with superjson
    2.42x faster than superjson.serialize(16.8 MB) - extended types

  with cache (just lru) - bench/x-mem-cache.bench.ts > XMemCache benchmarks with 46.7 MB
    10.31x faster than with cache
    2120485.35x faster than original function
    6365308.96x faster than cache with superjson + gzip
    6507834.98x faster than cache with json + gzip
    11981322.35x faster than cache with devalue + gzip

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
| Node         | ✅  | CI for 20.x, 22.x, 24.x & 25.x.                                                                                                                                                                                                                                                                                                                                                             |
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
