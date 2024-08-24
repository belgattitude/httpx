import type { TreeNode, TreeNodeValue } from '../tree.types';

type FlatTreeWsParams = {
  separator: string;
};

type KeyWithSeparator = string;

export type FlatTreeWs<
  TValue extends TreeNodeValue | undefined,
  TKey extends KeyWithSeparator = string,
> = {
  /** Unique key with separator */
  key: TKey;
  value?: TValue | undefined;
}[];

type CollectorContext<
  TValue extends TreeNodeValue | undefined = undefined,
  TKey extends string = string,
> = Record<'result', TreeNode<TValue, TKey>[]> & Record<string, unknown>;

type ParsedTreeError = unknown;

export type ParsedTreeResult<
  TValue extends TreeNodeValue | undefined,
  TKey extends string = string,
> =
  | {
      success: true;
      treeNodes: TreeNode<TValue, TKey>[];
      /*
      indexes?:
        | {
            parents?: Map<TKey, TKey[]> | undefined;
          }
        | undefined; */
    }
  | {
      success: false;
      errors: ParsedTreeError[];
    };

export const FlatTreeWsMapper = {
  toTreeNodes: <
    TValue extends TreeNodeValue | undefined,
    TKey extends string = string,
  >(
    data: FlatTreeWs<TValue, TKey> | Readonly<FlatTreeWs<TValue, TKey>>,
    params: FlatTreeWsParams
  ): ParsedTreeResult<TValue, TKey> => {
    const { separator } = params;
    const collector: CollectorContext<TValue, TKey> = { result: [] };
    for (const { key, value } of data) {
      let context: CollectorContext<TValue, TKey> = collector;
      const splitted = key.split(separator);
      for (const name of splitted) {
        if (!(name in context)) {
          context[name] = { result: [] };
          const parents = splitted.slice(0, -1) as TKey[];
          const parentId = (parents.length > 0
            ? parents.join(separator)
            : undefined) as unknown as TKey | undefined;
          const children = (context[name] as CollectorContext<TValue, TKey>)
            .result;
          const node: TreeNode<TValue, TKey> = {
            id: key,
            parentId: parentId,
            children: children,
          };
          if (value !== undefined) {
            node.value = value;
          }
          context.result.push(node);
        }
        context = context[name] as CollectorContext<TValue, TKey>;
      }
    }
    return {
      success: true,
      treeNodes: collector.result,
    };
  },
};
