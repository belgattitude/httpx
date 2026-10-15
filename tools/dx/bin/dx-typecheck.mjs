#!/usr/bin/env node

/**
 * Type checks with the tsc version pinned by @httpx/dx, forwarding all
 * arguments, or with `bun check` when `--bun` is given (see dx-typecheck-bun).
 *
 * @example dx-typecheck --project tsconfig.json --noEmit
 * @example dx-typecheck --bun --project tsconfig.json --noEmit
 */

import { runTypecheck } from "./lib/run-typecheck.mjs";

const argv = process.argv.slice(2);

runTypecheck({
  bun: argv.includes("--bun"),
  args: argv.filter((arg) => arg !== "--bun"),
});
