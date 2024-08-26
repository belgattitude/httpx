import { isPlainObject } from '@httpx/plain-object';

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
      ARG_NOT_ARRAY: 'Invalid argument: not an array (FlatTreeWs)',
      ARG_NOT_OBJECT_ARRAY:
        'Invalid argument: not an array of objects (FlatTreeWs)',
      NON_STRING_KEY: 'Non-string key',
      EMPTY_KEY: 'Empty key given',
      SPLIT_EMPTY_KEY: 'Split an empty key',
      DUPLICATE: 'Duplicate key',
    },
  },
} as const;

export class FlatTreeWsMapper<
  TValue extends TreeNodeValue | undefined,
  TKey extends string = string,
> {
  assertFlatTreeWs(data: unknown): asserts data is FlatTreeWs<TValue, TKey> {
    if (!Array.isArray(data)) {
      throw new TypeError(
        `${FLAT_TREE_WS_MAPPER_ERR_MSG.toTreeNodes.issues.ARG_NOT_ARRAY}`
      );
    }
    const uniqueKeys = new Set<string>();
    for (const row of data) {
      if (!isPlainObject(row)) {
        throw new TypeError(
          `${FLAT_TREE_WS_MAPPER_ERR_MSG.toTreeNodes.issues.ARG_NOT_OBJECT_ARRAY}`
        );
      }
      const { key } = row;
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
  }
  toTreeNodes = (
    data: FlatTreeWs<TValue, TKey> | Readonly<FlatTreeWs<TValue, TKey>>,
    params: FlatTreeWsParams
    // eslint-disable-next-line sonarjs/cognitive-complexity
  ): TreeMapperResult<TValue, TKey> => {
    const { separator } = params;

    const collector: CollectorContext<TValue, TKey> = { result: [] };

    try {
      this.assertFlatTreeWs(data);
      for (const { key, value } of data) {
        const trimmedKey = key.trim() as TKey;
        if (trimmedKey.length === 0) {
          throw new Error(
            `${FLAT_TREE_WS_MAPPER_ERR_MSG.toTreeNodes.issues.EMPTY_KEY}`
          );
        }

        let context: CollectorContext<TValue, TKey> = collector;
        const splitted = trimmedKey.split(separator);
        for (const name of splitted) {
          if (name.trim().length === 0) {
            throw new Error(
              `${FLAT_TREE_WS_MAPPER_ERR_MSG.toTreeNodes.issues.SPLIT_EMPTY_KEY}`
            );
          }
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
