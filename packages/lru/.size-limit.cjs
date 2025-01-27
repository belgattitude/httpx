/**
 * @link https://github.com/ai/size-limit/
 * @type {{name: string, path: string[], limit: string, import?: string, webpack?: boolean}[]}
 */
module.exports = [
  {
    name: 'import { LruCache } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ LRUCache }',
    limit: '600B',
  },
  {
    name: 'require { LRUCache } (CJS)',
    import: '{ LRUCache }',
    path: ['dist/index.cjs'],
    limit: '700B',
  },
];
