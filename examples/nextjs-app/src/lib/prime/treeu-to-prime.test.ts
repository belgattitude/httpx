import type { TreeNode } from '@httpx/treeu';

import { treeuToPrime } from './treeu-to-prime';

describe('treeuToPrime', () => {
  type CustomValue = {
    label: string;
    size: number;
  };
  const treeNodes: TreeNode<CustomValue>[] = [
    {
      children: [],
      id: 'file1.ts',
      parentId: null,
      value: {
        size: 80,
        label: 'file1.ts',
      },
    },
    {
      id: 'folder1/file1.ts',
      parentId: 'folder1',
      value: {
        size: 20,
        label: 'file1.ts',
      },
      children: [
        {
          children: [],
          id: 'folder1/file1.ts',
          parentId: 'folder1',
          value: {
            size: 20,
            label: 'file1.ts',
          },
        },
        {
          children: [],
          id: 'folder1/file2.ts',
          parentId: 'folder1',
          value: {
            size: 30,
            label: 'file2.ts',
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
                label: 'file1.ts',
              },
            },
            {
              children: [],
              id: 'folder1/subfolder1/file2.ts',
              parentId: 'folder1/subfolder1',
              value: {
                size: 60,
                label: 'file2.ts',
              },
            },
          ],
          id: 'folder1/subfolder1/file1.ts',
          parentId: 'folder1/subfolder1',
          value: {
            size: 50,
            label: 'file1.ts',
          },
        },
      ],
    },
  ];
  it('should convert TreeNode<CustomValue> to PrimeTreeNode with correct keys and labels', () => {
    const result = treeuToPrime<CustomValue>(treeNodes);

    expect(result[0]).toMatchObject({
      key: 'file1.ts',
      label: 'file1.ts',
      children: [],
    });

    expect(result[1]).toMatchObject({
      key: 'folder1/file1.ts',
      label: 'file1.ts',
      children: [
        { key: 'folder1/file1.ts', label: 'file1.ts', children: [] },
        { key: 'folder1/file2.ts', label: 'file2.ts', children: [] },
        {
          key: 'folder1/subfolder1/file1.ts',
          label: 'file1.ts',
          children: [
            {
              key: 'folder1/subfolder1/file1.ts',
              label: 'file1.ts',
              children: [],
            },
            {
              key: 'folder1/subfolder1/file2.ts',
              label: 'file2.ts',
              children: [],
            },
          ],
        },
      ],
    });
  });

  it('should handle empty input', () => {
    expect(treeuToPrime<CustomValue>([])).toEqual([]);
  });
});
