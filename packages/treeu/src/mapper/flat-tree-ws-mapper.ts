import type { TreeNode, TreeNodeValue } from '../tree.types';
import type { TreeMapperResult } from './mapper.types';

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

export const FLAT_TREE_WS_MAPPER_ERR_MSG = {
  toTreeNodes: {
    parsedErrorMsg: `Can't map the flat tree to tree nodes`,
    issues: {
      NON_STRING_KEY: 'Non-string key found',
      EMPTY_KEY: 'Empty key given',
      DUPLICATE: 'Duplicate key found',
    },
  },
} as const;

const ensureCorrectKeys = <
  TValue extends TreeNodeValue | undefined,
  TKey extends string = string,
>(
  data: FlatTreeWs<TValue, TKey> | Readonly<FlatTreeWs<TValue, TKey>>
): void => {
  const uniqueKeys = new Set<string>();
  for (const { key } of data) {
    if (typeof key !== 'string') {
      throw new TypeError(
        `${FLAT_TREE_WS_MAPPER_ERR_MSG.toTreeNodes.issues.NON_STRING_KEY}`
      );
    }
    if (uniqueKeys.has(key)) {
      throw new Error(
        `${FLAT_TREE_WS_MAPPER_ERR_MSG.toTreeNodes.issues.DUPLICATE}: "${key}"`
      );
    }
    uniqueKeys.add(key);
  }
};

export class FlatTreeWsMapper {
  toTreeNodes = <
    TValue extends TreeNodeValue | undefined,
    TKey extends string = string,
  >(
    data: FlatTreeWs<TValue, TKey> | Readonly<FlatTreeWs<TValue, TKey>>,
    params: FlatTreeWsParams
    // eslint-disable-next-line sonarjs/cognitive-complexity
  ): TreeMapperResult<TValue, TKey> => {
    const { separator } = params;

    const collector: CollectorContext<TValue, TKey> = { result: [] };
    try {
      for (const { key, value } of data) {
        ensureCorrectKeys(data);
        const trimmedKey = key.trim() as TKey;
        if (trimmedKey.length === 0) {
          throw new Error(
            `${FLAT_TREE_WS_MAPPER_ERR_MSG.toTreeNodes.issues.EMPTY_KEY}`
          );
        }

        let context: CollectorContext<TValue, TKey> = collector;
        const splitted = trimmedKey.split(separator);
        for (const name of splitted) {
          if (!(name in context)) {
            context[name] = { result: [] };
            const parents = splitted.slice(0, -1) as TKey[];
            const parentId = (parents.length > 0
              ? parents.join(separator)
              : null) as unknown as TKey | null;
            const children = (context[name] as CollectorContext<TValue, TKey>)
              .result;
            const node: TreeNode<TValue, TKey> = {
              id: trimmedKey,
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
    } catch (e) {
      return {
        success: false,
        message: FLAT_TREE_WS_MAPPER_ERR_MSG.toTreeNodes.parsedErrorMsg,
        issues: [{ message: `${(e as Error).message}` }],
      };
    }
    return {
      success: true,
      treeNodes: collector.result,
    };
  };
}
