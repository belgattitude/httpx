[**@httpx/treeu v0.4.12**](../README.md)

***

[@httpx/treeu](../README.md) / DfsTreeSearch

# Class: DfsTreeSearch\<TValue, TKey\>

Depth-First Search (DFS) algorithm for tree structures. It uses a stack rather
than recursion in order to support deeply nested trees without call-stack overflows.
It is well suited for exploring a branch of a data structure in depth and
usually preferred when memory usage is a concern or when the data
structure has many nodes with few levels.

## See

https://hackernoon.com/a-beginners-guide-to-bfs-and-dfs-in-javascript

## Type Parameters

### TValue

`TValue` *extends* [`TreeNodeValue`](../type-aliases/TreeNodeValue.md) \| `undefined`

### TKey

`TKey` *extends* `string` \| `number` = `string`

## Constructors

### Constructor

> **new DfsTreeSearch**\<`TValue`, `TKey`\>(`treeNodes`): `DfsTreeSearch`\<`TValue`, `TKey`\>

#### Parameters

##### treeNodes

[`TreeNode`](../type-aliases/TreeNode.md)\<`TValue`, `TKey`\>[]

#### Returns

`DfsTreeSearch`\<`TValue`, `TKey`\>

## Methods

### findOne()

> **findOne**(`idOrConditionOrFn`, `params?`): `undefined` \| `TreeNodeOptionalChildren`\<`TValue`, `TKey`\>

Find first matching node in the tree. The `reverse` parameter can be used
to traverse the tree in reverse order.

#### Parameters

##### idOrConditionOrFn

`NativeNodeSearchKeys` | `TKey` | (`treeNode`) => `boolean`

##### params?

`TreeSearchFindParams`

#### Returns

`undefined` \| `TreeNodeOptionalChildren`\<`TValue`, `TKey`\>
