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
- 🛡️&nbsp; Tested on [node 20-24, browser, cloudflare workers and runtime/edge](#compatibility).
- 🗝️&nbsp; Available in ESM and CJS formats.

## Documentation

## Simple usage


```typescript
import { XMemCache, TimeLruCache } from '@httpx/xcache';

const xMemCache = new XMemCache({ 
    lru: new TimeLruCache({ maxSize: 50, defaultTTL: 60_000 }), 
    namespace: 'default' 
});

const fetchSmth = async (params: { id: number }) => {
  return { id: params.id, data: `Data for ${params.id}` };
}

const params = { id: 1 };

const { data } = await xMemCache.runAsync({
 key: ['/api/data', params],
 fn: () => fetchSmth(params),
})

// data: { id: 1, data: 'Data for 1' }

```

## With compression

You can use compression to reduce the size of the cached data. The library supports `gzip` compression algorithm
To be able to serialize and deserialize the data, you can use adapters like `DevalueSerializer` (fastest), 
`SuperjsonSerializer` or `JsonSerializer`.

```typescript
import { XMemCache, TimeLruCache, CacheCompress, DevalueSerializer  } from '@httpx/xcache';

const xMemCache = new XMemCache({ 
    lru: new TimeLruCache({ maxSize: 50, defaultTTL: 120_000 }),
    compressor: new CacheCompress({
      algorithm: 'deflate', // 'gzip' or 'deflate'
      serializer: new DevalueSerializer(),
    }),
});

const fetchThings = async (params: { name: string }) => {
    return {
        message: `Hello ${params.name}`,
        bigint: BigInt('1234567890123456789012345678901234567890'),
        date: new Date(),
    };
};

const { data } = await xMemCache.runAsync({
 key: ['/api/data', { name: 'cool' }],
 fn: () => fetchThings({ name: 'cool'}),
})

```



## Benchmarks

> Performance is continuously monitored thanks to [codspeed.io](https://codspeed.io/belgattitude/httpx). 
>
> [![CodSpeed Badge](https://img.shields.io/endpoint?url=https://codspeed.io/badge.json)](https://codspeed.io/belgattitude/httpx)

```
  RUN  v3.2.4 /home/sebastien/github/httpx/packages/xcache


 ✓ bench/x-mem-cache.bench.ts > XMemCache benchmarks with 46.7 MB 47346ms
     name                                   hz       min       max      mean       p75       p99      p995      p999     rme  samples
   · original function                  2.4309    401.11    434.16    411.37    416.01    434.16    434.16    434.16  ±1.69%       10
   · with cache (just lru)        7,275,952.06    0.0001    3.0182    0.0001    0.0001    0.0003    0.0003    0.0006  ±1.10%  5820762
   · with cache                     385,532.40    0.0015    2.9556    0.0026    0.0023    0.0069    0.0077    0.0266  ±2.55%   308790
   · cache with json + gzip             1.4160    637.00    767.52    706.22    736.02    767.52    767.52    767.52  ±4.55%       10
   · cache with superjson + gzip        0.9788    930.77  1,101.96  1,021.63  1,040.75  1,101.96  1,101.96  1,101.96  ±3.28%       10
   · cache with devalue + gzip          0.7232  1,282.23  1,581.08  1,382.81  1,388.98  1,581.08  1,581.08  1,581.08  ±5.04%       10

 ✓ bench/serializer.bench.ts > Serializer benchmarks with json 1944ms
     name                                           hz      min      max     mean      p75      p99     p995     p999      rme  samples
   · json.serialize(4.52 MB) - native types    79.8831   9.7263  27.4216  12.5183  12.3058  27.4216  27.4216  27.4216   ±6.80%       64
   · json.deserialize(4.52 MB) - native types  38.3516  17.4318  45.3487  26.0745  30.5054  45.3487  45.3487  45.3487  ±10.52%       31

 ✓ bench/serializer.bench.ts > Serializer benchmarks with devalue 3176ms
     name                                              hz      min      max     mean      p75      p99     p995     p999      rme  samples
   · devalue.serialize(5.66 MB) - native types     6.0316   125.29   216.31   165.79   187.40   216.31   216.31   216.31  ±13.14%       10
   · devalue.deserialize(5.66 MB) - native types  29.4361  27.9085  49.1535  33.9719  35.2153  49.1535  49.1535  49.1535   ±6.83%       24

 ✓ bench/serializer.bench.ts > Serializer benchmarks with superjson 3410ms
     name                                                hz      min      max     mean      p75      p99     p995     p999      rme  samples
   · superjson.serialize(4.52 MB) - native types     5.5025   132.11   280.01   181.74   191.92   280.01   280.01   280.01  ±16.31%       10
   · superjson.deserialize(4.52 MB) - native types  15.9297  44.7352  89.8279  62.7758  70.2771  89.8279  89.8279  89.8279  ±12.73%       13

 ✓ bench/serializer.bench.ts > Serializer benchmarks with devalue 6238ms
     name                                               hz      min     max    mean     p75     p99    p995    p999      rme  samples
   · devalue.serialize(11.6 MB) - extended types    2.9080   289.14  471.58  343.88  368.45  471.58  471.58  471.58  ±11.67%       10
   · devalue.deserialize(11.6 MB) - extended types  8.4212  93.5613  148.45  118.75  126.28  148.45  148.45  148.45   ±9.96%       10

 ✓ bench/serializer.bench.ts > Serializer benchmarks with superjson 24667ms
     name                                                 hz       min       max      mean       p75       p99      p995      p999     rme  samples
   · superjson.serialize(16.8 MB) - extended types    0.8085  1,032.67  1,303.75  1,236.78  1,291.99  1,303.75  1,303.75  1,303.75  ±5.03%       10
   · superjson.deserialize(16.8 MB) - extended types  1.6891    491.75    661.74    592.02    647.18    661.74    661.74    661.74  ±7.30%       10

 ✓ bench/cache-key.bench.ts > genCacheKey benches 984ms
     name                       hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · original function  203,058.29  0.0030  2.0647  0.0049  0.0047  0.0109  0.0147  0.0399  ±1.71%   162447

 BENCH  Summary

  original function - bench/cache-key.bench.ts > genCacheKey benches

  json.serialize(4.52 MB) - native types - bench/serializer.bench.ts > Serializer benchmarks with json
    2.08x faster than json.deserialize(4.52 MB) - native types

  devalue.deserialize(5.66 MB) - native types - bench/serializer.bench.ts > Serializer benchmarks with devalue
    4.88x faster than devalue.serialize(5.66 MB) - native types

  superjson.deserialize(4.52 MB) - native types - bench/serializer.bench.ts > Serializer benchmarks with superjson
    2.90x faster than superjson.serialize(4.52 MB) - native types

  devalue.deserialize(11.6 MB) - extended types - bench/serializer.bench.ts > Serializer benchmarks with devalue
    2.90x faster than devalue.serialize(11.6 MB) - extended types

  superjson.deserialize(16.8 MB) - extended types - bench/serializer.bench.ts > Serializer benchmarks with superjson
    2.09x faster than superjson.serialize(16.8 MB) - extended types

  with cache (just lru) - bench/x-mem-cache.bench.ts > XMemCache benchmarks with 46.7 MB
    18.87x faster than with cache
    2993138.81x faster than original function
    5138402.11x faster than cache with json + gzip
    7433294.53x faster than cache with superjson + gzip
    10061269.63x faster than cache with devalue + gzip
```

> See [benchmark file](https://github.com/belgattitude/httpx/blob/main/packages/xcache/bench) for details.

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/xcache/.size-limit.ts)

| Scenario (esm)                              | Size (compressed) |
|---------------------------------------------|------------------:|
| `import { XMemCache } from '@httpx/xcache`  |            ~ 800B |

> For CJS usage (not recommended) track the size on [bundlephobia](https://bundlephobia.com/package/@httpx/xcache@latest).

## Compatibility

| Level        | CI | Description                                                                                                                                                                                                                                                                                                                                                                                 |
|--------------|----|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|  
| Node         | ✅  | CI for 20.x, 22.x & 24.x.                                                                                                                                                                                                                                                                                                                                                                   |
| Browser      | ✅  | Tested with latest chrome (vitest/playwright)                                                                                                                                                                                                                                                                                                                                               |
| Browserslist | ✅  | [> 95%](https://browserslist.dev/?q=ZGVmYXVsdHMsIGNocm9tZSA%2BPSA5NiwgZmlyZWZveCA%2BPSAxMDUsIGVkZ2UgPj0gMTEzLCBzYWZhcmkgPj0gMTUsIGlvcyA%2BPSAxNSwgb3BlcmEgPj0gMTAzLCBub3QgZGVhZA%3D%3D) on 01/2025. [defaults, chrome >= 96, firefox >= 105, edge >= 113, safari >= 15, ios >= 15, opera >= 103, not dead](https://github.com/belgattitude/httpx/blob/main/packages/xcache/.browserslistrc) |
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
