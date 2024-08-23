import { treeify } from '../treeify';

describe('treeify', () => {
  const paths = [
    { key: 'file1.ts', props: undefined },
    {
      key: 'folder1/file1.ts',
      props: {
        size: 80,
      },
    },
    { key: 'folder1/file2.ts', props: {} },
    { key: 'folder1/subfolder1/file1.ts', props: {} },
    { key: 'folder1/subfolder1/file2.ts', props: {} },
  ] as const;

  it('should work', () => {
    const tree = treeify(paths, {
      separator: '/',
    });
    expect(tree).toStrictEqual([
      {
        children: [],
        key: 'file1.ts',
        parents: [],
      },
      {
        children: [
          {
            children: [],
            key: 'file1.ts',
            parents: ['folder1'],
            props: {
              size: 80,
            },
          },
          {
            children: [],
            key: 'file2.ts',
            parents: ['folder1'],
            props: {},
          },
          {
            children: [
              {
                children: [],
                key: 'file1.ts',
                parents: ['folder1', 'subfolder1'],
                props: {},
              },
              {
                children: [],
                key: 'file2.ts',
                parents: ['folder1', 'subfolder1'],
                props: {},
              },
            ],
            key: 'subfolder1',
            parents: ['folder1', 'subfolder1'],
            props: {},
          },
        ],
        key: 'folder1',
        parents: ['folder1'],
        props: {
          size: 80,
        },
      },
    ]);
  });
});
