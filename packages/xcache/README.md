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
import { XMemCache, TimeLruCache, CacheGzip, DevalueSerializer  } from '@httpx/xcache';

const xMemCache = new XMemCache({ 
    lru: new TimeLruCache({ maxSize: 50, defaultTTL: 120_000 }),
    compressor: new CacheGzip({
        serializer: new DevalueSerializer(),
    }),
});

const fetchDataFn = async (params: { name: string }) => {
    return {
        message: `Hello ${params.name}`,
        bigint: BigInt('1234567890123456789012345678901234567890'),
        date: new Date(),
    };
};

const { data } = await xMemCache.runAsync({
 key: ['/api/data', { name: 'cool' }],
 fn: () => fetchSmth({ name: 'cool'}),
})

```



## Benchmarks

> Performance is continuously monitored thanks to [codspeed.io](https://codspeed.io/belgattitude/httpx). 
>
> [![CodSpeed Badge](https://img.shields.io/endpoint?url=https://codspeed.io/badge.json)](https://codspeed.io/belgattitude/httpx)

```
 RUN  v3.2.4 /home/sebastien/github/httpx/packages/xcache


 ✓ bench/x-mem-cache.bench.ts > XMemCache benchmarks 11265ms
     name                                 hz      min      max     mean      p75      p99     p995     p999       rme  samples
   · original function                4.9853   200.40   200.79   200.59   200.70   200.79   200.79   200.79    ±0.04%       10
   · with cache (just lru)        195,597.22   0.0008   7.2864   0.0051   0.0012   0.0060   0.0164   0.0758  ±129.55%     2157
   · with cache                    79,325.05   0.0077   0.3733   0.0126   0.0116   0.0543   0.0874   0.3733    ±8.69%      807
   · cache with json + gzip           5.0865   180.60   216.52   196.60   202.09   216.52   216.52   216.52    ±4.10%       10
   · cache with superjson + gzip      4.0502   216.29   295.91   246.90   275.94   295.91   295.91   295.91    ±8.53%       10
   · cache with devalue + gzip       76.3087  11.9873  14.6038  13.1047  14.0491  14.6038  14.6038  14.6038    ±5.08%       10

 BENCH  Summary

  with cache (just lru) - bench/x-mem-cache.bench.ts > XMemCache benchmarks
    2.47x faster than with cache
    2563.24x faster than cache with devalue + gzip
    38454.46x faster than cache with json + gzip
    39235.15x faster than original function
    48292.71x faster than cache with superjson + gzip

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
