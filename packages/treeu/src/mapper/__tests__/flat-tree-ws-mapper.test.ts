import type { TreeNode } from '../../tree.types';
import {
  type FlatTreeWs,
  FlatTreeWsMapper,
  flatTreeWsMapperErrors,
} from '../flat-tree-ws-mapper';

type CustomValue =
  | { type: 'folder'; size?: never }
  | { type: 'file'; size: number };

describe('FlatTreeWsMapper', () => {
  const validFlatTreeWs: FlatTreeWs<CustomValue, string> = new Map([
    ['file1.ts', { type: 'file', size: 10 }],
    ['file2.ts', { type: 'file', size: 20 }],
    ['folder1', { type: 'folder' }],
    ['folder1/file1.ts', { type: 'file', size: 30 }],
    ['folder2', { type: 'folder' }],
    ['folder2/file1.ts', { type: 'file', size: 40 }],
    ['folder2/subfolder1', { type: 'folder' }],
    ['folder2/subfolder1/file1.ts', { type: 'file', size: 50 }],
    ['folder3', { type: 'folder' }],
  ]);

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

  describe('fromTreeNodesOrThrow', () => {
    it('should return a valid flat tree', () => {
      const mapper = new FlatTreeWsMapper<CustomValue>();
      const treeNodes = mapper.fromTreeNodesOrThrow(validTreeNodes, {
        method: 'breadth-first',
      });

      const flattenedBreadthFirst: FlatTreeWs<CustomValue, string> = new Map([
        ['file1.ts', { size: 10, type: 'file' }],
        ['file2.ts', { size: 20, type: 'file' }],
        ['folder1', { type: 'folder' }],
        [
          'folder2',
          {
            type: 'folder',
          },
        ],
        [
          'folder3',
          {
            type: 'folder',
          },
        ],
        [
          'folder1/file1.ts',
          {
            size: 30,
            type: 'file',
          },
        ],
        [
          'folder2/file1.ts',
          {
            size: 40,
            type: 'file',
          },
        ],
        [
          'folder2/subfolder1',
          {
            type: 'folder',
          },
        ],
        [
          'folder2/subfolder1/file1.ts',
          {
            size: 50,
            type: 'file',
          },
        ],
      ]);

      expect(treeNodes).toHaveLength(validFlatTreeWs.size);
      expect(treeNodes).toStrictEqual(flattenedBreadthFirst);

      // Back and forth
      const treeNodes2 = mapper.toTreeNodesOrThrow(flattenedBreadthFirst, {
        separator: '/',
      });

      const flattened2 = mapper.fromTreeNodesOrThrow(treeNodes2, {
        method: 'breadth-first',
      });
      expect(flattened2).toStrictEqual(flattenedBreadthFirst);
    });
  });
  describe('toTreeNodes()', () => {
    describe('when a valid FlatTreeWs is given', () => {
      it('should return a success result with validTreeNodes validTreeNodes', () => {
        const treeResult = new FlatTreeWsMapper<CustomValue>().toTreeNodes(
          validFlatTreeWs,
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
        const reversedPaths = new Map([...validFlatTreeWs].reverse());
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
      const pathsWithEmptyKey: FlatTreeWs<null> = new Map([
        ['file1.ts', null],
        [' ', null],
        ['folder1', null],
        ['folder1/file1.ts', null],
        ['folder2', null],
        ['folder2/file1.ts', null],
        ['folder2/file2.ts', null],
        ['folder3', null],
      ]);

      it('should return an error result', () => {
        const treeResult = new FlatTreeWsMapper().toTreeNodes(
          pathsWithEmptyKey,
          {
            separator: '/',
          }
        );
        expect(treeResult).toStrictEqual({
          success: false,
          message: flatTreeWsMapperErrors.toTreeNodes.parsedErrorMsg,
          issues: [
            {
              message: `${flatTreeWsMapperErrors.toTreeNodes.issues.EMPTY_KEY}`,
            },
          ],
        });
      });
    });

    describe('when a FlatTreeWs contains an empty splitted key', () => {
      const pathsWithEmptySplittedKey: FlatTreeWs<null> = new Map([
        ['file1.ts', null],
        ['folder2//file1.ts', null],
      ]);

      it('should return an error result', () => {
        const treeResult = new FlatTreeWsMapper().toTreeNodes(
          pathsWithEmptySplittedKey,
          {
            separator: '/',
          }
        );
        expect(treeResult).toStrictEqual({
          success: false,
          message: flatTreeWsMapperErrors.toTreeNodes.parsedErrorMsg,
          issues: [
            {
              message: `${flatTreeWsMapperErrors.toTreeNodes.issues.SPLIT_EMPTY_KEY}`,
            },
          ],
        });
      });
    });
  });
});
