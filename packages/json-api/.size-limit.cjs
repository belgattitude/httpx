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
    webpack: false,
  },
  {
    name: 'Everything (CJS)',
    path: ['dist/index.cjs'],
    import: "*",
    limit: '1.15KB',
    webpack: false,
  }
];