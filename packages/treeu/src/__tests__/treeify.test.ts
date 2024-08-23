import { treeify } from '../treeify';

describe('treeify', () => {
  const paths = [
    { path: 'file1.ts', props: undefined },
    {
      path: 'folder1/file1.ts',
      props: {
        size: 80,
      },
    },
    { path: 'folder1/file2.ts', props: {} },
    { path: 'folder1/subfolder1/file1.ts', props: {} },
    { path: 'folder1/subfolder1/file2.ts', props: {} },
  ] as const;

  it('should work', () => {
    const tree = treeify(paths, {
      separator: '/',
    });
    expect(tree).toStrictEqual([
      {
        children: [],
        key: 'file1.ts',
      },
      {
        children: [
          {
            children: [],
            key: 'file1.ts',
            props: {
              size: 80,
            },
          },
          {
            children: [],
            key: 'file2.ts',
            props: {},
          },
          {
            children: [
              {
                children: [],
                key: 'file1.ts',
                props: {},
              },
              {
                children: [],
                key: 'file2.ts',
                props: {},
              },
            ],
            key: 'subfolder1',
            props: {},
          },
        ],
        key: 'folder1',
        props: {
          size: 80,
        },
      },
    ]);
  });
});
