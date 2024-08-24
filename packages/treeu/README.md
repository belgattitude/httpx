# @httpx/treeu

[Fast](#benchmarks) and lightweight ([~100B](#bundle-size)) functions to check or assert
that a value is a plain object.

[![npm](https://img.shields.io/npm/v/@httpx/treeu?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/treeu)
[![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/treeu/CHANGELOG.md)
[![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-treeu-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Ftreeu)
[![bundles](https://img.shields.io/static/v1?label=&message=cjs|esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/treeu/.size-limit.cjs)
[![node](https://img.shields.io/static/v1?label=Node&message=18%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![browserslist](https://img.shields.io/static/v1?label=Browser&message=%3E96%25&logo=googlechrome&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
[![size](https://img.shields.io/bundlephobia/minzip/@httpx/treeu@latest?label=Max&style=for-the-badge&labelColor=444&color=informational)](https://bundlephobia.com/package/@httpx/treeu@latest)
[![downloads](https://img.shields.io/npm/dm/@httpx/treeu?style=for-the-badge&labelColor=444)](https://www.npmjs.com/package/@httpx/treeu)
[![license](https://img.shields.io/npm/l/@httpx/treeu?style=for-the-badge&labelColor=444)](https://github.com/belgattitude/httpx/blob/main/LICENSE)

## Install

```bash
$ npm install @httpx/treeu
$ yarn add @httpx/treeu
$ pnpm add @httpx/treeu
```

## Features

- 👉&nbsp; Lightweight (starts at [~200B](#bundle-size)) and [node, browser and edge support](#compatibility).
- 👉&nbsp; Available in ESM and CJS formats.

## Documentation

👉 [Official website](https://belgattitude.github.io/httpx/treeu) or [Github Readme](https://github.com/belgattitude/httpx/tree/main/packages/treeu#readme)

## Usage

### Load

```typescript
import { Tree, FlatTreeWsMapper, type FlatTreeWs } from '@httpx/treeu';

type CustomValue = { byteSize?: number | undefined };

// Load from flat data with key separator
const paths = [
  { key: 'file1.ts', value: { byteSize: 80 } },
  { key: 'folder1/file1.ts', value: { byteSize: 0 } },
  { key: 'folder1/file2.ts', value: { byteSize: 4 } },
  { key: 'folder1/subfolder1/file1.ts', byteSize: { size: 10 } },
  { key: 'folder1/subfolder1/file2.ts', byteSize: { size: 10 } },
] as const satisfies FlatTreeWs<CustomValue>;

const parsed = FlatTreeWsMapper.toTreeNodes<CustomValue>(paths, {
  separator: '/',
});
if (!parsed.success) {
  throw new Error(`Couldn't parse !`);
}

// Create a tree

const tree = new Tree<CustomValue>(parsed.treeNodes);

// Search a node by id
const node = tree.search.findBy(
  ['id', '===', 'folder1/subfolder1/file1.ts'],
  {
    includeChildren: false,
    reverse: false,
  }
);
assert.equal(node, {
    id: 'folder1/subfolder1/file1.ts',
    parentId: 'folder1/subfolder1',
    value: {
      byteSize: 10,
    },
});

```


## Benchmarks

> Performance is continuously monitored thanks to [codspeed.io](https://codspeed.io/belgattitude/httpx). 
>
> [![CodSpeed Badge](https://img.shields.io/endpoint?url=https://codspeed.io/badge.json)](https://codspeed.io/belgattitude/httpx)

```
 RUN  v2.0.5 /home/sebastien/github/httpx/packages/treeu

 ✓ bench/search.bench.ts (1) 621ms
   ✓ Bench search (1) 619ms
     name                      hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · TreeSearch findBy  34,892.20  0.0274  0.2356  0.0287  0.0287  0.0323  0.0342  0.0978  ±0.23%    17447
 ✓ bench/mapper.bench.ts (1) 608ms
   ✓ Bench mapper (1) 607ms
     name                                hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · FlatTreeWsMapper.toTreeNodes  2,145.13  0.4502  1.1320  0.4662  0.4564  0.6713  0.7166  0.8966  ±0.61%     1073


 BENCH  Summary

  FlatTreeWsMapper.toTreeNodes - bench/mapper.bench.ts > Bench mapper

  TreeSearch findBy - bench/search.bench.ts > Bench search
 
```

> See [benchmark file](https://github.com/belgattitude/httpx/blob/main/packages/treeu/bench/README.md) for details.

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/treeu/.size-limit.cjs)

| Scenario (esm)                                   | Size (compressed) |
|--------------------------------------------------|------------------:|
| `import { Tree } from '@httpx/treeu`             |            ~ 330B |
| `import { TreeSearch } from '@httpx/treeu`       |            ~ 310B |
| `import { FlatTreeWsMapper } from '@httpx/treeu` |            ~ 210B |


> For CJS usage (not recommended) track the size on [bundlephobia](https://bundlephobia.com/package/@httpx/treeu@latest).

## Compatibility

| Level      | CI | Description                                                                                                                                                                                                                                                                                                                                    |
|------------|----|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|  
| Node       | ✅  | CI for 18.x, 20.x & 22.x.                                                                                                                                                                                                                                                                                                                      |
| Browsers   | ✅  | [> 96%](https://browserslist.dev/?q=ZGVmYXVsdHMsIGNocm9tZSA%2BPSA5NixmaXJlZm94ID49IDkwLGVkZ2UgPj0gMTksc2FmYXJpID49IDEyLGlvcyA%2BPSAxMixvcGVyYSA%2BPSA3Nw%3D%3D) on 07/2024. Mins to [Chrome 96+, Firefox 90+, Edge 19+, iOS 12+, Safari 12+, Opera 77+](https://github.com/belgattitude/httpx/blob/main/packages/treeu/.browserslistrc) |
| Edge       | ✅  | Ensured on CI with [@vercel/edge-runtime](https://github.com/vercel/edge-runtime).                                                                                                                                                                                                                                                             | 
| Typescript | ✅  | TS 5.0 + / [are-the-type-wrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io) checks on CI.                                                                                                                                                                                                                                  |
| ES2022     | ✅  | Dist files checked with [es-check](https://github.com/yowainwright/es-check)                                                                                                                                                                                                                                                                   |
| Performance| ✅  | Monitored with [codspeed.io](https://codspeed.io/belgattitude/httpx)                                                                                                                                                                                                                                                                      |

> For _older_ browsers: most frontend frameworks can transpile the library (ie: [nextjs](https://nextjs.org/docs/app/api-reference/next-config-js/transpilePackages)...)

## Credits

This library wouldn't be possible without [@sindresorhus](https://github.com/sindresorhus) [is-plain-obj](https://github.com/sindresorhus/is-plain-obj).
It passes the same test suite and should be 100% compatible with it. Notable differences:

- [x] Slighly smaller bundle and performance.
- [x] Named export.
- [x] Provide a `PlainObject` type and `assertPlainObject` function.
- [x] Typescript convenience `PlainObject` type.
- [x] ESM and CJS formats.

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

MIT © [belgattitude](https://github.com/belgattitude) and contributors.
