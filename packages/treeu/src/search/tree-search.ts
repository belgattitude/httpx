import type { TreeNode, TreeNodeValue } from '../tree.types';

type Params = {
  includeChildren?: boolean | undefined;
  reverse?: boolean;
};

type NativeNodeSearchKeys = [
  key: 'id' | 'parentId',
  equality: '===',
  value: string,
];

type TreeNodeOptionalChildren<
  TValue extends TreeNodeValue | undefined,
  TKey extends string = string,
> = TreeNode<TValue, TKey> & {
  children?: TreeNode<TValue, TKey> | undefined;
};

export class TreeSearch<
  TValue extends TreeNodeValue | undefined,
  TKey extends string = string,
> {
  constructor(private readonly treeNodes: TreeNode<TValue, TKey>[]) {}

  /**
   * Depth-First Search (DFS) algorithm to find a node in a tree.
   *
   * Uses a stack rather than recursion in order to support deeply
   * nested trees without call-stack overflows.
   *
   * DFS is well-suited for searching for a particular node or for exploring a
   * branch of a data structure in depth.
   * It is usually preferred when memory usage is a concern or when the data
   * structure has many nodes with few levels.
   *
   * @see https://hackernoon.com/a-beginners-guide-to-bfs-and-dfs-in-javascript
   */
  findBy = (
    condOrFn:
      | NativeNodeSearchKeys
      | ((treeNode: TreeNode<TValue, TKey>) => boolean),
    params?: Params | undefined
    // eslint-disable-next-line sonarjs/cognitive-complexity
  ): TreeNodeOptionalChildren<TValue, TKey> | undefined => {
    const { includeChildren = false, reverse = false } = { ...params };
    if (!Array.isArray(this.treeNodes)) return;
    let result;
    const isFnSearch = !Array.isArray(condOrFn);
    for (const treeNode of this.treeNodes) {
      const stack = [treeNode] as TreeNodeOptionalChildren<TValue, TKey>[];
      while (stack.length > 0) {
        const node = stack[reverse ? 'pop' : 'shift']()!;
        const isFound = isFnSearch
          ? condOrFn(node)
          : condOrFn[0] in node && node[condOrFn[0]] === condOrFn[2];
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
