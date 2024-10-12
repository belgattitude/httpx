# @httpx/treeu

[Fast](#benchmarks) and lightweight ([~300B](#bundle-size)) utilities to work with trees.

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

- 👉&nbsp; Lightweight (starts at [~350B](#bundle-size)) and [node, browser and edge support](#compatibility).
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
 RUN  v2.0.5 

 ✓ bench/search.bench.ts (4) 6714ms
   ✓ Bench search (10_000 entries) (4) 6713ms
     name                                                       hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · DfsTreeSearch.findOne(id_0) over 10_000          9,360,159.92  0.0001  3.5234  0.0001  0.0001  0.0002  0.0002  0.0004  ±1.88%  4680081   fastest
   · DfsTreeSearch.findOne(id_1000) over 10_000          64,337.37  0.0097  0.7432  0.0155  0.0151  0.0437  0.0752  0.2380  ±1.09%    32169
   · DfsTreeSearch.findOne(id_5000) over 10_000          13,027.78  0.0505  0.9968  0.0768  0.0753  0.2389  0.2790  0.4839  ±1.33%     6514
   · DfsTreeSearch.findOne(id_NotExists) over 10_000      6,335.21  0.1020  0.8740  0.1578  0.1582  0.4216  0.4970  0.6655  ±1.47%     3168   slowest
 ✓ bench/mapper.bench.ts (1) 621ms
   ✓ Bench mapper (10_000 entries) (1) 620ms
     name                                     hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · FlatTreeWsMapper.toTreeNodesOrThrow  323.01  2.1707  9.7894  3.0959  3.5083  9.2491  9.7894  9.7894  ±5.95%      162


 BENCH  Summary

  FlatTreeWsMapper.toTreeNodesOrThrow - bench/mapper.bench.ts > Bench mapper (10_000 entries)

  DfsTreeSearch.findOne(id_0) over 10_000 - bench/search.bench.ts > Bench search (10_000 entries)
    145.49x faster than DfsTreeSearch.findOne(id_1000) over 10_000
    718.48x faster than DfsTreeSearch.findOne(id_5000) over 10_000
    1477.48x faster than DfsTreeSearch.findOne(id_NotExists) over 10_000
 
```

> See [benchmark file](https://github.com/belgattitude/httpx/blob/main/packages/treeu/bench/README.md) for details.

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/treeu/.size-limit.cjs)

| Scenario (esm)                                   | Size (compressed) |
|--------------------------------------------------|------------------:|
| `import { DfsTreeSearch } from '@httpx/treeu`       |            ~ 350B |
| `import { FlatTreeWsMapper } from '@httpx/treeu` |            ~ 800B |


> For CJS usage (not recommended) track the size on [bundlephobia](https://bundlephobia.com/package/@httpx/treeu@latest).

## Compatibility

| Level      | CI | Description                                                                                                                                                                                                                                                                                                                                    |
|------------|----|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|  
| Node       | ✅  | CI for 18.x, 20.x & 22.x.                                                                                                                                                                                                                                                                                                                      |
| Browser      | ✅  | Tested with latest chrome (vitest/playwright)                                                                                                                                                                                                                                                                                            |
| Browsers   | ✅  | [> 96%](https://browserslist.dev/?q=ZGVmYXVsdHMsIGNocm9tZSA%2BPSA5NixmaXJlZm94ID49IDkwLGVkZ2UgPj0gMTksc2FmYXJpID49IDEyLGlvcyA%2BPSAxMixvcGVyYSA%2BPSA3Nw%3D%3D) on 07/2024. Mins to [Chrome 96+, Firefox 90+, Edge 19+, iOS 12+, Safari 12+, Opera 77+](https://github.com/belgattitude/httpx/blob/main/packages/treeu/.browserslistrc) |
| Edge         | ✅  | Ensured on CI with [@vercel/edge-runtime](https://github.com/vercel/edge-runtime).                                                                                                                                                                                                                                                       | 
| Cloudflare   | ✅  | Ensured with @cloudflare/vitest-pool-workers (see [wrangler.toml](https://github.com/belgattitude/httpx/blob/main/devtools/vitest/wrangler.toml)                                                                                                                                                                                         |
| Edge       | ✅  | Ensured on CI with [@vercel/edge-runtime](https://github.com/vercel/edge-runtime).                                                                                                                                                                                                                                                             | 
| Typescript | ✅  | TS 5.0 + / [are-the-type-wrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io) checks on CI.                                                                                                                                                                                                                                  |
| ES2022     | ✅  | Dist files checked with [es-check](https://github.com/yowainwright/es-check)                                                                                                                                                                                                                                                                   |
| Performance| ✅  | Monitored with [codspeed.io](https://codspeed.io/belgattitude/httpx)                                                                                                                                                                                                                                                                      |

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
