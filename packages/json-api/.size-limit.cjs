/**
 * @link https://github.com/ai/size-limit/
 * @type {{name: string, path: string[], limit: string, import?: string, webpack?: boolean}[]}
 */
module.exports = [
  {
    name: 'JS (ESM)',
    path: ['dist/index.mjs'],
    limit: '1.15KB',
  },
  {
    name: 'JS (CJS)',
    path: ['dist/index.cjs'],
    limit: '1.43KB',
  },
];