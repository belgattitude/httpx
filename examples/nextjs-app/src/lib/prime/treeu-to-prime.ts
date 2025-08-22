import type { TreeNode } from '@httpx/treeu';
import type { TreeNode as PrimeTreeNode } from 'primereact/treenode';

export const treeuToPrime = <T>(treeuNodes: TreeNode<T>[]): PrimeTreeNode[] => {
  return treeuNodes.map((node) => {
    const value = node.value as T;
    return {
      key: node.id,
      label: value,
      // data: node.value as T,
      children: node.children ? treeuToPrime<T>(node.children) : undefined,
      // Add other mappings if needed
    };
  });
};
