import { TreeSearch } from './search/tree-search';
import type { TreeNode, TreeNodeValue } from './tree.types';

export class Tree<
  TValue extends TreeNodeValue | undefined,
  TKey extends string = string,
> {
  public readonly search: TreeSearch<TValue, TKey>;

  constructor(protected readonly treeNodes: TreeNode<TValue, TKey>[]) {
    this.search = new TreeSearch<TValue, TKey>(this.treeNodes);
  }
}
