export type NodeProps = Record<string, unknown>;

export interface LeafNode<
  TProps extends NodeProps | undefined = undefined,
  TKey extends string = string,
> {
  key: TKey;
  children?: never;
  props?: TProps;
}

export interface ParentNode<
  TProps extends NodeProps | undefined = undefined,
  TKey extends string = string,
> {
  key: TKey;
  children: TreeNode<TProps>[];
  props?: TProps | undefined;
}

export type TreeNode<
  TProps extends NodeProps | undefined = undefined,
  TKey extends string = string,
> = LeafNode<TProps, TKey> | ParentNode<TProps, TKey>;
