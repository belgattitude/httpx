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
  const validFlatTreeWs: FlatTreeWs<CustomValue> = new Map([
    ['file1.ts', { type: 'file', size: 10 }],
    ['file2.ts', { type: 'file', size: 20 }],
    ['folder1', { type: 'folder' }],
    ['folder1/file1.ts', { type: 'file', size: 30 }],

    ['folder2', { type: 'folder' }],
    ['folder2/file1.ts', { type: 'file', size: 40 }],
    ['folder2/subfolder1', { type: 'folder' }],
    ['folder2/subfolder1/file1.ts', { type: 'file', size: 50 }],

    // Testing reserved "constructor" keyword
    ['constructor', { type: 'folder' }],
    ['constructor/constructor.d.ts', { type: 'file', size: 50 }],
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
      id: 'constructor',
      parentId: null,
      value: {
        type: 'folder',
      },
      children: [
        {
          id: 'constructor/constructor.d.ts',
          parentId: 'constructor',
          value: {
            size: 50,
            type: 'file',
          },
          children: [],
        },
      ],
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
          'constructor',
          {
            type: 'folder',
          },
        ],
        [
          'constructor/constructor.d.ts',
          {
            size: 50,
            type: 'file',
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

      // expect(treeNodes).toHaveLength(validFlatTreeWs.size);
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

      it('should work with object (Record) and custom separator', () => {
        // inspired from prime-react onSelect event
        type PrimeReactSelected = {
          checked: boolean;
          partialChecked: boolean;
        };
        const selectedTreeNodes: Record<string, PrimeReactSelected> = {
          root1: { checked: false, partialChecked: true },
          root1___leaf1: { checked: true, partialChecked: false },
          root2: { checked: true, partialChecked: false },
          root2___leaf1: { checked: true, partialChecked: false },
          root2___leaf2: { checked: true, partialChecked: false },
        };
        const mapper = new FlatTreeWsMapper<PrimeReactSelected>();
        const treeResult = mapper.toTreeNodesOrThrow(selectedTreeNodes, {
          separator: '___',
        });

        const expected = [
          {
            id: 'root1',
            parentId: null,
            value: { checked: false, partialChecked: true },
            children: [
              {
                id: 'root1___leaf1',
                parentId: 'root1',
                value: { checked: true, partialChecked: false },
                children: [],
              },
            ],
          },
          {
            id: 'root2',
            parentId: null,
            value: { checked: true, partialChecked: false },
            children: [
              {
                id: 'root2___leaf1',
                parentId: 'root2',
                value: { checked: true, partialChecked: false },
                children: [],
              },
              {
                id: 'root2___leaf2',
                parentId: 'root2',
                value: { checked: true, partialChecked: false },
                children: [],
              },
            ],
          },
        ] as const satisfies TreeNode<PrimeReactSelected>[];

        expect(treeResult).toStrictEqual(expected);

        const flattened = mapper.fromTreeNodesOrThrow(treeResult, {
          method: 'breadth-first',
        });

        const mapToObject = (map: Map<string, unknown>) =>
          Object.fromEntries(map.entries());

        expect(mapToObject(flattened)).toStrictEqual(selectedTreeNodes);
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
