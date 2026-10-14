import type { TreeNode, TreeNodeValue } from "./tree.types";

export class Tree<
  TValue extends TreeNodeValue | undefined,
  TKey extends string = string,
> {
  protected readonly treeNodes: TreeNode<TValue, TKey>[];

  constructor(treeNodes: TreeNode<TValue, TKey>[]) {
    this.treeNodes = treeNodes;
  }

  getTreeNodes = (): TreeNode<TValue, TKey>[] => this.treeNodes;
}
