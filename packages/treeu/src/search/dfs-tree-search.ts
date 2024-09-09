import type { TreeNode, TreeNodeValue } from '../tree.types';

type TreeSearchFindParams = {
  includeChildren?: boolean;
  reverse?: boolean;
};

type NativeNodeSearchKeys = [
  key: 'id' | 'parentId',
  equality: '===',
  value: string,
];

type TreeNodeOptionalChildren<
  TValue extends TreeNodeValue | undefined,
  TKey extends string | number = string,
> = TreeNode<TValue, TKey> & {
  children?: TreeNode<TValue, TKey>;
};

/**
 * Depth-First Search (DFS) algorithm for tree structures. It uses a stack rather
 * than recursion in order to support deeply nested trees without call-stack overflows.
 * It is well suited for exploring a branch of a data structure in depth and
 * usually preferred when memory usage is a concern or when the data
 * structure has many nodes with few levels.
 *
 * @see https://hackernoon.com/a-beginners-guide-to-bfs-and-dfs-in-javascript
 */
export class DfsTreeSearch<
  TValue extends TreeNodeValue | undefined,
  TKey extends string | number = string,
> {
  constructor(private readonly treeNodes: TreeNode<TValue, TKey>[]) {}

  /**
   * Find first matching node in the tree. The `reverse` parameter can be used
   * to traverse the tree in reverse order.
   */
  findOne = (
    idOrConditionOrFn:
      | TKey
      | NativeNodeSearchKeys
      | ((treeNode: TreeNode<TValue, TKey>) => boolean),
    params?: TreeSearchFindParams | undefined
    // eslint-disable-next-line sonarjs/cognitive-complexity
  ): TreeNodeOptionalChildren<TValue, TKey> | undefined => {
    const { includeChildren = false, reverse = false } = { ...params };
    if (!Array.isArray(this.treeNodes) || this.treeNodes.length === 0) return;
    let result;

    const isIdSearch =
      typeof idOrConditionOrFn === 'string' ||
      typeof idOrConditionOrFn === 'number';

    const isFnSearch = !Array.isArray(idOrConditionOrFn);

    for (const treeNode of this.treeNodes) {
      const stack = [treeNode] as TreeNodeOptionalChildren<TValue, TKey>[];
      while (stack.length > 0) {
        const node = stack[reverse ? 'pop' : 'shift']()!;
        const isFound = isIdSearch
          ? node.id === idOrConditionOrFn
          : // eslint-disable-next-line sonarjs/no-nested-conditional
            isFnSearch
            ? idOrConditionOrFn(node)
            : idOrConditionOrFn[0] in node &&
              // eslint-disable-next-line sonarjs/different-types-comparison
              node[idOrConditionOrFn[0]] === idOrConditionOrFn[2];
        if (isFound) {
          result = node;
          break;
        }
        if (node.children) {
          stack.push(
            ...(node.children as unknown as TreeNodeOptionalChildren<
              TValue,
              TKey
            >[])
          );
        }
      }
      if (result) break;
    }
    if (includeChildren !== true) {
      const { children: _children, ...rest } = result ?? {};
      return {
        ...rest,
      } as TreeNodeOptionalChildren<TValue, TKey>;
    }
    return result;
  };
}
