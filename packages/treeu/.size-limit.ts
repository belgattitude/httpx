import type { SizeLimitConfig } from 'size-limit'

module.exports = [
  // Tree
  {
    name: 'Only { Tree } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ Tree }',
    limit: '70B',
  },
  // Search
  {
    name: 'Only { DfsTreeSearch } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ DfsTreeSearch }',
    limit: '280B',
  },
  // Mappers
  {
    name: 'Only { FlatTreeWsMapper } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ FlatTreeWsMapper }',
    limit: '810B',
  },
  {
    name: 'Everything (ESM)',
    import: '*',
    path: ['dist/index.mjs'],
    limit: '2KB',
  },
] satisfies SizeLimitConfig;
