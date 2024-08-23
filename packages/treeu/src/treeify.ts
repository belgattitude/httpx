import type { NodeProps, TreeNode } from './types';

type Params = {
  separator: string;
};

type TreeifyContext<
  TProps extends NodeProps | undefined = undefined,
  TKey extends string = string,
> = Record<'result', TreeNode<TProps, TKey>[]> & Record<string, unknown>;

type Data<TProps extends NodeProps | undefined, TKey extends string> = {
  key: TKey;
  props?: TProps | undefined;
}[];

export const treeify = <
  TProps extends NodeProps | undefined,
  TKey extends string,
>(
  paths: Data<TProps, TKey> | Readonly<Data<TProps, TKey>>,
  params: Params
): TreeNode<TProps, TKey>[] => {
  const { separator } = params;
  const final: TreeifyContext<TProps, TKey> = { result: [] };
  for (const { key, props } of paths) {
    let context: TreeifyContext<TProps, TKey> = final;
    for (const name of key.split(separator)) {
      if (!(name in context)) {
        context[name] = { result: [] };
        const node: TreeNode<TProps, TKey> = {
          key: name as TKey,
          children: (context[name] as TreeifyContext<TProps, TKey>).result,
        };
        if (props !== undefined) {
          node.props = props;
        }
        context.result.push(node);
      }
      context = context[name] as TreeifyContext<TProps, TKey>;
    }
  }
  return final.result;
};
