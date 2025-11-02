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


 ✓ bench/x-mem-cache.bench.ts > XMemCache benchmarks with 46.7 MB 74628ms
     name                                   hz       min       max      mean       p75       p99      p995      p999      rme  samples
   · original function                  2.4339    400.94    434.29    410.86    418.86    434.29    434.29    434.29   ±1.87%       10
   · with cache (just lru)        3,054,089.19    0.0002   14.4000    0.0003    0.0003    0.0007    0.0022    0.0040   ±5.04%  2443272
   · with cache                     411,941.25    0.0017    3.7591    0.0024    0.0020    0.0057    0.0074    0.0404   ±2.38%   329553
   · cache with json + gzip             0.6551  1,182.69  1,849.31  1,526.47  1,706.09  1,849.31  1,849.31  1,849.31   ±9.93%       10
   · cache with superjson + gzip        0.7255  1,139.75  1,791.56  1,378.28  1,492.88  1,791.56  1,791.56  1,791.56  ±11.51%       10
   · cache with devalue + gzip          0.3867  2,294.54  2,802.35  2,586.15  2,742.74  2,802.35  2,802.35  2,802.35   ±4.91%       10

 ✓ bench/serializer.bench.ts > Serializer benchmarks with json 1960ms
     name                                           hz      min      max     mean      p75      p99     p995     p999      rme  samples
   · json.serialize(4.52 MB) - native types    42.7513  17.8273  61.9698  23.3911  25.4860  61.9698  61.9698  61.9698  ±11.51%       35
   · json.deserialize(4.52 MB) - native types  54.3614  15.8986  24.7563  18.3954  19.4053  24.7563  24.7563  24.7563   ±3.89%       44

 ✓ bench/serializer.bench.ts > Serializer benchmarks with devalue 3856ms
     name                                              hz      min      max     mean      p75      p99     p995     p999      rme  samples
   · devalue.serialize(5.66 MB) - native types     4.5549   181.51   310.60   219.54   229.88   310.60   310.60   310.60  ±12.22%       10
   · devalue.deserialize(5.66 MB) - native types  25.8784  33.8357  60.3575  38.6422  38.0392  60.3575  60.3575  60.3575   ±7.44%       21

 ✓ bench/serializer.bench.ts > Serializer benchmarks with superjson 4017ms
     name                                                hz      min      max     mean      p75      p99     p995     p999      rme  samples
   · superjson.serialize(4.52 MB) - native types     4.3337   191.75   299.23   230.75   235.30   299.23   299.23   299.23  ±11.34%       10
   · superjson.deserialize(4.52 MB) - native types  59.9753  15.3860  21.7358  16.6735  17.1168  21.7358  21.7358  21.7358   ±2.47%       48

 ✓ bench/serializer.bench.ts > Serializer benchmarks with devalue 7899ms
     name                                               hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · devalue.serialize(11.6 MB) - extended types    2.1285  411.59  618.03  469.81  492.86  618.03  618.03  618.03  ±9.40%       10
   · devalue.deserialize(11.6 MB) - extended types  7.5291  111.54  168.71  132.82  144.80  168.71  168.71  168.71  ±9.55%       10

 ✓ bench/serializer.bench.ts > Serializer benchmarks with superjson 31316ms
     name                                                 hz       min       max      mean       p75       p99      p995      p999     rme  samples
   · superjson.serialize(16.8 MB) - extended types    0.5910  1,467.09  1,987.69  1,692.02  1,759.17  1,987.69  1,987.69  1,987.69  ±7.26%       10
   · superjson.deserialize(16.8 MB) - extended types  1.4491    618.85    872.47    690.09    714.58    872.47    872.47    872.47  ±8.01%       10

 ✓ bench/cache-key.bench.ts > genCacheKey benches 1014ms
     name                       hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · original function  155,643.54  0.0047  5.8940  0.0064  0.0064  0.0170  0.0275  0.1160  ±1.96%   124516

 BENCH  Summary

  original function - bench/cache-key.bench.ts > genCacheKey benches

  json.deserialize(4.52 MB) - native types - bench/serializer.bench.ts > Serializer benchmarks with json
    1.27x faster than json.serialize(4.52 MB) - native types

  devalue.deserialize(5.66 MB) - native types - bench/serializer.bench.ts > Serializer benchmarks with devalue
    5.68x faster than devalue.serialize(5.66 MB) - native types

  superjson.deserialize(4.52 MB) - native types - bench/serializer.bench.ts > Serializer benchmarks with superjson
    13.84x faster than superjson.serialize(4.52 MB) - native types

  devalue.deserialize(11.6 MB) - extended types - bench/serializer.bench.ts > Serializer benchmarks with devalue
    3.54x faster than devalue.serialize(11.6 MB) - extended types

  superjson.deserialize(16.8 MB) - extended types - bench/serializer.bench.ts > Serializer benchmarks with superjson
    2.45x faster than superjson.serialize(16.8 MB) - extended types

  with cache (just lru) - bench/x-mem-cache.bench.ts > XMemCache benchmarks with 46.7 MB
    7.41x faster than with cache
    1254817.36x faster than original function
    4209397.40x faster than cache with superjson + gzip
    4661963.60x faster than cache with json + gzip
    7898344.77x faster than cache with devalue + gzip

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
| Node         | ✅   | CI for 20.x, 22.x, 24.x & 25.x.                                                                                                                                                                                                                                                                                                                                                                   |
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
