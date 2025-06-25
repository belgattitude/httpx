[**@httpx/treeu v0.4.15**](../README.md)

***

[@httpx/treeu](../README.md) / TreeParentNode

# Interface: TreeParentNode\<TValue, TId\>

## Type Parameters

### TValue

`TValue` *extends* [`TreeNodeValue`](../type-aliases/TreeNodeValue.md) \| `undefined` = `undefined`

### TId

`TId` *extends* `TreeNodeValidId` = `string`

## Properties

### children

> **children**: [`TreeNode`](../type-aliases/TreeNode.md)\<`TValue`, `TId`\>[]

***

### id

> **id**: `TId`

***

### parentId

> **parentId**: `null` \| `TId`

***

### value?

> `optional` **value**: `TValue`
