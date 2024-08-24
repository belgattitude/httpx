import {
  type FlatTreeWs,
  FlatTreeWsMapper,
  type ParsedTreeResult,
} from '../flat-tree-ws-mapper';

const tryOrFail = <T extends ParsedTreeResult<any, string>>(result: T) => {
  if (result.success) {
    return result.treeNodes;
  }
  throw new Error('Data incorrect , check your tests');
};

describe('FlatTreeWsMapper', () => {
  describe('toTreeNodes()', () => {
    const paths = [
      { key: 'file1.ts' },
      {
        key: 'folder1/file1.ts',
        value: {
          size: 80,
        },
      },
      { key: 'folder1/file2.ts', value: {} },
      { key: 'folder1/subfolder1/file1.ts', value: {} },
      { key: 'folder1/subfolder1/file2.ts', value: {} },
    ] as const satisfies FlatTreeWs<{ size?: number } | undefined>;

    describe('when valid flat tree with separator is given', () => {
      it('should return the tree version', () => {
        const treeResult = FlatTreeWsMapper.toTreeNodes(paths, {
          separator: '/',
        });
        expect(treeResult.success).toBe(true);
        const treeNodes = tryOrFail(treeResult);
        expect(treeNodes).toStrictEqual([
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
                  size: 80,
                },
              },
              {
                children: [],
                id: 'folder1/file2.ts',
                parentId: 'folder1',
                value: {},
              },
              {
                children: [
                  {
                    children: [],
                    id: 'folder1/subfolder1/file1.ts',
                    parentId: 'folder1/subfolder1',
                    value: {},
                  },
                  {
                    children: [],
                    id: 'folder1/subfolder1/file2.ts',
                    parentId: 'folder1/subfolder1',
                    value: {},
                  },
                ],
                id: 'folder1/subfolder1/file1.ts',
                parentId: 'folder1/subfolder1',
                value: {},
              },
            ],
            id: 'folder1/file1.ts',
            parentId: 'folder1',
            value: {
              size: 80,
            },
          },
        ]);
      });
    });
  });
});
