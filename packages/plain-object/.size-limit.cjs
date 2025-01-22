/**
 * @link https://github.com/ai/size-limit/
 * @type {{name: string, path: string[], limit: string, import?: string, webpack?: boolean}[]}
 */
module.exports = [
  {
    name: 'Only { isPlainObject } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ isPlainObject }',
    limit: '81B',
  },
  {
    name: 'Only { assertPlainObject } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ assertPlainObject }',
    limit: '135B',
  },
  {
    name: 'Only { isStaticBuiltInClass } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ isStaticBuiltInClass }',
    limit: '38B',
  },
  {
    name: 'Import { assertPlainObject, isPlainObject } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ assertPlainObject, isPlainObject }',
    limit: '143B',
  },
  {
    name: 'Require isPlainObject from CJS',
    import: '{ isPlainObject }',
    path: ['dist/index.cjs'],
    limit: '158KB',
  },
];
