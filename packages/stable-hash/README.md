# @httpx/stable-hash


[![npm](https://img.shields.io/npm/v/@httpx/stable-hash?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/stable-hash)
[![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/stable-hash/CHANGELOG.md)
[![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-stable-hash-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Fstable-hash)
[![bundles](https://img.shields.io/static/v1?label=&message=cjs|esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/stable-hash/.size-limit.cjs)
[![node](https://img.shields.io/static/v1?label=Node&message=18%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![browserslist](https://img.shields.io/static/v1?label=Browser&message=%3E96%25&logo=googlechrome&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![size](https://img.shields.io/bundlephobia/minzip/@httpx/stable-hash@latest?label=Max&style=for-the-badge&labelColor=444&color=informational)](https://bundlephobia.com/package/@httpx/stable-hash@latest)
[![downloads](https://img.shields.io/npm/dm/@httpx/stable-hash?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/stable-hash)
[![license](https://img.shields.io/npm/l/@httpx/stable-hash?style=for-the-badge&labelColor=444)](https://github.com/belgattitude/httpx/blob/main/LICENSE)

## Install

```bash
$ npm install @httpx/stable-hash
$ yarn add @httpx/stable-hash
$ pnpm add @httpx/stable-hash
```

## Features


## Documentation

👉 [Official website](https://belgattitude.github.io/httpx/stable-hash) or [Github Readme](https://github.com/belgattitude/httpx/tree/main/packages/stable-hash#readme)

## Usage


```typescript
import { createStableKey } from '@httpx/stable-hash'

const params = {
  key8: 'a string',
  key1: 1,
  key3: true,
  key2: [3, 2, 1],
  key7: {
    key2: true,
    key1: new Date('2025-02-11T08:58:32.075Z'),
  },
};

const key = createStableKey(params);

// Key contains a json comptatible string with object keys sorted.
// By default it will sort arrays if they contains only strings or numbers
// including bigints.

// "{"key1":1,"key2":[1,2,3],"key3":true,"key7":{"key1":"2025-02-11T08:58:32.075Z","key2":true},"key8":"a string"}"


```

## Benchmarks

Performance is monitored with [codspeed.io](https://codspeed.io/belgattitude/httpx).

[![CodSpeed Badge](https://img.shields.io/endpoint?url=https://codspeed.io/badge.json)](https://codspeed.io/belgattitude/httpx)


See [bench](https://github.com/belgattitude/httpx/blob/main/packages/stable-hash/bench) for details. 


## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/stable-hash/.size-limit.cjs)

| Scenario                                              | Size with deps (compressed) |
|-------------------------------------------------------|----------------------------:|
| `import { createStableKey } from '@httpx/stable-hash' |                      ~ 420B |


## Compatibility

| Level        | CI | Description                                                                                                                                                                                                                                                                                                                                                                                    |
|--------------|----|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|  
| Node         | ✅  | CI for 18.x, 20.x & 22.x.                                                                                                                                                                                                                                                                                                                                                                      |
| Browser      | ✅  | Tested with latest chrome (vitest/playwright)                                                                                                                                                                                                                                                                                                                                                  |
| Browserslist | ✅  | [> 95%](https://browserslist.dev/?q=ZGVmYXVsdHMsIGNocm9tZSA%2BPSA5NiwgZmlyZWZveCA%2BPSAxMDUsIGVkZ2UgPj0gMTEzLCBzYWZhcmkgPj0gMTUsIGlvcyA%2BPSAxNSwgb3BlcmEgPj0gMTAzLCBub3QgZGVhZA%3D%3D) on 01/2025. [defaults, chrome >= 96, firefox >= 105, edge >= 113, safari >= 15, ios >= 15, opera >= 103, not dead](https://github.com/belgattitude/httpx/blob/main/packages/stable-hash/.browserslistrc) |
| Edge         | ✅  | Ensured on CI with [@vercel/edge-runtime](https://github.com/vercel/edge-runtime).                                                                                                                                                                                                                                                                                                             | 
| Cloudflare   | ✅  | Ensured with @cloudflare/vitest-pool-workers (see [wrangler.toml](https://github.com/belgattitude/httpx/blob/main/devtools/vitest/wrangler.toml)                                                                                                                                                                                                                                               | 
| Typescript | ✅  | TS 5.0 + / [are-the-type-wrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io) checks on CI.                                                                                                                                                                                                                                                                                  |
| ES2022     | ✅  | Dist files checked with [es-check](https://github.com/yowainwright/es-check)                                                                                                                                                                                                                                                                                                                   |
| Performance| ✅  | Monitored with with [codspeed.io](https://codspeed.io/belgattitude/httpx)                                                                                                                                                                                                                                                                                                                      |

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

MIT © [Sébastien Vanvelthem](https://github.com/belgattitude) and contributors.
