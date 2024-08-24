/**
 * @link https://github.com/ai/size-limit/
 * @type {{name: string, path: string[], limit: string, import?: string, webpack?: boolean}[]}
 */
module.exports = [
  // Tree
  {
    name: 'Only { Tree } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ Tree }',
    limit: '350B',
  },
  // Search
  {
    name: 'Only { TreeSearch } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ TreeSearch }',
    limit: '320B',
  },
  // Mappers
  {
    name: 'Only { FlatTreeWsMapper } (ESM)',
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
