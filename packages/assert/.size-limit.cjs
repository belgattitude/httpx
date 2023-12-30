/**
 * @link https://github.com/ai/size-limit/
 * @type {{name: string, path: string[], limit: string, import?: string, webpack?: boolean}[]}
 */
module.exports = [
  {
    name: 'Everything (ESM)',
    path: ['dist/index.mjs'],
    import: "*",
    limit: '1700B',
  },
  {
    name: 'Only isPlainObject (ESM)',
    path: ['dist/index.mjs'],
    import: "{ isPlainObject }",
    limit: "60B",
  },
  {
    name: 'Only isUuid (ESM)',
    path: ['dist/index.mjs'],
    import: "{ isUuid }",
    limit: "180B",
  },
  {
    name: 'Only isEan13 (ESM)',
    path: ['dist/index.mjs'],
    import: "{ isEan13 }",
    limit: "120B",
  },
  {
    name: 'Only assertPlainObject (ESM)',
    path: ['dist/index.mjs'],
    import: "{ assertPlainObject }",
    limit: "452B",
  },
  {
    name: 'Everything (CJS)',
    import: "*",
    path: ['dist/index.cjs'],
    limit: '2400B',
  },
];
