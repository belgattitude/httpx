import type { TreeNode } from '../../tree.types';
import { TreeSearch } from '../tree-search';

describe('TreeSearch', () => {
  const treeNodes = [
    {
      children: [],
      id: 'file1.ts',
      parentId: undefined,
    },
    {
      children: [
        {
          children: [],
          id: 'folder1/file1.ts',
          parentId: 'folder1',
          value: {
            size: 90,
          },
        },
        {
          children: [],
          id: 'folder1/file2.ts',
          parentId: 'folder1',
          value: {
            size: 80,
          },
        },
        {
          children: [
            {
              children: [],
              id: 'folder1/subfolder1/file1.ts',
              parentId: 'folder1',
              value: {
                size: 100,
              },
            },
            {
              children: [],
              id: 'folder1/subfolder1/file2.ts',
              parentId: 'folder1',
              value: {},
            },
          ],
          id: 'folder1/subfolder1/file1.ts',
          parentId: 'folder1',
          value: {},
        },
      ],
      id: 'folder1/file1.ts',
      parentId: 'folder1',
      value: {
        size: 80,
      },
    },
  ] as const satisfies TreeNode<{ size?: number } | undefined>[];

  describe('findBy', () => {
    const search = new TreeSearch<{ size?: number } | undefined>(treeNodes);

    describe('when giving a search function', () => {
      it('should return the matching node by id', () => {
        const result = search.findBy((treeNode) => {
          return treeNode.id === 'folder1/subfolder1/file2.ts';
        });
        expect(result).toStrictEqual({
          id: 'folder1/subfolder1/file2.ts',
          parentId: 'folder1',
          value: {},
        });
      });

      it('should return the matching node by value', () => {
        const result = search.findBy((treeNode) => {
          return treeNode.value?.size === 80;
        });
        expect(result).toStrictEqual({
          id: 'folder1/file1.ts',
          parentId: 'folder1',
          value: {
            size: 80,
          },
        });
      });

      describe('when using reverse traversal order', () => {
        it('should return the last matching node', () => {
          const result = search.findBy(
            (treeNode) => {
              // eslint-disable-next-line jest/no-conditional-in-test
              const size = treeNode.value?.size ?? 0;
              // eslint-disable-next-line jest/no-conditional-in-test
              return size > 81 && size < 150;
            },
            {
              reverse: true,
            }
          );
          expect(result).toStrictEqual({
            id: 'folder1/subfolder1/file1.ts',
            parentId: 'folder1',
            value: {
              size: 100,
            },
          });
        });
      });

      describe('when using reverse mode', () => {
        it('should return the first matching node', () => {
          const result = search.findBy(
            (treeNode) => {
              // eslint-disable-next-line jest/no-conditional-in-test
              const size = treeNode.value?.size ?? 0;
              // eslint-disable-next-line jest/no-conditional-in-test
              return size > 81 && size < 150;
            },
            {
              reverse: false,
            }
          );
          expect(result).toStrictEqual({
            id: 'folder1/file1.ts',
            parentId: 'folder1',
            value: {
              size: 90,
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
            const result = search.findBy(
              ['id', '===', 'folder1/subfolder1/file2.ts'],
              {
                includeChildren: includeChildren,
              }
            );
            expect(result).toStrictEqual({
              id: 'folder1/subfolder1/file2.ts',
              parentId: 'folder1',
              value: {},
            });
          }
        );
      });
      describe('when includeChildren is true', () => {
        it('should return the node with children', () => {
          const result = search.findBy(
            ['id', '===', 'folder1/subfolder1/file2.ts'],
            {
              includeChildren: true,
            }
          );
          expect(result).toStrictEqual({
            children: [],
            id: 'folder1/subfolder1/file2.ts',
            parentId: 'folder1',
            value: {},
          });
        });
      });
    });
  });
});
