/**
 * @link https://github.com/ai/size-limit/
 * @type {{name: string, path: string[], limit: string, import?: string, webpack?: boolean}[]}
 */
module.exports = [
  {
    name: 'Only { treeify} (ESM)',
    path: ['dist/index.mjs'],
    import: '{ treeify }',
    limit: '150B',
  },
  {
    name: 'Everything (CJS)',
    import: '*',
    path: ['dist/index.cjs'],
    limit: '570KB',
  },
];
