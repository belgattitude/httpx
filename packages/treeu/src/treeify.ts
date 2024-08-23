import type { NodeProps, TreeNodeWithParents } from './types';

type Params = {
  separator: string;
};

type CollectorContext<
  TProps extends NodeProps | undefined = undefined,
  TKey extends string = string,
> = Record<'result', TreeNodeWithParents<TProps, TKey>[]> &
  Record<string, unknown>;

type DataAsObjectKeyPair<
  TProps extends NodeProps | undefined,
  TKey extends string,
> = {
  /** Unique key */
  key: TKey;
  props?: TProps | undefined;
}[];

export const treeify = <
  TProps extends NodeProps | undefined,
  TKey extends string,
>(
  data:
    | DataAsObjectKeyPair<TProps, TKey>
    | Readonly<DataAsObjectKeyPair<TProps, TKey>>,
  params: Params
): TreeNodeWithParents<TProps, TKey>[] => {
  const { separator } = params;
  const collector: CollectorContext<TProps, TKey> = { result: [] };
  for (const { key, props } of data) {
    let context: CollectorContext<TProps, TKey> = collector;
    const splitted = key.split(separator);
    for (const name of splitted) {
      if (!(name in context)) {
        context[name] = { result: [] };
        const parents = splitted.slice(0, -1) as TKey[];
        const children = (context[name] as CollectorContext<TProps, TKey>)
          .result;
        const node: TreeNodeWithParents<TProps, TKey> = {
          key: name as TKey,
          children: children,
          parents: parents,
        };
        if (props !== undefined) {
          node.props = props;
        }
        context.result.push(node);
      }
      context = context[name] as CollectorContext<TProps, TKey>;
    }
  }
  return collector.result;
};
