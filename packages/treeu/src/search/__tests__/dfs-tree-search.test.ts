import type { TreeNode } from '../../tree.types';
import { DfsTreeSearch } from '../dfs-tree-search';

describe('TreeSearch', () => {
  type CustomValue =
    | { type: 'folder'; size?: never }
    | { type: 'file'; size: number };

  const treeNodes: TreeNode<CustomValue>[] = [
    {
      id: 'file1.ts',
      parentId: null,
      value: {
        size: 10,
        type: 'file',
      },
      children: [],
    },
    {
      id: 'file2.ts',
      parentId: null,
      value: {
        size: 20,
        type: 'file',
      },
      children: [],
    },
    {
      id: 'folder1',
      parentId: null,
      value: {
        type: 'folder',
      },
      children: [
        {
          id: 'folder1/file1.ts',
          parentId: 'folder1',
          value: {
            size: 30,
            type: 'file',
          },
          children: [],
        },
      ],
    },
    {
      id: 'folder2',
      parentId: null,
      value: {
        type: 'folder',
      },
      children: [
        {
          id: 'folder2/file1.ts',
          parentId: 'folder2',
          value: {
            size: 40,
            type: 'file',
          },
          children: [],
        },
        {
          id: 'folder2/subfolder1',
          parentId: 'folder2',
          value: {
            type: 'folder',
          },
          children: [
            {
              id: 'folder2/subfolder1/file1.ts',
              parentId: 'folder2/subfolder1',
              value: {
                size: 50,
                type: 'file',
              },
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: 'folder3',
      parentId: null,
      value: {
        type: 'folder',
      },
      children: [],
    },
  ];
  describe('findOne', () => {
    const search = new DfsTreeSearch<CustomValue | undefined>(treeNodes);

    describe('when giving a, id', () => {
      it('should return the matching node by id', () => {
        const result = search.findOne('folder2/subfolder1/file1.ts');
        expect(result).toStrictEqual({
          id: 'folder2/subfolder1/file1.ts',
          parentId: 'folder2/subfolder1',
          value: {
            size: 50,
            type: 'file',
          },
        });
      });
    });
    describe('when giving a search function', () => {
      it('should return the matching node by id', () => {
        const result = search.findOne((treeNode) => {
          return treeNode.id === 'folder2/subfolder1/file1.ts';
        });
        expect(result).toStrictEqual({
          id: 'folder2/subfolder1/file1.ts',
          parentId: 'folder2/subfolder1',
          value: {
            size: 50,
            type: 'file',
          },
        });
      });

      it('should return the matching node by value', () => {
        const result = search.findOne((treeNode) => {
          return treeNode.value?.size === 50;
        });
        expect(result).toStrictEqual({
          id: 'folder2/subfolder1/file1.ts',
          parentId: 'folder2/subfolder1',
          value: {
            size: 50,
            type: 'file',
          },
        });
      });

      describe('when using reverse traversal order', () => {
        it('should return the last matching node', () => {
          const result = search.findOne(
            (treeNode) => {
              // eslint-disable-next-line jest/no-conditional-in-test
              const size = treeNode.value?.size ?? 0;
              // eslint-disable-next-line jest/no-conditional-in-test
              return size > 30 && size < 80;
            },
            {
              reverse: true,
            }
          );
          expect(result).toStrictEqual({
            id: 'folder2/subfolder1/file1.ts',
            parentId: 'folder2/subfolder1',
            value: {
              size: 50,
              type: 'file',
            },
          });
        });
      });

      describe('when using reverse mode', () => {
        it('should return the first matching node', () => {
          const result = search.findOne(
            (treeNode) => {
              // eslint-disable-next-line jest/no-conditional-in-test
              const size = treeNode.value?.size ?? 0;
              // eslint-disable-next-line jest/no-conditional-in-test
              return size > 30 && size < 80;
            },
            {
              reverse: false,
            }
          );
          expect(result).toStrictEqual({
            id: 'folder2/file1.ts',
            parentId: 'folder2',
            value: {
              size: 40,
              type: 'file',
            },
          });
        });
      });
    });

    describe('when searching by node id', () => {
      describe('when includeChildren is false or undefined', () => {
        it.each([false, undefined] as const)(
          'should return the node without children',
          (includeChildren) => {
            const result = search.findOne('folder2/subfolder1/file1.ts', {
              includeChildren: includeChildren,
            });
            expect(result).toStrictEqual({
              id: 'folder2/subfolder1/file1.ts',
              parentId: 'folder2/subfolder1',
              value: {
                size: 50,
                type: 'file',
              },
            });
          }
        );
      });
      describe('when `includeChildren` is true', () => {
        it('should return the node with children', () => {
          const result = search.findOne('folder2/subfolder1', {
            includeChildren: true,
          });
          expect(result).toStrictEqual({
            id: 'folder2/subfolder1',
            parentId: 'folder2',
            value: {
              type: 'folder',
            },
            children: [
              {
                id: 'folder2/subfolder1/file1.ts',
                parentId: 'folder2/subfolder1',
                value: {
                  size: 50,
                  type: 'file',
                },
                children: [],
              },
            ],
          });
        });
      });
    });
  });
});
