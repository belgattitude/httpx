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

You can use compression to reduce the size of the cached data. The library supports `gzip` compression algorithm To be able to serialize and deserialize the data, you can use adapters like `DevalueSerializer`, `SuperjsonSerializer` or `JsonSerializer`.

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

### Node 24.21.0

```
 RUN  v5.0.5 /home/user/github/httpx/packages/xcache

 ✓ |bench| bench/serializer.bench.ts > Serializer benchmarks with json > serialize / deserialize native types 2111ms
   name                                         hz     min     max    mean     p75     p99    p995    p999     rme  samples
   json.deserialize(974 kB) - native types  802.71  1.0760  1.8883  1.2515  1.2980  1.5953  1.6096  1.7565  ±0.54%      640   fastest
   json.serialize(974 kB) - native types    736.51  1.1803  2.6892  1.3753  1.3993  2.4456  2.5125  2.6640  ±1.15%      582
 ✓ |bench| bench/serializer.bench.ts > Serializer benchmarks with devalue > serialize / deserialize native types 2135ms
   name                                             hz     min     max    mean     p75     p99    p995    p999     rme  samples
   devalue.deserialize(1.19 MB) - native types  372.71  2.5499  3.9375  2.6988  2.6805  3.7961  3.8584  3.9273  ±1.00%      297   fastest
   devalue.serialize(1.19 MB) - native types    130.83  6.9560  9.5567  7.6994  8.1829  9.5462  9.5532  9.5560  ±1.73%      105
 ✓ |bench| bench/serializer.bench.ts > Serializer benchmarks with superjson > serialize / deserialize native types 2133ms
   name                                               hz      min      max     mean      p75      p99     p995     p999     rme  samples
   superjson.deserialize(974 kB) - native types   942.66   1.0037   1.8752   1.0647   1.0687   1.4319   1.4678   1.6750  ±0.50%      752   fastest
   superjson.serialize(974 kB) - native types    84.8510  10.5731  20.1210  11.8501  12.0113  15.1286  17.6248  19.6217  ±2.23%       68
 ✓ |bench| bench/serializer.bench.ts > Serializer benchmarks with devalue > serialize / deserialize extended types 2158ms
   name                                                hz      min      max     mean      p75      p99     p995     p999     rme  samples
   devalue.deserialize(2.47 MB) - extended types   154.15   6.1773   8.3212   6.5008   6.5671   7.5928   7.8872   8.2344  ±0.86%      124   fastest
   devalue.serialize(2.47 MB) - extended types    55.5103  16.5035  22.2382  18.0805  18.5342  21.2973  21.7678  22.1441  ±1.90%       45
 ✓ |bench| bench/serializer.bench.ts > Serializer benchmarks with superjson > serialize / deserialize extended types 2378ms
   name                                                  hz      min      max     mean      p75      p99     p995     p999     rme  samples
   superjson.deserialize(3.62 MB) - extended types  31.5050  30.1746  34.2374  31.7749  32.4519  34.0794  34.1584  34.2216  ±1.35%       26   fastest
   superjson.serialize(3.62 MB) - extended types    13.0515  72.2987  90.7315  76.8877  77.9216  89.4601  90.0958  90.6044  ±4.40%       11
 ✓ |bench| bench/x-mem-cache.bench.ts > XMemCache benchmarks with 974 kB > XMemCache vs original function 13503ms
   name                                    hz     min      max    mean     p75     p99    p995     p999     rme   samples
   with cache (just lru)        15,586,744.06  0.0000   4.2097  0.0001  0.0001  0.0002  0.0002   0.0004  ±1.47%  10638755   fastest
   with cache                    1,617,672.23  0.0005  26.3478  0.0007  0.0006  0.0010  0.0010   0.0013  ±7.71%   1191020
   cache with superjson + gzip         423.36  2.0891   8.0466  2.5046  2.3141  6.0980  7.6623   7.9604  ±3.94%       320
   cache with json + gzip              416.28  2.0963  15.7020  2.5667  2.3629  6.0409  6.1681  12.7675  ±4.76%       312
   cache with devalue + gzip           213.04  4.1487  11.7399  4.8810  4.6178  8.3293  9.2857  11.2490  ±3.73%       164
   original function                   2.4929  400.38   401.36  401.14  401.27  401.35  401.36   401.36  ±0.05%        10   slowest
 ✓ |bench| bench/cache-key.bench.ts > genCacheKey benches > genCacheKeyString 1194ms
   name                       hz     min     max    mean     p75     p99    p995    p999     rme  samples
   original function  741,660.91  0.0012  1.4661  0.0014  0.0013  0.0018  0.0019  0.0051  ±0.39%   584036
```

### Bun 1.4.3

```
 RUN  v5.0.5 /home/user/github/httpx/packages/xcache

 ✓ |bench| bench/x-mem-cache.bench.ts > XMemCache benchmarks with 974 kB > XMemCache vs original function 12761ms
   name                                    hz     min     max    mean     p75     p99    p995    p999     rme   samples
   with cache (just lru)        14,884,555.00  0.0000  0.9305  0.0001  0.0001  0.0002  0.0002  0.0003  ±0.51%  10378993   fastest
   with cache                    2,388,803.14  0.0003  0.6734  0.0004  0.0004  0.0008  0.0011  0.0043  ±0.46%   1801751
   cache with json + gzip              817.40  1.0837  2.9017  1.2439  1.2493  2.2490  2.3961  2.7955  ±1.26%       644
   cache with superjson + gzip         763.24  1.1027  3.8862  1.3599  1.3966  2.9517  3.0874  3.5235  ±1.98%       589
   cache with devalue + gzip           377.49  2.3541  6.0959  2.6909  2.7785  4.0212  4.1519  5.5257  ±1.67%       298
   original function                   2.4912  400.24  405.20  401.41  401.15  404.84  405.02  405.16  ±0.24%        10   slowest
 ✓ |bench| bench/serializer.bench.ts > Serializer benchmarks with json > serialize / deserialize native types 2115ms
   name                                           hz     min     max    mean     p75     p99    p995    p999     rme  samples
   json.serialize(974 kB) - native types    2,092.10  0.4315  1.3817  0.4849  0.4991  0.7520  1.0408  1.1323  ±0.74%     1650   fastest
   json.deserialize(974 kB) - native types  1,116.21  0.8111  2.7767  0.9088  0.9444  1.2903  1.5792  2.0396  ±0.97%      881
 ✓ |bench| bench/serializer.bench.ts > Serializer benchmarks with devalue > serialize / deserialize native types 2127ms
   name                                             hz     min      max    mean     p75      p99     p995     p999     rme  samples
   devalue.deserialize(1.19 MB) - native types  622.54  1.4435   5.0034  1.6269  1.6549   2.3640   2.5100   4.3405  ±1.31%      492   fastest
   devalue.serialize(1.19 MB) - native types    204.59  3.7036  17.2943  5.2425  5.4647  13.8743  14.8306  16.8015  ±5.94%      153
 ✓ |bench| bench/serializer.bench.ts > Serializer benchmarks with superjson > serialize / deserialize native types 2120ms
   name                                                hz     min      max    mean      p75      p99     p995     p999     rme  samples
   superjson.deserialize(974 kB) - native types  1,175.15  0.7750   2.5386  0.8596   0.8836   1.1894   1.6342   1.8649  ±0.82%      931   fastest
   superjson.serialize(974 kB) - native types      102.13  8.3773  12.5371  9.8802  10.1790  12.5076  12.5223  12.5341  ±2.24%       81
 ✓ |bench| bench/serializer.bench.ts > Serializer benchmarks with devalue > serialize / deserialize extended types 2141ms
   name                                               hz     min      max     mean      p75      p99     p995     p999     rme  samples
   devalue.deserialize(2.47 MB) - extended types  189.36  4.7471   7.2653   5.3338   5.6419   7.1468   7.2447   7.2612  ±1.72%      150   fastest
   devalue.serialize(2.47 MB) - extended types    101.36  7.3946  20.1658  10.4124  10.7048  20.1590  20.1624  20.1651  ±6.42%       77
 ✓ |bench| bench/serializer.bench.ts > Serializer benchmarks with superjson > serialize / deserialize extended types 2267ms
   name                                                  hz      min      max     mean      p75      p99     p995     p999     rme  samples
   superjson.deserialize(3.62 MB) - extended types  40.9171  20.4918  33.0855  24.7547  26.6196  32.8205  32.9530  33.0590  ±4.24%       33   fastest
   superjson.serialize(3.62 MB) - extended types    21.2238  38.8255  59.9032  47.7155  51.3867  59.0997  59.5015  59.8229  ±6.05%       17
 ✓ |bench| bench/cache-key.bench.ts > genCacheKey benches > genCacheKeyString 1237ms
   name                         hz     min     max    mean     p75     p99    p995    p999     rme  samples
   original function  1,314,730.05  0.0006  0.6831  0.0008  0.0008  0.0037  0.0051  0.0068  ±0.37%   976961
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
