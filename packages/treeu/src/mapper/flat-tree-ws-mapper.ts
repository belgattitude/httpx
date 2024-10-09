import type { TreeNode, TreeNodeValue } from '../tree.types';
import type { TreeMapperResult } from './mapper.types';

type FlatTreeWsParams = {
  separator: string;
};

// eslint-disable-next-line sonarjs/redundant-type-aliases
type FlatTreeWsUniqueKey = string;

export type FlatTreeWsMap<
  TValue extends TreeNodeValue | undefined,
  TKey extends FlatTreeWsUniqueKey = string,
> = Map<TKey, TValue>;

export type FlatTreeWsRecord<
  TValue extends TreeNodeValue | undefined,
  TKey extends FlatTreeWsUniqueKey = string,
> = Record<TKey, TValue>;

export type FlatTreeWs<
  TValue extends TreeNodeValue | undefined,
  TKey extends FlatTreeWsUniqueKey = string,
> = FlatTreeWsMap<TValue, TKey> | FlatTreeWsRecord<TValue, TKey>;

type CollectorContext<
  TValue extends TreeNodeValue | undefined = undefined,
  TKey extends string = string,
> = Record<'result', TreeNode<TValue, TKey>[]> & Record<string, unknown>;

export const flatTreeWsMapperErrors = {
  toTreeNodes: {
    parsedErrorMsg: `Can't convert the flat tree to tree nodes`,
    issues: {
      ARG_NOT_ARRAY: 'Invalid argument: not an array (FlatTreeWs)',
      ARG_NOT_OBJECT_ARRAY:
        'Invalid argument: not an array of objects (FlatTreeWs)',
      NON_STRING_KEY: 'Non-string key',
      EMPTY_KEY: 'Empty key given',
      SPLIT_EMPTY_KEY: 'Split an empty key',
    },
  },
  fromTreeNodes: {
    parsedErrorMsg: `Can't convert the tree to tree nodes to flat with separator`,
    issues: {
      DUPLICATE_KEY: 'Duplicate unique id',
      INVALID_KEY: 'Invalid key found',
    },
  },
} as const;

export class FlatTreeWsMapper<
  TValue extends TreeNodeValue,
  TKey extends string = string,
> {
  toTreeNodes = (
    data: FlatTreeWs<TValue, TKey>,
    params: FlatTreeWsParams
    // eslint-disable-next-line sonarjs/cognitive-complexity
  ): TreeMapperResult<TValue, TKey> => {
    const { separator } = params;

    const collector: CollectorContext<TValue, TKey> = { result: [] };

    const d = data instanceof Map ? data : new Map(Object.entries(data));

    try {
      for (const [key, value] of d) {
        const trimmedKey = key.trim() as TKey;
        if (trimmedKey.length === 0) {
          throw new Error(
            `${flatTreeWsMapperErrors.toTreeNodes.issues.EMPTY_KEY}`
          );
        }

        let context: CollectorContext<TValue, TKey> = collector;
        const splitted = trimmedKey.split(separator);
        for (const name of splitted) {
          if (name.trim().length === 0) {
            throw new Error(
              `${flatTreeWsMapperErrors.toTreeNodes.issues.SPLIT_EMPTY_KEY}`
            );
          }
          if (!(name in context)) {
            console.log('name', name, splitted);
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
              node.value = value as TValue;
            }
            if (!Array.isArray(context.result)) {
              console.log({ context });
              throw new TypeError(JSON.stringify(node));
            }
            context.result.push(node);
          }
          context = context[name] as CollectorContext<TValue, TKey>;
        }
      }
    } catch (e) {
      return {
        success: false,
        message: flatTreeWsMapperErrors.toTreeNodes.parsedErrorMsg,
        issues: [{ message: `${(e as Error).message} ${(e as Error).stack}` }],
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
    data: FlatTreeWs<TValue, TKey>,
    params: FlatTreeWsParams
  ): TreeNode<TValue, TKey>[] => {
    const result = this.toTreeNodes(data, params);
    if (!result.success) {
      const { message, issues } = result;
      const errors =
        issues.length > 0
          ? issues.map((issue) => issue.message).join(', ')
          : null;
      throw new Error(`${message} (${errors})`);
    }
    return result.treeNodes;
  };

  /**
   * Will convert a tree of nodes to a flat tree.
   */
  fromTreeNodesOrThrow = <TId extends string = string>(
    treeNodes: TreeNode<TValue, TId>[],
    params: {
      method: 'breadth-first'; // | 'depth-first';
    }
  ): FlatTreeWsMap<TValue, TKey> => {
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
    const map = new Map() as FlatTreeWsMap<TValue, TKey>;
    const { parsedErrorMsg, issues } = flatTreeWsMapperErrors.fromTreeNodes;
    for (const node of result) {
      const key = node.id as unknown as TKey;
      if (typeof key !== 'string' && typeof key !== 'number') {
        throw new TypeError(
          `${parsedErrorMsg} (${issues.INVALID_KEY}: '${key}')`
        );
      }
      if (map.has(key)) {
        throw new Error(
          `${parsedErrorMsg} (${issues.DUPLICATE_KEY}: '${key}' of type ${typeof key}')`
        );
      }
      map.set(key, node.value as TValue);
    }
    return map;
  };
}
