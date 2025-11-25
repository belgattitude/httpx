# @httpx/treeu

[Fast](#benchmarks) and lightweight ([~300B](#bundle-size)) utilities to work with trees.

[![npm](https://img.shields.io/npm/v/@httpx/treeu?style=for-the-badge&label=Npm&labelColor=444&color=informational)](https://www.npmjs.com/package/@httpx/treeu)
[![changelog](https://img.shields.io/static/v1?label=&message=changelog&logo=github&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/treeu/CHANGELOG.md)
[![codecov](https://img.shields.io/codecov/c/github/belgattitude/httpx?logo=codecov&label=Unit&flag=httpx-treeu-unit&style=for-the-badge&labelColor=444)](https://app.codecov.io/gh/belgattitude/httpx/tree/main/packages%2Ftreeu)
[![bundles](https://img.shields.io/static/v1?label=&message=cjs|esm@treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/httpx/blob/main/packages/treeu/.size-limit.cjs)
[![node](https://img.shields.io/static/v1?label=Node&message=20%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](#compatibility)
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

- 👉&nbsp; Lightweight (starts at [~350B](#bundle-size)) and [node, bun, browser and edge support](#compatibility).
- 👉&nbsp; Available in ESM and CJS formats.

## Documentation

👉 [Official website](https://belgattitude.github.io/httpx/treeu) or [Github Readme](https://github.com/belgattitude/httpx/tree/main/packages/treeu#readme)

## Usage

### Search

#### DFSTreeSearch

Depth-First Search (DFS) algorithm for tree structures. It uses a stack rather
than recursion in order to support deeply nested trees without call-stack overflows.
It is well suited for exploring a branch of a data structure in depth and
usually preferred when memory usage is a concern or when the data
structure has many nodes with few levels.

```typescript
import { Tree, type TreeNode } from '@httpx/treeu';

type CustomValue =
    | { type: 'folder'; size?: never }
    | { type: 'file'; size: number };

const treeNodes: TreeNode<CustomValue>[] = [
    {
        id: 'file2.ts',
        parentId: null,
        value: { size: 10, type: 'file' },
        children: [],
    },
    {
        id: 'folder1',
        parentId: null,
        value: { type: 'folder' },
        children: [
            {
                id: 'folder1/file1.ts',
                parentId: 'folder1',
                value: { size: 30, type: 'file' },
                children: [],
            },
        ],
    },
];

const search = new DfsTreeSearch<CustomValue>(treeNodes);
const res1 = search.findOne('folder1/file1.ts');
const res2 = search.findOne(['id', '===', 'folder1/file1.ts']);
const res3 = search.findOne((treeNode) => treeNode.value.size === 30);
const res4 = search.findOne(['parentId', '===', 'folder1']);

// res1 === res2 === res3 === res4

```

### Mapper

#### FlatTreeWsMapper

| FlatTreeWsMapper | Description                                 |
|------------------|---------------------------------------------|
| `toTreeNodes`    | Convert to flat map with separator          |
| `fromTreeNodes`  | Convert a tree to a flat map with separator |

```typescript
import { FlatTreeWsMapper, type FlatTreeWs } from '@httpx/treeu';

type CustomValue =
    | { type: 'folder'; size?: never }
    | { type: 'file'; size: number };

// Use an object or a Record<string, CustomValue>
const paths: FlatTreeWs<CustomValue> = new Map([
    [ 'file1.ts', { type: 'file', size: 10 } ],
    [ 'folder1', { type: 'folder' }],
    [ 'folder1/file1.ts', { type: 'file', size: 30 }],
]);

const mapper = new FlatTreeWsMapper<CustomValue>();

const treeResult = mapper.toTreeNodes(paths, {
    separator: '/',
});

// Will return 
const expected: TreeNode<CustomValue>[] = [
    {
        id: 'file1.ts',
        parentId: null,
        value: {
            size: 10,
            type: 'file',
        },
        children: [],
    },
    {
        id: 'folder1',
        parentId: null,
        value: {
            type: 'folder',
        },
        children: [
            {
                id: 'folder1/file1.ts',
                parentId: 'folder1',
                value: {
                    size: 30,
                    type: 'file',
                },
                children: [],
            },
        ],
    },
];

```

### TreeNode

#### Example

Example of `TreeNode[]` typing:

```typescript
import { Tree, TreeNode } from '@httpx/treeu';

type CustomValue =
    | { type: 'folder'; size?: never }
    | { type: 'file'; size: number };

const treeNodes: TreeNode<CustomValue>[] = [
    {
        id: 'file1.ts',
        parentId: null,
        value: {
            size: 10,
            type: 'file',
        },
        children: [],
    },
    {
        id: 'file2.ts',
        parentId: null,
        value: {
            size: 20,
            type: 'file',
        },
        children: [],
    },
    {
        id: 'folder1',
        parentId: null,
        value: {
            type: 'folder',
        },
        children: [
            {
                id: 'folder1/file1.ts',
                parentId: 'folder1',
                value: {
                    size: 30,
                    type: 'file',
                },
                children: [],
            },
        ],
    },
    {
        id: 'folder2',
        parentId: null,
        value: {
            type: 'folder',
        },
        children: [
            {
                id: 'folder2/file1.ts',
                parentId: 'folder2',
                value: {
                    size: 40,
                    type: 'file',
                },
                children: [],
            },
            {
                id: 'folder2/subfolder1',
                parentId: 'folder2',
                value: {
                    type: 'folder',
                },
                children: [
                    {
                        id: 'folder2/subfolder1/file1.ts',
                        parentId: 'folder2/subfolder1',
                        value: {
                            size: 50,
                            type: 'file',
                        },
                        children: [],
                    },
                ],
            },
        ],
    },
    {
        id: 'folder3',
        parentId: null,
        value: {
            type: 'folder',
        },
        children: [],
    },
];
```

## Tree

### Types

| TreeNode<TValue, TId> | Type                            | Description                           |
|-----------------------|---------------------------------|---------------------------------------|
| id                    | `TValue extends string\|number` | Unique identifier of the node.        |
| parentId              | `TValue extends string\|number` | Reference to the parent node          |
| children              | `TreeNode<TValue, TId>[]`       | Children nodes                        |
| value                 | `TValue\|undefined`             | Custom value associated with the node |

## Benchmarks

> Performance is continuously monitored thanks to [codspeed.io](https://codspeed.io/belgattitude/httpx). 
>
> [![CodSpeed Badge](https://img.shields.io/endpoint?url=https://codspeed.io/badge.json)](https://codspeed.io/belgattitude/httpx)

```
 RUN  v3.0.3 /home/sebastien/github/httpx/packages/treeu


 ✓ bench/search.bench.ts > Bench search (10_000 entries) 3827ms
     name                                                       hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · DfsTreeSearch.findOne(id_0) over 10_000          4,951,722.70  0.0002  0.2812  0.0002  0.0002  0.0004  0.0005  0.0009  ±0.36%  2475862   fastest
   · DfsTreeSearch.findOne(id_1000) over 10_000          36,877.99  0.0242  0.2565  0.0271  0.0265  0.0417  0.0496  0.1387  ±0.39%    18439
   · DfsTreeSearch.findOne(id_5000) over 10_000           7,109.04  0.1321  0.4006  0.1407  0.1401  0.2237  0.2336  0.3525  ±0.35%     3555
   · DfsTreeSearch.findOne(id_NotExists) over 10_000      3,637.79  0.2513  0.5789  0.2749  0.2768  0.3892  0.4068  0.5149  ±0.43%     1819   slowest

 ✓ bench/mapper.bench.ts > Bench mapper (10_000 entries) 647ms
     name                                     hz     min      max    mean     p75      p99     p995     p999     rme  samples
   · FlatTreeWsMapper.toTreeNodesOrThrow  148.37  6.3635  11.2594  6.7397  6.8240  11.2594  11.2594  11.2594  ±2.05%       75

 BENCH  Summary

  FlatTreeWsMapper.toTreeNodesOrThrow - bench/mapper.bench.ts > Bench mapper (10_000 entries)

  DfsTreeSearch.findOne(id_0) over 10_000 - bench/search.bench.ts > Bench search (10_000 entries)
    134.27x faster than DfsTreeSearch.findOne(id_1000) over 10_000
    696.54x faster than DfsTreeSearch.findOne(id_5000) over 10_000
    1361.19x faster than DfsTreeSearch.findOne(id_NotExists) over 10_000

```

> See [benchmark file](https://github.com/belgattitude/httpx/blob/main/packages/treeu/bench/README.md) for details.

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/treeu/.size-limit.ts)

| Scenario (esm)                                   | Size (compressed) |
|--------------------------------------------------|------------------:|
| `import { DfsTreeSearch } from '@httpx/treeu`       |            ~ 270B |
| `import { FlatTreeWsMapper } from '@httpx/treeu` |            ~ 802B |


> For CJS usage (not recommended) track the size on [bundlephobia](https://bundlephobia.com/package/@httpx/treeu@latest).

## Compatibility

| Level      | CI | Description                                                                                                                                                                                                                                                                                                                                                                                |
|------------|----|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|  
| Node         | ✅   | CI for 20.x, 22.x, 24.x & 25.x.                                                                                                                                                                                                                                                                                                                                                                   |
| Browser      | ✅  | Tested with latest chrome (vitest/playwright)                                                                                                                                                                                                                                                                                                                                              |
| Browserslist | ✅  | [> 95%](https://browserslist.dev/?q=ZGVmYXVsdHMsIGNocm9tZSA%2BPSA5NiwgZmlyZWZveCA%2BPSAxMDUsIGVkZ2UgPj0gMTEzLCBzYWZhcmkgPj0gMTUsIGlvcyA%2BPSAxNSwgb3BlcmEgPj0gMTAzLCBub3QgZGVhZA%3D%3D) on 01/2025. [defaults, chrome >= 96, firefox >= 105, edge >= 113, safari >= 15, ios >= 15, opera >= 103, not dead](https://github.com/belgattitude/httpx/blob/main/packages/treeu/.browserslistrc) |
| Bun          | ✅  | Tested with latest (at time of writing >= 1.3.3)                                                                                                                                                                                                                                                                                                                                              |
| Edge         | ✅  | Ensured on CI with [@vercel/edge-runtime](https://github.com/vercel/edge-runtime).                                                                                                                                                                                                                                                                                                         | 
| Cloudflare   | ✅  | Ensured with @cloudflare/vitest-pool-workers (see [wrangler.toml](https://github.com/belgattitude/httpx/blob/main/devtools/vitest/wrangler.toml)                                                                                                                                                                                                                                           |
| Edge       | ✅  | Ensured on CI with [@vercel/edge-runtime](https://github.com/vercel/edge-runtime).                                                                                                                                                                                                                                                                                                         | 
| Typescript | ✅  | TS 5.0 + / [are-the-type-wrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io) checks on CI.                                                                                                                                                                                                                                                                              |
| ES2022     | ✅  | Dist files checked with [es-check](https://github.com/yowainwright/es-check)                                                                                                                                                                                                                                                                                                               |
| Performance| ✅  | Monitored with [codspeed.io](https://codspeed.io/belgattitude/httpx)                                                                                                                                                                                                                                                                                                                       |

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

MIT © [belgattitude](https://github.com/belgattitude) and contributors.
