# @httpx/lru

[![npm](https://img.shields.io/npm/v/@httpx/lru?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/lru)
[![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/lru/CHANGELOG.md)
[![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-lru-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Flru)
[![bundles](https://img.shields.io/static/v1?label=&message=cjs|esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/lru/.size-limit.cjs)
[![node](https://img.shields.io/static/v1?label=Node&message=18%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![browserslist](https://img.shields.io/static/v1?label=Browser&message=%3E96%25&logo=googlechrome&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![size](https://img.shields.io/bundlephobia/minzip/@httpx/lru@latest?label=Max&style=for-the-badge&labelColor=444&color=informational)](https://bundlephobia.com/package/@httpx/lru@latest)
[![downloads](https://img.shields.io/npm/dm/@httpx/lru?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/lru)
[![license](https://img.shields.io/npm/l/@httpx/lru?style=for-the-badge&labelColor=444)](https://github.com/belgattitude/httpx/blob/main/LICENSE)

## Install

```bash
$ npm install @httpx/lru
$ yarn add @httpx/lru
$ pnpm add @httpx/lru
```

## Features

- 📐&nbsp; Lightweight (starts at [~600B](#bundle-size)) 
- 🛡️&nbsp; Tested on [node 18-22, browser, cloudflare workers and runtime/edge](#compatibility).
- 🗝️&nbsp; Available in ESM and CJS formats.

## Documentation


## Usage

## Benchmarks

> Performance is continuously monitored thanks to [codspeed.io](https://codspeed.io/belgattitude/httpx). 
>
> [![CodSpeed Badge](https://img.shields.io/endpoint?url=https://codspeed.io/badge.json)](https://codspeed.io/belgattitude/httpx)

```
RUN  v3.0.4 /home/sebastien/github/httpx/packages/lru

 ✓ bench/lru-get.comparative.bench.ts > LRU.get comparison 2479ms
     name                                 hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru@0.1.0              67,479.50  0.0114  0.2499  0.0148  0.0151  0.0307  0.0370  0.0791  ±0.37%    33740
   · @httpx/lru@0.1.0 - compiled   67,544.83  0.0116  0.5466  0.0148  0.0151  0.0249  0.0323  0.0558  ±0.33%    33773
   · quick-lru@7.0.0               26,237.48  0.0318  0.4600  0.0381  0.0389  0.0721  0.1371  0.1807  ±0.54%    13119   slowest
   · lru-cache@11.0.2             111,356.68  0.0075  0.3962  0.0090  0.0090  0.0126  0.0193  0.0476  ±0.35%    55679   fastest

 ✓ bench/lru-set.comparative.bench.ts > LRU.set comparison 2433ms
     name                                hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/lru@0.1.0              8,273.94  0.0555  5.5043  0.1209  0.0850  1.5624  2.9561  3.3352  ±7.76%     4137   slowest
   · @httpx/lru@0.1.0 - compiled   8,935.53  0.0500  3.0366  0.1119  0.1373  0.3607  0.5755  1.7015  ±2.91%     4468
   · quick-lru@7.0.0              24,714.73  0.0254  1.5023  0.0405  0.0428  0.1489  0.2337  0.4687  ±1.43%    12358   fastest
   · lru-cache@11.0.2             11,027.03  0.0584  2.3836  0.0907  0.0865  0.2830  0.5085  1.4927  ±2.38%     5514
 
```

> See [benchmark file](https://github.com/belgattitude/httpx/blob/main/packages/lru/bench/comparative.bench.ts) for details.

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/lru/.size-limit.cjs)

| Scenario (esm)                                     | Size (compressed) |
|----------------------------------------------------|------------------:|
| `import { LRUCache  } from '@httpx/lru`            |            ~ 510B |

> For CJS usage (not recommended) track the size on [bundlephobia](https://bundlephobia.com/package/@httpx/lru@latest).

## Compatibility

| Level      | CI | Description                                                                                                                                                                                                                                                                                                                                                 |
|------------|----|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|  
| Node       | ✅  | CI for 18.x, 20.x & 22.x.                                                                                                                                                                                                                                                                                                                                   |
| Browser      | ✅  | Tested with latest chrome (vitest/playwright)                                                                                                                                                                                                                                                                                                               |
| Browsers   | ✅  | [> 94%](https://browserslist.dev/?q=ZGVmYXVsdHMsIGNocm9tZSA%2BPSA5NixmaXJlZm94ID49IDkwLGVkZ2UgPj0gOTEsc2FmYXJpID49IDE0LGlvcyA%2BPSAxNCxvcGVyYSA%2BPSA5MA%3D%3D) on 01/2025. Mins to [defaults, chrome >= 96,firefox >= 90,edge >= 91,safari >= 14,ios >= 14,opera >= 90](https://github.com/belgattitude/httpx/blob/main/packages/lru/.browserslistrc) |
| Edge         | ✅  | Ensured on CI with [@vercel/edge-runtime](https://github.com/vercel/edge-runtime).                                                                                                                                                                                                                                                                          | 
| Cloudflare   | ✅  | Ensured with @cloudflare/vitest-pool-workers (see [wrangler.toml](https://github.com/belgattitude/httpx/blob/main/devtools/vitest/wrangler.toml)                                                                                                                                                                                                            |
| Typescript | ✅  | TS 5.0 + / [are-the-type-wrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io) checks on CI.                                                                                                                                                                                                                                               |
| ES2022     | ✅  | Dist files checked with [es-check](https://github.com/yowainwright/es-check)                                                                                                                                                                                                                                                                                |
| Performance| ✅  | Monitored with [codspeed.io](https://codspeed.io/belgattitude/httpx)                                                                                                                                                                                                                                                                                        |

> For _older_ browsers: most frontend frameworks can transpile the library (ie: [nextjs](https://nextjs.org/docs/app/api-reference/next-config-js/transpilePackages)...)

## Comparison with other libraries

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
