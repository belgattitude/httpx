import type { SizeLimitConfig } from 'size-limit'

const config = [
  // Tree
  {
    name: 'Only { Tree } (ESM)',
    path: ['dist/index.js'],
    import: '{ Tree }',
    limit: '70B',
  },
  // Search
  {
    name: 'Only { DfsTreeSearch } (ESM)',
    path: ['dist/index.js'],
    import: '{ DfsTreeSearch }',
    limit: '280B',
  },
  // Mappers
  {
    name: 'Only { FlatTreeWsMapper } (ESM)',
    path: ['dist/index.js'],
    import: '{ FlatTreeWsMapper }',
    limit: '810B',
  },
  {
    name: 'Everything (ESM)',
    import: '*',
    path: ['dist/index.js'],
    limit: '2KB',
  },
] satisfies SizeLimitConfig;

export default config;