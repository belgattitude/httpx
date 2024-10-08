/**
 * @link https://github.com/ai/size-limit/
 * @type {{name: string, path: string[], limit: string, import?: string, webpack?: boolean}[]}
 */
module.exports = [
  {
    name: 'Everything (ESM)',
    path: ['dist/index.mjs'],
    import: "*",
    limit: '1.15KB',
  },
  {
    name: 'Only parseDsn (ESM)',
    path: ['dist/index.mjs'],
    import: "{ parseDsn }",
    limit: '785B',
  },
  {
    name: 'Everything (CJS)',
    import: "*",
    path: ['dist/index.cjs'],
    limit: '1.40KB',
  },
];
