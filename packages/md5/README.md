# @httpx/md5

[![npm](https://img.shields.io/npm/v/@httpx/md5?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/md5)
[![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/md5/CHANGELOG.md)
[![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-md5-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Flru)
[![bundles](https://img.shields.io/static/v1?label=&message=cjs|esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/md5/.size-limit.cjs)
[![node](https://img.shields.io/static/v1?label=Node&message=20%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![browserslist](https://img.shields.io/static/v1?label=Browsers&message=%3E96%25&logo=googlechrome&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![downloads](https://img.shields.io/npm/dm/@httpx/md5?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/md5)
[![license](https://img.shields.io/npm/l/@httpx/md5?style=for-the-badge&labelColor=444)](https://github.com/belgattitude/httpx/blob/main/LICENSE)

Fast and lightweight [MD5](https://en.wikipedia.org/wiki/MD5) hashing function for JavaScript.
Degrades optimized for performance and minimal bundle size. It provides a simple API to compute MD5 hashes of strings and buffers, making it ideal for use in web applications, Node.js, and other JavaScript environments.

## Install

```bash
$ npm install @httpx/md5
$ yarn add @httpx/md5
$ pnpm add @httpx/md5
```

## Features

- 🖖&nbsp; Provides [LruCache](#lrucache) and [TimeLruCache](#timelrucache).
- 🚀&nbsp; [Fast](#benchmarks) `cache.get()` in O(1) thx to [doubly linked list](https://en.wikipedia.org/wiki/Doubly_linked_list).
- 🦆&nbsp; Expose `getOrSet()` method to simplify cache usage patterns.
- ✨&nbsp; Provides convenience [helpers](#helpers) to preserve single instance across your app.
- 📐&nbsp; Lightweight (starts at [~570B](#bundle-size))
- 🛡️&nbsp; Tested on [node 20-25, bun, browser, cloudflare workers and runtime/edge](#compatibility).
- 🗝️&nbsp; Available in ESM and CJS formats.

## Documentation

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/md5/.size-limit.ts)

| Scenario (esm)                                        | Size (brotli) |
| ----------------------------------------------------- | ------------: |
| `import { LruCache } from '@httpx/md5`                |        ~ 568B |
| `import { TimeLruCache } from '@httpx/md5`            |        ~ 661B |
| `import { getOrCreateLruCache } from '@httpx/md5`     |        ~ 642B |
| `import { getOrCreateTimeLruCache } from '@httpx/md5` |        ~ 746B |

## Compatibility

| Level        | CI  | Description                                                                                                                                      |
| ------------ | --- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Node         | ✅  | CI for 20.x, 22.x, 24.x & 25.x.                                                                                                                  |
| Browser      | ✅  | Tested with latest chrome (vitest/playwright)                                                                                                    |
| Browserslist | ✅  | [defaults, > 0.26%, last 2 versions, Firefox ESR, not dead](https://github.com/belgattitude/httpx/blob/main/packages/md5/.browserslistrc)        |
| Bun          | ✅  | Tested with latest (at time of writing >= 1.3.3)                                                                                                 |
| Edge         | ✅  | Ensured on CI with [@vercel/edge-runtime](https://github.com/vercel/edge-runtime).                                                               |
| Cloudflare   | ✅  | Ensured with @cloudflare/vitest-pool-workers (see [wrangler.toml](https://github.com/belgattitude/httpx/blob/main/devtools/vitest/wrangler.toml) |
| Typescript   | ✅  | TS 5.0 + / [are-the-type-wrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io) checks on CI.                                    |
| ES2022       | ✅  | Dist files checked with [es-check](https://github.com/yowainwright/es-check)                                                                     |
| Performance  | ✅  | Monitored with [codspeed.io](https://codspeed.io/belgattitude/httpx)                                                                             |

## Contributors

Contributions are welcome. Have a look to the [CONTRIBUTING](https://github.com/belgattitude/httpx/blob/main/CONTRIBUTING.md) document.

## Sponsors

[Sponsorship](https://github.com/sponsors/belgattitude) or a [coffee](https://ko-fi.com/belgattitude) highly appreciated.

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
