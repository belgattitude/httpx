import { isPlainObject } from '@httpx/plain-object';

import type { LeafNode, ParentNode } from './tree.types';

export const TreeGuards = {
  isLeaf: (node: unknown): node is LeafNode => {
    if (!isPlainObject(node)) {
      return false;
    }
    return (node as unknown as LeafNode)?.children?.length === 0;
  },
  isParent: (node: unknown): node is ParentNode => {
    if (!isPlainObject(node)) {
      return false;
    }
    return (node as unknown as ParentNode)?.children?.length > 0;
  },
  isRoot: (node: unknown): node is ParentNode => {
    if (!isPlainObject(node)) {
      return false;
    }
    return (node as unknown as ParentNode)?.parentId !== undefined;
  },
};
