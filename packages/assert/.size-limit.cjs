/**
 * @link https://github.com/ai/size-limit/
 * @type {{name: string, path: string[], limit: string, import?: string, webpack?: boolean}[]}
 */
module.exports = [
  {
    name: 'Everything (ESM)',
    path: ['dist/index.mjs'],
    import: "*",
    limit: '700B',
  },
  {
    name: 'Everything (CJS)',
    import: "*",
    path: ['dist/index.cjs'],
    limit: '900B',
  },
];
