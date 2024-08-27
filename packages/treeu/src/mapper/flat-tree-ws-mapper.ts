import { isPlainObject } from '@httpx/plain-object';

import type { TreeNode, TreeNodeValue } from '../tree.types';
import type { TreeMapperResult } from './mapper.types';

type FlatTreeWsParams = {
  separator: string;
};

type FlatTreeWsUniqueKey = string;

export type FlatTreeWs<
  TValue extends TreeNodeValue | undefined,
  TKey extends FlatTreeWsUniqueKey = string,
> = {
  /** Unique key with separator */
  key: TKey;
  value?: TValue | undefined;
}[];

type CollectorContext<
  TValue extends TreeNodeValue | undefined = undefined,
  TKey extends string = string,
> = Record<'result', TreeNode<TValue, TKey>[]> & Record<string, unknown>;

export const flatTreeWsMapperIssues = {
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
        `${flatTreeWsMapperIssues.toTreeNodes.issues.ARG_NOT_ARRAY}`
      );
    }
    const uniqueKeys = new Set<string>();
    for (const row of data) {
      if (!isPlainObject(row)) {
        throw new TypeError(
          `${flatTreeWsMapperIssues.toTreeNodes.issues.ARG_NOT_OBJECT_ARRAY}`
        );
      }
      const { key } = row;
      if (typeof key !== 'string') {
        throw new TypeError(
          `${flatTreeWsMapperIssues.toTreeNodes.issues.NON_STRING_KEY}`
        );
      }
      if (uniqueKeys.has(key)) {
        throw new Error(
          `${flatTreeWsMapperIssues.toTreeNodes.issues.DUPLICATE}: "${key}"`
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
            `${flatTreeWsMapperIssues.toTreeNodes.issues.EMPTY_KEY}`
          );
        }

        let context: CollectorContext<TValue, TKey> = collector;
        const splitted = trimmedKey.split(separator);
        for (const name of splitted) {
          if (name.trim().length === 0) {
            throw new Error(
              `${flatTreeWsMapperIssues.toTreeNodes.issues.SPLIT_EMPTY_KEY}`
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
        message: flatTreeWsMapperIssues.toTreeNodes.parsedErrorMsg,
        issues: [{ message: `${(e as Error).message}` }],
      };
    }
    return {
      success: true,
      treeNodes: collector.result,
    };
  };

  /**
   * @throws Error
   */
  toTreeNodesOrThrow = (
    data: FlatTreeWs<TValue, TKey> | Readonly<FlatTreeWs<TValue, TKey>>,
    params: FlatTreeWsParams
  ): TreeNode<TValue, TKey>[] => {
    const result = this.toTreeNodes(data, params);
    if (!result.success) {
      throw new Error(result.message);
    }
    return result.treeNodes;
  };

  /**
   * Will convert a tree of nodes to a flat tree.
   *
   * @param treeNodes
   */
  fromTreeNodes = <TId extends string = string>(
    treeNodes: TreeNode<TValue, TId>[],
    params: {
      /**
       * @todo Implement depth-first search
       * @see https://en.wikipedia.org/wiki/Breadth-first_search
       * @see https://en.wikipedia.org/wiki/Depth-first_search
       */
      method: 'breadth-first'; // | 'depth-first';
    }
  ): FlatTreeWs<TValue, TKey> => {
    const result: TreeNode<TValue, TId>[] = [];
    const queue: TreeNode<TValue, TId>[] = [];
    treeNodes.forEach((node) => queue.push(node));
    // eslint-disable-next-line no-constant-condition
    while (true) {
      let count = queue.length;
      if (count === 0) break;
      while (count > 0) {
        const node = queue.shift();
        result.push(node!);
        node!.children?.forEach((child) => queue.push(child));
        count--;
      }
    }

    return result.map((node) => {
      return {
        key: String(node.id),
        value: node.value,
      } as FlatTreeWs<TValue, TKey>[0];
    });
  };
}
