import { isPlainObject } from '@httpx/plain-object';

import type { LeafNode } from './types';

export const isLeafNode = (node: unknown): node is LeafNode => {
  if (!isPlainObject(node)) {
    return false;
  }
  return (node as unknown as LeafNode)?.children?.length === 0;
};

export const isParentNode = (node: unknown): node is ParentNode => {
  if (!isPlainObject(node)) {
    return false;
  }
  return (node as unknown as ParentNode)?.children?.length > 0;
};
