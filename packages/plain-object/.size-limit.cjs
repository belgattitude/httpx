/**
 * @link https://github.com/ai/size-limit/
 * @type {{name: string, path: string[], limit: string, import?: string, webpack?: boolean}[]}
 */
module.exports = [
  {
    name: "Only { isPlainObject } (ESM)",
    path: ["dist/index.mjs"],
    import: "{ isPlainObject }",
    limit: "108B",
  },
  {
    name: "Only { assertPlainObject } (ESM)",
    path: ["dist/index.mjs"],
    import: "{ assertPlainObject }",
    limit: "164B",
  },
  {
    name: "Import { assertPlainObject, isPlainObject } (ESM)",
    path: ["dist/index.mjs"],
    import: "{ assertPlainObject, isPlainObject }",
    limit: "171B",
  },
  {
    name: 'Everything (CJS)',
    import: "*",
    path: ['dist/index.cjs'],
    limit: '570KB',
  },
];
