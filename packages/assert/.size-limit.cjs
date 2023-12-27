/**
 * @link https://github.com/ai/size-limit/
 * @type {{name: string, path: string[], limit: string, import?: string, webpack?: boolean}[]}
 */
module.exports = [
  {
    name: 'Everything (ESM)',
    path: ['dist/index.mjs'],
    import: "*",
    limit: '1000B',
  },
  {
    name: 'Only isPlainObject (ESM)',
    path: ['dist/index.mjs'],
    import: "{ isPlainObject }",
    limit: "60B",
  },
  {
    name: 'Only assertPlainObject (ESM)',
    path: ['dist/index.mjs'],
    import: "{ assertPlainObject }",
    limit: "280B",
  },
  {
    name: 'Everything (CJS)',
    import: "*",
    path: ['dist/index.cjs'],
    limit: '2000B',
  },
];
