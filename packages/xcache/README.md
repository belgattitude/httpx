# @httpx/xcache

[![npm](https://img.shields.io/npm/v/@httpx/xcache?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/xcache) [![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/xcache/CHANGELOG.md) [![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-xcache-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fxcache) [![bundles](https://img.shields.io/static/v1?label=&message=esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/xcache/.size-limit.ts) [![node](https://img.shields.io/static/v1?label=Node&message=22%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](#compatibility) [![browserslist](https://img.shields.io/static/v1?label=Browser&message=%3E96%25&logo=googlechrome&style=for-the-badge&labelColor=444&color=informational)](#compatibility) [![downloads](https://img.shields.io/npm/dm/@httpx/xcache?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/xcache) [![license](https://img.shields.io/npm/l/@httpx/xcache?style=for-the-badge&labelColor=444)](https://github.com/belgattitude/httpx/blob/main/LICENSE)

In memory cache utility

## Install

```bash
$ npm install @httpx/xcache
$ yarn add @httpx/xcache
$ pnpm add @httpx/xcache
```

## Features

- 📐&nbsp; Lightweight (starts at [~800B](#bundle-size))
- 🛡️&nbsp; Tested on [node 22-26, bun, browser and cloudflare workers](#compatibility).
- 🗝️&nbsp; Available in ESM.

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

You can use compression to reduce the size of the cached data. The library supports `gzip` and `deflate` compression algorithms. To be able to serialize and deserialize the data, you can use adapters like `DevalueSerializer`, `SuperjsonSerializer` or `JsonSerializer`.

> [!NOTE]
> A serializer is only needed with compression. Without a compressor, `XMemCache` keeps the values as-is in the LRU (no serialization cost, all types supported, same instance returned on each hit). See [choosing a serializer](#choosing-a-serializer) for the memory gains.

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

    // Compressed bytes are kept as Uint8Array ("binary"), use "base64"
    // or "base64_urlsafe" if a string is required (~33% larger)
    // @default "binary"
    encoding: "binary",
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

## Choosing a serializer

A serializer is only used when compression is enabled. Without a compressor, values are stored as live objects in memory, so no serializer is involved.

### Memory gains

Estimated memory used by one cached entry (~11k rows, Node 26.12.0, V8 heap for live objects, gzip with `encoding: "binary"`):

| Data | No compression (live objects) | json | superjson | superjson+dedupe | devalue |
| --- | --: | --: | --: | --: | --: |
| Native types | 2.01 MB | 🥇 90 kB (-96%) | 🥇 90 kB (-96%) | 🥇 90 kB (-96%) | 214 kB (-89%) |
| Extended types (Date, BigInt...) | 3.95 MB | n/a | 322 kB (-92%) | 🥇 286 kB (-93%) | 359 kB (-91%) |
| Repeated objects (10 shared refs) | 973 kB | 65 kB (-93%) ¹ | 121 kB (-88%) | 🥇 83 kB (-91%) | 136 kB (-86%) |

¹ json does not preserve shared references: each row gets its own copy once deserialized.

Compression trades CPU for memory: each cache hit pays gunzip + deserialize (see below) and returns a new copy of the data. With `encoding: "base64"`, add ~33% to the compressed sizes.

### Performance and size

Measured on Node 26.12.0 with ~11k rows (see [benchmarks](#benchmarks)), gzip sizes with `encoding: "binary"`. Bun 1.4.3 shows the same ranking, with faster json and devalue.

|  | json | superjson | superjson+dedupe | devalue |
| --- | --- | --- | --- | --- |
| **Recommended for** | JSON-safe data (default choice) | Extended types, read-heavy caches | Extended types with repeated objects, using compression | Extended types, write-heavy caches |
| Extended types (Date, BigInt, Map...) | ❌ | ✅ | ✅ | ✅ |
| Preserves shared references | ❌ (duplicated) | ❌ (duplicated) | ✅ | ✅ |
| _Native types (974 kB json)_ |  |  |  |  |
| Serialize | 🥇 1.6 ms | 12.3 ms (~8x slower) | 12.2 ms (~8x slower) | 9.0 ms (~6x slower) |
| Deserialize | 🥇 1.2 ms | 🥇 1.1 ms | 🥇 1.1 ms | 3.0 ms |
| Size raw / gzip | 🥇 974 kB / 90 kB | 🥇 974 kB / 90 kB | 🥇 974 kB / 90 kB | 1.19 MB / 214 kB (~2.4x larger) |
| _Extended types_ |  |  |  |  |
| Serialize | n/a | 78 ms | 67 ms | 🥇 21 ms |
| Deserialize | n/a | 32 ms | 24 ms | 🥇 9 ms |
| Size raw / gzip | n/a | 3.62 MB / 322 kB | 3.24 MB / 🥇 286 kB | 🥇 2.47 MB / 359 kB |
| _Repeated objects (10 shared refs)_ |  |  |  |  |
| Serialize | 8.1 ms | 29.8 ms | 14.8 ms | 🥇 7.0 ms |
| Deserialize | 3.6 ms | 14.0 ms | 3.1 ms | 🥇 2.3 ms |
| Size raw / gzip | 2.15 MB / 🥇 65 kB | 2.82 MB / 121 kB | 754 kB / 83 kB | 🥇 688 kB / 136 kB |
| **Advantages** | Fastest, smallest, no dependency | Fast deserialize, compresses well | Best gzip size for extended types, fast deserialize | Fastest with extended types, smallest raw |
| **Drawbacks** | No extended types, references are lost | Slowest serialize, large raw output | Slow serialize | Compresses poorly (~2.4x larger gzip) |

> [!TIP]
> Dedupe is a superjson option, use a custom serializer to enable it:
>
> ```typescript
> import type { ICacheSerializer } from "@httpx/xcache";
> import { SuperJSON } from "superjson";
>
> const superjson = new SuperJSON({ dedupe: true });
>
> const superjsonDedupeSerializer: ICacheSerializer = {
>   getIdentifier: () => "superjson-dedupe",
>   serialize: (data) => superjson.stringify(data),
>   deserialize: (serialized) => superjson.parse(serialized),
>   toString: () => "superjson-dedupe",
> };
> ```

## Benchmarks

> Performance is continuously monitored thanks to [codspeed.io](https://codspeed.io/belgattitude/httpx).
>
> [![CodSpeed Badge](https://img.shields.io/endpoint?url=https://codspeed.io/badge.json)](https://codspeed.io/belgattitude/httpx)

### Node 26.12.0

```
 RUN  v5.0.5 /home/user/github/httpx/packages/xcache

 ✓ |bench| bench/x-mem-cache.bench.ts > XMemCache benchmarks with 974 kB > XMemCache vs original function 14126ms
   name                                    hz     min      max    mean     p75     p99     p995     p999     rme   samples
   with cache (just lru)        15,352,561.11  0.0000   2.5849  0.0001  0.0001  0.0002   0.0002   0.0004  ±0.86%  10368758   fastest
   with cache                    4,591,827.90  0.0001   0.2090  0.0002  0.0002  0.0004   0.0005   0.0007  ±0.24%   3534620
   cache with superjson + gzip         485.39  1.7499   6.9875  2.1485  2.0565  4.5418   4.9750   6.8875  ±2.92%       373
   cache with json + gzip              457.96  1.8646  22.8560  2.3410  2.2464  5.2485  15.7326  21.6311  ±7.35%       342
   cache with devalue + gzip           226.65  3.9722  11.3495  4.5163  4.3424  8.2525   8.6976  10.8191  ±2.88%       178
   original function                   2.4927  400.66   401.34  401.18  401.25  401.33   401.34   401.34  ±0.03%        10   slowest
 ✓ |bench| bench/serializer.bench.ts > Serializer benchmarks with native types > serialize native types 3219ms
   name                                             hz      min      max     mean      p75      p99     p995     p999     rme  samples
   json.serialize(974 kB) - native types        693.14   1.2997   2.3043   1.4547   1.4919   1.9435   2.0664   2.1813  ±0.82%      550   fastest
   devalue.serialize(1.19 MB) - native types    110.04   7.6874  14.4778   9.2295   9.9369  13.0504  13.7641  14.3350  ±2.81%       87
   superjson.serialize(974 kB) - native types  84.3263  11.0169  19.7262  11.9406  12.1344  16.9537  18.3400  19.4490  ±2.40%       68   slowest
 ✓ |bench| bench/serializer.bench.ts > Serializer benchmarks with native types > deserialize native types 3164ms
   name                                              hz     min     max    mean     p75     p99    p995    p999     rme  samples
   superjson.deserialize(974 kB) - native types  918.04  1.0183  2.0380  1.0940  1.1018  1.4098  1.4636  1.8186  ±0.54%      732   fastest
   json.deserialize(974 kB) - native types       903.45  1.0249  1.5636  1.1114  1.1229  1.4572  1.4887  1.5153  ±0.51%      720
   devalue.deserialize(1.19 MB) - native types   344.44  2.7012  3.7527  2.9144  2.9322  3.6432  3.6476  3.7240  ±0.79%      275   slowest
 ✓ |bench| bench/serializer.bench.ts > Serializer benchmarks with extended types > serialize extended types 2346ms
   name                                                hz      min      max     mean      p75      p99     p995     p999     rme  samples
   devalue.serialize(2.47 MB) - extended types    44.2795  20.2032  32.9322  22.7931  23.0227  31.7498  32.3410  32.8139  ±3.68%       36   fastest
   superjson.serialize(3.62 MB) - extended types  11.4471  82.3969   100.70  87.6623  88.0093   100.13   100.41   100.64  ±4.63%       10
 ✓ |bench| bench/serializer.bench.ts > Serializer benchmarks with extended types > deserialize extended types 2188ms
   name                                                  hz      min      max     mean      p75      p99     p995     p999     rme  samples
   devalue.deserialize(2.47 MB) - extended types     107.85   8.0849  12.8885   9.3908  10.2126  11.8314  12.3599  12.7828  ±2.47%       86   fastest
   superjson.deserialize(3.62 MB) - extended types  31.1268  28.5058  39.6275  32.3122  34.1475  38.6950  39.1612  39.5342  ±3.26%       25
 ✓ |bench| bench/superjson-dedupe.bench.ts > Superjson with/without dedupe compressed in gzip > compress (serialize + gzip) 2163ms
   name                                               hz      min      max     mean      p75      p99     p995     p999     rme  samples
   superjson-dedupe.compress(754 kB -> 82.9 kB)  67.0665  13.5601  30.1134  15.2230  15.3503  29.8120  29.9627  30.0833  ±5.41%       53   fastest
   superjson.compress(2.82 MB -> 121 kB)         27.7031  33.8681  40.2637  36.1606  37.0774  39.8810  40.0723  40.2254  ±1.88%       23
 ✓ |bench| bench/superjson-dedupe.bench.ts > Superjson with/without dedupe compressed in gzip > decompress (gunzip + deserialize) 2115ms
   name                                                 hz      min      max     mean      p75      p99     p995     p999     rme  samples
   superjson-dedupe.decompress(754 kB -> 82.9 kB)   264.59   3.4548   9.5076   3.8264   3.8286   6.8777   7.1020   9.0063  ±2.05%      210   fastest
   superjson.decompress(2.82 MB -> 121 kB)         57.0504  14.8538  21.9704  17.8425  20.4210  21.9642  21.9673  21.9698  ±4.17%       45
 ✓ |bench| bench/cache-key.bench.ts > genCacheKey benches > genCacheKeyString 1237ms
   name                       hz     min     max    mean     p75     p99    p995    p999     rme  samples
   original function  867,871.01  0.0010  0.1661  0.0012  0.0012  0.0017  0.0018  0.0067  ±0.19%   677897
```

### Bun 1.4.3

```
 RUN  v5.0.5 /home/user/github/httpx/packages/xcache

 ✓ |bench| bench/x-mem-cache.bench.ts > XMemCache benchmarks with 974 kB > XMemCache vs original function 13028ms
   name                                    hz     min     max    mean     p75     p99    p995    p999     rme  samples
   with cache (just lru)        14,155,116.12  0.0000  0.9959  0.0001  0.0001  0.0002  0.0002  0.0004  ±0.60%  9850138   fastest
   with cache                    5,260,364.13  0.0001  0.7365  0.0002  0.0002  0.0008  0.0011  0.0032  ±0.67%  3733557
   cache with json + gzip              816.50  1.0875  2.6411  1.2410  1.2553  2.2422  2.3423  2.4561  ±1.11%      645
   cache with superjson + gzip         812.65  1.0955  2.8384  1.2482  1.2562  2.2989  2.4763  2.6945  ±1.21%      641
   cache with devalue + gzip           386.16  2.3306  5.6202  2.6261  2.6479  3.9497  4.2457  5.2418  ±1.56%      305
   original function                   2.4926  400.18  403.52  401.18  401.13  403.32  403.42  403.50  ±0.16%       10   slowest
 ✓ |bench| bench/serializer.bench.ts > Serializer benchmarks with native types > serialize native types 3196ms
   name                                              hz     min      max    mean     p75      p99     p995     p999     rme  samples
   json.serialize(974 kB) - native types       2,096.07  0.4318   1.4900  0.4821  0.4835   0.6625   1.0241   1.2005  ±0.67%     1660   fastest
   devalue.serialize(1.19 MB) - native types     188.43  3.7987  16.3470  5.6384  5.8015  12.8034  13.9273  15.8630  ±5.33%      142
   superjson.serialize(974 kB) - native types    104.29  8.6246  12.0991  9.6571  9.9714  11.9268  12.0130  12.0819  ±1.93%       84   slowest
 ✓ |bench| bench/serializer.bench.ts > Serializer benchmarks with native types > deserialize native types 3168ms
   name                                                hz     min     max    mean     p75     p99    p995    p999     rme  samples
   superjson.deserialize(974 kB) - native types  1,089.85  0.8212  2.3098  0.9245  0.9337  1.3009  1.7000  1.9667  ±0.74%      866   fastest
   json.deserialize(974 kB) - native types         957.96  0.8440  3.7821  1.1378  1.1981  3.0900  3.3061  3.7413  ±2.90%      704
   devalue.deserialize(1.19 MB) - native types     589.04  1.5196  3.3868  1.7202  1.7260  2.7864  3.0288  3.3580  ±1.24%      466   slowest
 ✓ |bench| bench/serializer.bench.ts > Serializer benchmarks with extended types > serialize extended types 2199ms
   name                                                hz      min      max     mean      p75      p99     p995     p999     rme  samples
   devalue.serialize(2.47 MB) - extended types     113.19   7.4260  16.1098   9.1078   9.4000  15.7978  15.9538  16.0786  ±4.27%       88   fastest
   superjson.serialize(3.62 MB) - extended types  22.5379  37.3912  49.4339  44.6269  47.2697  49.3701  49.4020  49.4275  ±3.80%       18
 ✓ |bench| bench/serializer.bench.ts > Serializer benchmarks with extended types > deserialize extended types 2178ms
   name                                                  hz      min      max     mean      p75      p99     p995     p999     rme  samples
   devalue.deserialize(2.47 MB) - extended types     188.75   4.8813   7.5496   5.3230   5.4352   6.8672   7.2055   7.4808  ±1.19%      151   fastest
   superjson.deserialize(3.62 MB) - extended types  45.7138  19.9913  24.0638  21.9466  22.8460  24.0518  24.0578  24.0626  ±1.93%       37
 ✓ |bench| bench/superjson-dedupe.bench.ts > Superjson with/without dedupe compressed in gzip > compress (serialize + gzip) 2120ms
   name                                             hz      min      max     mean      p75      p99     p995     p999     rme  samples
   superjson-dedupe.compress(754 kB -> 83 kB)  96.7237   9.5901  13.0567  10.3604  10.6088  11.6732  12.3649  12.9183  ±1.08%       78   fastest
   superjson.compress(2.82 MB -> 121 kB)       56.2758  16.5873  22.4202  17.8470  18.0322  21.8129  22.1166  22.3594  ±2.13%       45
 ✓ |bench| bench/superjson-dedupe.bench.ts > Superjson with/without dedupe compressed in gzip > decompress (gunzip + deserialize) 2128ms
   name                                               hz      min      max     mean      p75      p99     p995     p999     rme  samples
   superjson-dedupe.decompress(754 kB -> 83 kB)   255.33   3.4682   6.1835   3.9492   4.0731   5.1324   5.2959   6.0045  ±1.37%      203   fastest
   superjson.decompress(2.82 MB -> 121 kB)       85.4515  10.7555  14.4643  11.7666  11.9456  14.3465  14.4054  14.4525  ±1.87%       69
 ✓ |bench| bench/cache-key.bench.ts > genCacheKey benches > genCacheKeyString 1274ms
   name                         hz     min     max    mean     p75     p99    p995    p999     rme  samples
   original function  1,575,330.20  0.0005  0.6476  0.0007  0.0006  0.0023  0.0039  0.0063  ±0.35%  1175433
```

> See [benchmark file](https://github.com/belgattitude/httpx/blob/main/packages/xcache/bench) for details.

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/xcache/.size-limit.ts)

| Scenario (esm)                             | Size (compressed) |
| ------------------------------------------ | ----------------: |
| `import { XMemCache } from '@httpx/xcache` |            ~ 800B |

## Compatibility

| Level | CI | Description |
| --- | --- | --- |
| Node | ✅ | CI for 22.x, 24.x & 26.x. |
| Browser | ✅ | Tested with latest chrome (vitest/playwright) |
| Browserslist | ✅ | [> 95%](https://browserslist.dev/?q=ZGVmYXVsdHMsIGNocm9tZSA%2BPSA5NiwgZmlyZWZveCA%2BPSAxMDUsIGVkZ2UgPj0gMTEzLCBzYWZhcmkgPj0gMTUsIGlvcyA%2BPSAxNSwgb3BlcmEgPj0gMTAzLCBub3QgZGVhZA%3D%3D) on 01/2025. [defaults, chrome >= 96, firefox >= 105, edge >= 113, safari >= 15, ios >= 15, opera >= 103, not dead](https://github.com/belgattitude/httpx/blob/main/packages/xcache/.browserslistrc) |
| Bun | ✅ | Tested with latest (at time of writing >= 1.3.3) |
| Cloudflare | ✅ | Ensured with @cloudflare/vitest-plugin (see [wrangler.toml](https://github.com/belgattitude/httpx/blob/main/devtools/vitest/wrangler.toml) |
| Typescript | ✅ | TS 5.0 + / [are-the-type-wrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io) checks on CI. |
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
