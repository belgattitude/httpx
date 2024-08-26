export type TreeNodeValue = Record<string, unknown> | string | number | boolean;

type ValidId = string | number;

export interface LeafNode<
  TValue extends TreeNodeValue | undefined = undefined,
  TId extends ValidId = string,
> {
  id: TId;
  parentId: TId;
  children: [];
  value?: TValue | undefined;
}

export interface ParentNode<
  TValue extends TreeNodeValue | undefined = undefined,
  TId extends ValidId = string,
> {
  id: TId;
  parentId: TId | null;
  children: TreeNode<TValue>[];
  value?: TValue | undefined;
}

export interface RootNode<
  TValue extends TreeNodeValue | undefined = undefined,
  TId extends ValidId = string,
> {
  id: TId;
  parentId: null;
  children: TreeNode<TValue>[];
  value?: TValue | undefined;
}

export type TreeNode<
  TValue extends TreeNodeValue | undefined = undefined,
  TId extends ValidId = string,
> = RootNode<TValue, TId> | ParentNode<TValue, TId> | LeafNode<TValue, TId>;
