/**
 * @link https://github.com/ai/size-limit/
 * @type {{name: string, path: string[], limit: string, import?: string, webpack?: boolean}[]}
 */
module.exports = [
  {
    name: 'Everything (ESM)',
    path: ['dist/index.mjs'],
    import: "*",
    limit: '335B',
  },
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
    limit: "166B",
  },
  {
    name: 'Everything (CJS)',
    import: "*",
    path: ['dist/index.cjs'],
    limit: '580KB',
  },
];
