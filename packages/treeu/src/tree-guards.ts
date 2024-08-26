import { isPlainObject } from '@httpx/plain-object';

import type { TreeLeafNode, TreeParentNode } from './tree.types';

export const TreeGuards = {
  isLeaf: (node: unknown): node is TreeLeafNode => {
    if (!isPlainObject(node)) {
      return false;
    }
    return (node as unknown as TreeLeafNode)?.children?.length === 0;
  },
  isParent: (node: unknown): node is TreeParentNode => {
    if (!isPlainObject(node)) {
      return false;
    }
    return (node as unknown as TreeParentNode)?.children?.length > 0;
  },
  isRoot: (node: unknown): node is TreeParentNode => {
    if (!isPlainObject(node)) {
      return false;
    }
    return (node as unknown as TreeParentNode)?.parentId !== undefined;
  },
};
