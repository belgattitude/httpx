[**@httpx/treeu v0.5.7**](../README.md)

---

[@httpx/treeu](../README.md) / FlatTreeWsMapper

# Class: FlatTreeWsMapper\<TValue, TKey\>

## Type Parameters

### TValue

`TValue` _extends_ [`TreeNodeValue`](../type-aliases/TreeNodeValue.md)

### TKey

`TKey` _extends_ `string` = `string`

## Constructors

### Constructor

> **new FlatTreeWsMapper**\<`TValue`, `TKey`\>(): `FlatTreeWsMapper`\<`TValue`, `TKey`\>

#### Returns

`FlatTreeWsMapper`\<`TValue`, `TKey`\>

## Methods

### fromTreeNodesOrThrow()

> **fromTreeNodesOrThrow**\<`TId`\>(`treeNodes`, `params`): `FlatTreeWsMap`\<`TValue`, `TKey`\>

Will convert a tree of nodes to a flat tree.

#### Type Parameters

##### TId

`TId` _extends_ `string` = `string`

#### Parameters

##### treeNodes

[`TreeNode`](../type-aliases/TreeNode.md)\<`TValue`, `TId`\>[]

##### params

###### method

`"breadth-first"`

#### Returns

`FlatTreeWsMap`\<`TValue`, `TKey`\>

---

### toTreeNodes()

> **toTreeNodes**(`data`, `params`): `TreeMapperResult`\<`TValue`, `TKey`\>

#### Parameters

##### data

[`FlatTreeWs`](../type-aliases/FlatTreeWs.md)\<`TValue`, `TKey`\>

##### params

`FlatTreeWsParams`

#### Returns

`TreeMapperResult`\<`TValue`, `TKey`\>

---

### toTreeNodesOrThrow()

> **toTreeNodesOrThrow**(`data`, `params`): [`TreeNode`](../type-aliases/TreeNode.md)\<`TValue`, `TKey`\>[]

#### Parameters

##### data

[`FlatTreeWs`](../type-aliases/FlatTreeWs.md)\<`TValue`, `TKey`\>

##### params

`FlatTreeWsParams`

#### Returns

[`TreeNode`](../type-aliases/TreeNode.md)\<`TValue`, `TKey`\>[]

#### Throws

Error
