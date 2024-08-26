import { Tree } from '../tree';
import type { TreeNode } from '../tree.types';

describe('Tree', () => {
  type CustomValue = { size: number };

  const treeNodes: TreeNode<CustomValue>[] = [
    {
      children: [],
      id: 'file1.ts',
      parentId: null,
      value: {
        size: 80,
      },
    },
    {
      id: 'folder1/file1.ts',
      parentId: 'folder1',
      value: {
        size: 20,
      },
      children: [
        {
          children: [],
          id: 'folder1/file1.ts',
          parentId: 'folder1',
          value: {
            size: 20,
          },
        },
        {
          children: [],
          id: 'folder1/file2.ts',
          parentId: 'folder1',
          value: {
            size: 30,
          },
        },
        {
          children: [
            {
              children: [],
              id: 'folder1/subfolder1/file1.ts',
              parentId: 'folder1/subfolder1',
              value: {
                size: 50,
              },
            },
            {
              children: [],
              id: 'folder1/subfolder1/file2.ts',
              parentId: 'folder1/subfolder1',
              value: {
                size: 60,
              },
            },
          ],
          id: 'folder1/subfolder1/file1.ts',
          parentId: 'folder1/subfolder1',
          value: {
            size: 50,
          },
        },
      ],
    },
  ];

  it('should return treeNodes', () => {
    const tree = new Tree(treeNodes);
    expect(tree.getTreeNodes()).toStrictEqual(treeNodes);
  });
});
