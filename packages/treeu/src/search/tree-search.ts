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

export class TreeSearch<
  TValue extends TreeNodeValue | undefined,
  TKey extends string = string,
> {
  constructor(private readonly treeNodes: TreeNode<TValue, TKey>[]) {}
  findBy = (
    condOrFn:
      | NativeNodeSearchKeys
      | ((treeNode: TreeNode<TValue, TKey>) => boolean),
    params?: Params | undefined
    // eslint-disable-next-line sonarjs/cognitive-complexity
  ): TreeNode<TValue, TKey> | undefined => {
    const { includeChildren = false, reverse = false } = { ...params };
    if (!Array.isArray(this.treeNodes)) return;
    let result;
    const isFnSearch = !Array.isArray(condOrFn);
    for (const treeNode of this.treeNodes) {
      const stack = [treeNode] as TreeNode<TValue, TKey>[];
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
          stack.push(...node.children);
        }
      }
      if (result) break;
    }
    if (includeChildren !== true) {
      const newResult = {
        ...result,
      };
      delete newResult?.children;
      return newResult;
    }
    return result;
  };
}
