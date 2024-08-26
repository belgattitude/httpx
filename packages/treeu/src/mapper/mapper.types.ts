import type { TreeNode, TreeNodeValue } from '../tree.types';

export type TreeMapperResult<
  TValue extends TreeNodeValue | undefined,
  TKey extends string = string,
> =
  | {
      success: true;
      treeNodes: TreeNode<TValue, TKey>[];
    }
  | {
      success: false;
      message: string;
      issues: TreeMapperIssue[];
    };

export type TreeMapperIssue = {
  message: string;
};
