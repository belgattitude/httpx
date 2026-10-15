#!/usr/bin/env node

/**
 * Type checks with `bun check` (bun >= 1.4.3, the bun of the PATH: not pinned),
 * forwarding all the tsc arguments (`--project`, compiler options...).
 *
 * @example dx-typecheck-bun --project tsconfig.json --noEmit
 */

import { runTypecheck } from "./lib/run-typecheck.mjs";

runTypecheck({ bun: true, args: process.argv.slice(2) });
