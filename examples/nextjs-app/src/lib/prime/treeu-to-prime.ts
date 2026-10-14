import type { TreeNode, TreeNodeValue } from "@httpx/treeu";
import type { TreeNode as PrimeTreeNode } from "primereact/treenode";

export const treeuToPrime = <T extends TreeNodeValue | undefined>(
  treeuNodes: TreeNode<T>[]
): PrimeTreeNode[] =>
  treeuNodes.map((node) => {
    const value = node.value as T;
    return {
      key: node.id,
      label: (value as unknown as { label: string })?.label ?? undefined,
      data: value,
      children: treeuToPrime<T>(node.children),
      // Add other mappings if needed
    } satisfies PrimeTreeNode;
  });
