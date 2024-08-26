import type { TreeNode, TreeNodeValue } from './tree.types';

export class Tree<
  TValue extends TreeNodeValue | undefined,
  TKey extends string = string,
> {
  constructor(protected readonly treeNodes: TreeNode<TValue, TKey>[]) {}

  getTreeNodes = (): TreeNode<TValue, TKey>[] => {
    return this.treeNodes;
  };
}
