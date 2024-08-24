/**
 * @link https://github.com/ai/size-limit/
 * @type {{name: string, path: string[], limit: string, import?: string, webpack?: boolean}[]}
 */
module.exports = [
  {
    name: 'Only { treeify } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ FlatTreeWsMapper }',
    limit: '210B',
  },
  {
    name: 'Everything (ESM)',
    import: '*',
    path: ['dist/index.mjs'],
    limit: '580KB',
  },
];
