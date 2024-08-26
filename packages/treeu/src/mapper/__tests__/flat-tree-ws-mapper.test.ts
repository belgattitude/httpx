import type { TreeNode } from '../../tree.types';
import {
  FLAT_TREE_WS_MAPPER_ERR_MSG,
  type FlatTreeWs,
  FlatTreeWsMapper,
} from '../flat-tree-ws-mapper';

type CustomValue =
  | { type: 'folder'; size?: never }
  | { type: 'file'; size: number };

describe('FlatTreeWsMapper', () => {
  describe('toTreeNodes4()', () => {
    describe('when a valid FlatTreeWs is given', () => {
      const paths: FlatTreeWs<CustomValue> = [
        {
          key: 'file1.ts',
          value: { type: 'file', size: 10 },
        },
        {
          key: 'file2.ts',
          value: { type: 'file', size: 20 },
        },
        {
          key: 'folder1',
          value: { type: 'folder' },
        },
        {
          key: 'folder1/file1.ts',
          value: { type: 'file', size: 30 },
        },
        {
          key: 'folder2',
          value: { type: 'folder' },
        },
        {
          key: 'folder2/file1.ts',
          value: { type: 'file', size: 40 },
        },
        {
          key: 'folder2/subfolder1',
          value: { type: 'folder' },
        },
        {
          key: 'folder2/subfolder1/file1.ts',
          value: { type: 'file', size: 50 },
        },
        {
          key: 'folder3',
          value: { type: 'folder' },
        },
      ];

      const expected: TreeNode<CustomValue>[] = [
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

      it('should return a success result with expected treeNodes', () => {
        const treeResult = new FlatTreeWsMapper().toTreeNodes(paths, {
          separator: '/',
        });
        expect(treeResult).toStrictEqual({
          success: true,
          treeNodes: expected,
        });
      });

      it.skip('should be insensitive to path order', () => {
        const reversedPaths = paths.slice().reverse();
        const treeResult = new FlatTreeWsMapper().toTreeNodes(reversedPaths, {
          separator: '/',
        });
        expect(treeResult).toStrictEqual({
          success: true,
          treeNodes: expected,
        });
      });
    });

    describe('when a FlatTreeWs contains an empty key', () => {
      const pathsWithDuplicates: FlatTreeWs<undefined> = [
        {
          key: 'file1.ts',
        },
        {
          key: ' ',
        },
        {
          key: 'folder1',
        },
        {
          key: 'folder1/file1.ts',
        },
        {
          key: 'folder2',
        },
        {
          key: 'folder2/file1.ts',
        },
        {
          key: 'folder2/file2.ts',
        },
        {
          key: 'folder3',
        },
      ];

      it('should return an error result', () => {
        const treeResult = new FlatTreeWsMapper().toTreeNodes(
          pathsWithDuplicates,
          {
            separator: '/',
          }
        );
        expect(treeResult).toStrictEqual({
          success: false,
          message: FLAT_TREE_WS_MAPPER_ERR_MSG.toTreeNodes.parsedErrorMsg,
          issues: [
            {
              message: `${FLAT_TREE_WS_MAPPER_ERR_MSG.toTreeNodes.issues.EMPTY_KEY}`,
            },
          ],
        });
      });
    });

    describe('when a FlatTreeWs contains duplicate keys', () => {
      const pathsWithDuplicates: FlatTreeWs<undefined> = [
        {
          key: 'file1.ts',
        },
        {
          key: 'file2.ts',
        },
        {
          key: 'folder1',
        },
        {
          key: 'folder1/file1.ts',
        },
        {
          key: 'folder2',
        },
        {
          key: 'folder2/file1.ts',
        },
        {
          key: 'folder2/file1.ts',
        },
        {
          key: 'file3',
        },
      ];

      it('should return an error result', () => {
        const treeResult = new FlatTreeWsMapper().toTreeNodes(
          pathsWithDuplicates,
          {
            separator: '/',
          }
        );
        expect(treeResult).toStrictEqual({
          success: false,
          message: FLAT_TREE_WS_MAPPER_ERR_MSG.toTreeNodes.parsedErrorMsg,
          issues: [
            {
              message: `${FLAT_TREE_WS_MAPPER_ERR_MSG.toTreeNodes.issues.DUPLICATE}: "folder2/file1.ts"`,
            },
          ],
        });
      });
    });
  });
});
