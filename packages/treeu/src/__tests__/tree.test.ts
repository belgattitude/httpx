import { type FlatTreeWs, FlatTreeWsMapper, Tree } from '@httpx/treeu';

describe('Tree', () => {
  type CustomValue = { size?: number | undefined };

  // Load from flat data with key separator
  const paths = [
    { key: 'file1.ts', value: { size: 80 } },
    { key: 'folder1/file1.ts', value: { size: 0 } },
    { key: 'folder1/file2.ts', value: { size: 4 } },
    { key: 'folder1/subfolder1/file1.ts', value: { size: 10 } },
    { key: 'folder1/subfolder1/file2.ts', value: { size: 10 } },
  ] as const satisfies FlatTreeWs<CustomValue>;

  const parsed = FlatTreeWsMapper.toTreeNodes<CustomValue>(paths, {
    separator: '/',
  });
  if (!parsed.success) {
    throw new Error(`Couldn't parse !`);
  }

  const tree = new Tree<CustomValue>(parsed.treeNodes);
  it('should be expose search operations', () => {
    const found = tree.search.findBy(
      ['id', '===', 'folder1/subfolder1/file1.ts'],
      {
        includeChildren: false,
        reverse: false,
      }
    );
    expect(found).toStrictEqual({
      id: 'folder1/subfolder1/file1.ts',
      parentId: 'folder1/subfolder1',
      value: {
        size: 10,
      },
    });
  });
});
