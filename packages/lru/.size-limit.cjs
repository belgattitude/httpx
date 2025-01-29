/**
 * @link https://github.com/ai/size-limit/
 * @type {{name: string, path: string[], limit: string, import?: string, webpack?: boolean}[]}
 */
module.exports = [
  {
    name: 'import { BaseLru } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ BaseLru }',
    limit: '600B',
  },
  {
    name: 'require { BaseLru } (CJS)',
    import: '{ BaseLru }',
    path: ['dist/index.cjs'],
    limit: '700B',
  },
];
