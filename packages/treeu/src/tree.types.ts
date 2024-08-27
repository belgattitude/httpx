export type TreeNodeValue =
  | Record<string, unknown>
  | string
  | number
  | boolean
  | null;

type TreeNodeValidId = string | number;

export interface TreeLeafNode<
  TValue extends TreeNodeValue | undefined = undefined,
  TId extends TreeNodeValidId = string,
> {
  id: TId;
  parentId: TId;
  children: [];
  value?: TValue | undefined;
}

export interface TreeParentNode<
  TValue extends TreeNodeValue | undefined = undefined,
  TId extends TreeNodeValidId = string,
> {
  id: TId;
  parentId: TId | null;
  children: TreeNode<TValue, TId>[];
  value?: TValue | undefined;
}

export interface TreeRootNode<
  TValue extends TreeNodeValue | undefined = undefined,
  TId extends TreeNodeValidId = string,
> {
  id: TId;
  parentId: null;
  children: TreeNode<TValue, TId>[];
  value?: TValue | undefined;
}

export type TreeNode<
  TValue extends TreeNodeValue | undefined = undefined,
  TId extends TreeNodeValidId = string,
> =
  | TreeRootNode<TValue, TId>
  | TreeParentNode<TValue, TId>
  | TreeLeafNode<TValue, TId>;
