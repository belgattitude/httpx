/**
 * @link https://github.com/ai/size-limit/
 * @type {{name: string, path: string[], limit: string, import?: string, webpack?: boolean}[]}
 */
module.exports = [
  {
    name: 'import { TinyLRU } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ TinyLRU }',
    limit: '600B',
  },
  {
    name: 'require { TinyLRU } (CJS)',
    import: '{ TinyLRU }',
    path: ['dist/index.cjs'],
    limit: '700B',
  },
];
