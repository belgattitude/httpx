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

### Node 24

```
 RUN  v4.1.4 /home/sebastien/github/httpx/packages/treeu


 ✓ bench/search.bench.ts > Bench search (10_000 entries) 3956ms
     name                                                      hz     min      max    mean     p75     p99    p995    p999     rme  samples
   · DfsTreeSearch.findOne(id_0) over 10000          3,430,283.50  0.0002   1.2582  0.0003  0.0002  0.0006  0.0018  0.0080  ±1.09%  1715142
   · DfsTreeSearch.findOne(id_5000) over 10000           3,112.82  0.2228  25.0063  0.3213  0.3176  0.8564  1.0523  1.5798  ±9.87%     1557
   · DfsTreeSearch.findOne(id_7500) over 10000           2,230.60  0.3361   1.9703  0.4483  0.4610  1.0186  1.4219  1.9018  ±1.91%     1116
   · DfsTreeSearch.findOne(id_NotExists) over 10000      1,743.34  0.4133   8.7912  0.5736  0.5655  1.3223  1.7025  8.7912  ±4.64%      872

 ✓ bench/mapper.bench.ts > Bench mapper (10_000 entries) 656ms
     name                                      hz     min      max     mean      p75      p99     p995     p999      rme  samples
   · FlatTreeWsMapper.toTreeNodesOrThrow  87.5678  7.4232  25.5138  11.4197  14.6181  25.5138  25.5138  25.5138  ±11.99%       44

 BENCH  Summary

  FlatTreeWsMapper.toTreeNodesOrThrow - bench/mapper.bench.ts > Bench mapper (10_000 entries)

  DfsTreeSearch.findOne(id_0) over 10000 - bench/search.bench.ts > Bench search (10_000 entries)
    1101.99x faster than DfsTreeSearch.findOne(id_5000) over 10000
    1537.83x faster than DfsTreeSearch.findOne(id_7500) over 10000
    1967.65x faster than DfsTreeSearch.findOne(id_NotExists) over 10000

```

### Bun 1.3.12

```
 RUN  v4.1.4 /home/sebastien/github/httpx/packages/treeu


 ✓ bench/search.bench.ts > Bench search (10_000 entries) 3452ms
     name                                                      hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · DfsTreeSearch.findOne(id_0) over 10000          2,682,729.27  0.0002  6.2646  0.0004  0.0003  0.0013  0.0044  0.0124  ±3.29%  1341365
   · DfsTreeSearch.findOne(id_5000) over 10000           1,982.51  0.4166  6.5149  0.5044  0.4961  0.9569  1.3263  6.5149  ±3.54%      993
   · DfsTreeSearch.findOne(id_7500) over 10000           1,324.26  0.6295  5.9458  0.7551  0.7604  1.2362  1.3621  5.9458  ±2.88%      663
   · DfsTreeSearch.findOne(id_NotExists) over 10000        901.15  0.8252  7.5179  1.1097  1.0764  3.3999  3.6177  7.5179  ±4.71%      451

 ✓ bench/mapper.bench.ts > Bench mapper (10_000 entries) 654ms
     name                                     hz     min      max    mean     p75      p99     p995     p999      rme  samples
   · FlatTreeWsMapper.toTreeNodesOrThrow  129.23  4.7287  18.6373  7.7380  9.7776  18.6373  18.6373  18.6373  ±10.68%       66

 BENCH  Summary

  DfsTreeSearch.findOne(id_0) over 10000 - bench/search.bench.ts > Bench search (10_000 entries)
    1353.20x faster than DfsTreeSearch.findOne(id_5000) over 10000
    2025.83x faster than DfsTreeSearch.findOne(id_7500) over 10000
    2977.00x faster than DfsTreeSearch.findOne(id_NotExists) over 10000

  FlatTreeWsMapper.toTreeNodesOrThrow - bench/mapper.bench.ts > Bench mapper (10_000 entries)
```


> See [benchmark file](https://github.com/belgattitude/httpx/blob/main/packages/treeu/bench/README.md) for details.

## Bundle size

Bundle size is tracked by a [size-limit configuration](https://github.com/belgattitude/httpx/blob/main/packages/treeu/.size-limit.ts)

| Scenario (esm)                                   | Size (compressed) |
|--------------------------------------------------|------------------:|
| `import { DfsTreeSearch } from '@httpx/treeu`    |            ~ 270B |
| `import { FlatTreeWsMapper } from '@httpx/treeu` |            ~ 802B |


> For CJS usage (not recommended) track the size on [bundlephobia](https://bundlephobia.com/package/@httpx/treeu@latest).

## Compatibility

| Level        | CI | Description                                                                                                                                                                                                                                                                                                                                                                                |
|--------------|---|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|  
| Node         | ✅ | CI for 20.x, 22.x, 24.x & 25.x.                                                                                                                                                                                                                                                                                                                                                                   |
| Browser      | ✅ | Tested with latest chrome (vitest/playwright)                                                                                                                                                                                                                                                                                                                                              |
| Browserslist | ✅ | [> 95%](https://browserslist.dev/?q=ZGVmYXVsdHMsIGNocm9tZSA%2BPSA5NiwgZmlyZWZveCA%2BPSAxMDUsIGVkZ2UgPj0gMTEzLCBzYWZhcmkgPj0gMTUsIGlvcyA%2BPSAxNSwgb3BlcmEgPj0gMTAzLCBub3QgZGVhZA%3D%3D) on 01/2025. [defaults, chrome >= 96, firefox >= 105, edge >= 113, safari >= 15, ios >= 15, opera >= 103, not dead](https://github.com/belgattitude/httpx/blob/main/packages/treeu/.browserslistrc) |
| Bun          | ✅ | Tested with latest (at time of writing >= 1.3.3)                                                                                                                                                                                                                                                                                                                                              |
| Edge         | ✅ | Ensured on CI with [@vercel/edge-runtime](https://github.com/vercel/edge-runtime).                                                                                                                                                                                                                                                                                                         | 
| Cloudflare   | ✅ | Ensured with @cloudflare/vitest-pool-workers (see [wrangler.toml](https://github.com/belgattitude/httpx/blob/main/devtools/vitest/wrangler.toml)                                                                                                                                                                                                                                           |
| Edge         | ✅ | Ensured on CI with [@vercel/edge-runtime](https://github.com/vercel/edge-runtime).                                                                                                                                                                                                                                                                                                         | 
| Typescript   | ✅ | TS 5.0 + / [are-the-type-wrong](https://github.com/arethetypeswrong/arethetypeswrong.github.io) checks on CI.                                                                                                                                                                                                                                                                              |
| ES2022       | ✅ | Dist files checked with [es-check](https://github.com/yowainwright/es-check)                                                                                                                                                                                                                                                                                                               |
| Performance  | ✅ | Monitored with [codspeed.io](https://codspeed.io/belgattitude/httpx)                                                                                                                                                                                                                                                                                                                       |

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
