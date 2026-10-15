import { existsSync } from "node:fs";
import path from "node:path";

import { dxConfig } from "../dx-config.ts";

/**
 * Returns the monorepo root: the closest parent directory (`cwd` included)
 * containing a `pnpm-workspace.yaml`, or `undefined` when there's none.
 */
export const findMonorepoRoot = (
  cwd: string = process.cwd()
): string | undefined => {
  let dir = path.resolve(cwd);
  while (!existsSync(path.join(dir, "pnpm-workspace.yaml"))) {
    const parent = path.dirname(dir);
    if (parent === dir) {
      return undefined;
    }
    dir = parent;
  }
  return dir;
};

/**
 * Returns the `<monorepo root>/<dxConfig.cacheDir>/<tool>/<package path>`
 * directory of the package in `cwd` (ie: `.cache/vitest/packages/core`), so
 * each package has its own cache, or `undefined` outside the monorepo.
 */
export const getMonorepoCacheDir = (
  tool: string,
  cwd: string = process.cwd()
): string | undefined => {
  const root = findMonorepoRoot(cwd);
  if (root === undefined) {
    return undefined;
  }
  return path.join(
    root,
    dxConfig.cacheDir,
    tool,
    path.relative(root, path.resolve(cwd))
  );
};
