import { type Stats, statSync } from 'node:fs';
import path from 'node:path';

import { globSync } from 'tinyglobby';

import { DfsTreeSearch } from '../src';
import {
  type FlatTreeWsMap,
  FlatTreeWsMapper,
} from '../src/mapper/flat-tree-ws-mapper';

const baseDir =
  path.dirname(path.dirname(process.cwd())) +
  '/node_modules/jsdoc-type-pratt-parser/dist/src';
console.log(baseDir);

const files = globSync(['**/*', '!.*', '!**/.cache'], {
  cwd: baseDir,
  absolute: false,
  dot: true,
  expandDirectories: true,
  onlyDirectories: false,
  onlyFiles: false,
});

type PathStats = {
  type:
    | 'file'
    | 'directory'
    | 'socket'
    | 'fifo'
    | 'symlink'
    | 'block-device'
    | 'character-device';
  size: number;
  atime: Date;
  mtime: Date;
  ctime: Date;
  birthtime: Date;
};

const flat: FlatTreeWsMap<PathStats> = new Map();

const getFileType = (stats: Stats): PathStats['type'] => {
  switch (true) {
    case stats.isFile():
      return 'file';
    case stats.isDirectory():
      return 'directory';
    case stats.isFIFO():
      return 'fifo';
    case stats.isSocket():
      return 'socket';
    case stats.isBlockDevice():
      return 'block-device';
    case stats.isCharacterDevice():
      return 'character-device';
    case stats.isSymbolicLink():
      return 'symlink';
    default:
      throw new Error('Unsupported file type');
  }
};

for (const file of files) {
  const stats = statSync(path.join(baseDir, file));
  const fileWithSeparator = file.replace(/\/$/, '');
  flat.set(fileWithSeparator, {
    type: getFileType(stats),
    size: stats.size,
    atime: stats.atime,
    ctime: stats.ctime,
    birthtime: stats.birthtime,
    mtime: stats.mtime,
  });
}

console.log(flat.keys());
// throw new Error('cool');
const tree = new FlatTreeWsMapper<PathStats>().toTreeNodesOrThrow(flat, {
  separator: '/',
});

const search = new DfsTreeSearch<PathStats>(tree);
const first = search.findOne((node) => node.id.includes('.d.ts'));

console.log(first);
