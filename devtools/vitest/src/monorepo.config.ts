import path from 'node:path';
import * as url from 'node:url';

export const monorepoConfig = {
  root: path.resolve(
    path.dirname(url.fileURLToPath(import.meta.url)),
    '..',
    '..',
    '..'
  ),
} as const;
