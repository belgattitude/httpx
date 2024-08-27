import type { TreeNode } from '../../tree.types';
import {
  type FlatTreeWs,
  FlatTreeWsMapper,
  flatTreeWsMapperIssues,
} from '../flat-tree-ws-mapper';

type CustomValue =
  | { type: 'folder'; size?: never }
  | { type: 'file'; size: number };

describe('FlatTreeWsMapper', () => {
  const vadidFlatTreeWs: FlatTreeWs<CustomValue> = [
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

  const validTreeNodes: TreeNode<CustomValue>[] = [
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

  describe('fromTreeNodes', () => {
    it('should return a valid flat tree', () => {
      const mapper = new FlatTreeWsMapper<CustomValue>();
      const treeNodes = mapper.fromTreeNodes(validTreeNodes, {
        method: 'breadth-first',
      });

      const flattenedBreadthFirst: FlatTreeWs<CustomValue> = [
        {
          key: 'file1.ts',
          value: {
            size: 10,
            type: 'file',
          },
        },
        {
          key: 'file2.ts',
          value: {
            size: 20,
            type: 'file',
          },
        },
        {
          key: 'folder1',
          value: {
            type: 'folder',
          },
        },
        {
          key: 'folder2',
          value: {
            type: 'folder',
          },
        },
        {
          key: 'folder3',
          value: {
            type: 'folder',
          },
        },
        {
          key: 'folder1/file1.ts',
          value: {
            size: 30,
            type: 'file',
          },
        },
        {
          key: 'folder2/file1.ts',
          value: {
            size: 40,
            type: 'file',
          },
        },
        {
          key: 'folder2/subfolder1',
          value: {
            type: 'folder',
          },
        },
        {
          key: 'folder2/subfolder1/file1.ts',
          value: {
            size: 50,
            type: 'file',
          },
        },
      ];

      expect(treeNodes).toHaveLength(vadidFlatTreeWs.length);
      expect(treeNodes).toStrictEqual(flattenedBreadthFirst);

      // Back and forth
      const treeNodes2 = mapper.toTreeNodesOrThrow(flattenedBreadthFirst, {
        separator: '/',
      });

      const flattened2 = mapper.fromTreeNodes(treeNodes2, {
        method: 'breadth-first',
      });
      expect(flattened2).toStrictEqual(flattenedBreadthFirst);
    });
  });
  describe('toTreeNodes()', () => {
    describe('when a valid FlatTreeWs is given', () => {
      it('should return a success result with validTreeNodes validTreeNodes', () => {
        const treeResult = new FlatTreeWsMapper<CustomValue>().toTreeNodes(
          vadidFlatTreeWs,
          {
            separator: '/',
          }
        );
        expect(treeResult).toStrictEqual({
          success: true,
          treeNodes: validTreeNodes,
        });
      });

      it.skip('should be insensitive to path order', () => {
        const reversedPaths = vadidFlatTreeWs.slice().reverse();
        const treeResult = new FlatTreeWsMapper().toTreeNodes(reversedPaths, {
          separator: '/',
        });
        expect(treeResult).toStrictEqual({
          success: true,
          treeNodes: validTreeNodes,
        });
      });
    });

    describe('when a FlatTreeWs contains an empty key', () => {
      const pathsWithEmptyKey: FlatTreeWs<undefined> = [
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
          pathsWithEmptyKey,
          {
            separator: '/',
          }
        );
        expect(treeResult).toStrictEqual({
          success: false,
          message: flatTreeWsMapperIssues.toTreeNodes.parsedErrorMsg,
          issues: [
            {
              message: `${flatTreeWsMapperIssues.toTreeNodes.issues.EMPTY_KEY}`,
            },
          ],
        });
      });
    });

    describe('when a FlatTreeWs contains an empty splitted key', () => {
      const pathsWithEmptySplittedKey: FlatTreeWs<undefined> = [
        {
          key: 'file1.ts',
        },
        {
          key: 'folder2',
        },
        {
          key: 'folder2//file1.ts',
        },
      ];

      it('should return an error result', () => {
        const treeResult = new FlatTreeWsMapper().toTreeNodes(
          pathsWithEmptySplittedKey,
          {
            separator: '/',
          }
        );
        expect(treeResult).toStrictEqual({
          success: false,
          message: flatTreeWsMapperIssues.toTreeNodes.parsedErrorMsg,
          issues: [
            {
              message: `${flatTreeWsMapperIssues.toTreeNodes.issues.SPLIT_EMPTY_KEY}`,
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
          message: flatTreeWsMapperIssues.toTreeNodes.parsedErrorMsg,
          issues: [
            {
              message: `${flatTreeWsMapperIssues.toTreeNodes.issues.DUPLICATE}: "folder2/file1.ts"`,
            },
          ],
        });
      });
    });
  });
});
