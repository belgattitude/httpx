#!/usr/bin/env node

/**
 * Runs the vitest version pinned by @httpx/dx, forwarding all arguments.
 *
 * @example dx-vitest run --coverage
 */

import { runPackageBin } from "./lib/run-package-bin.mjs";

runPackageBin("vitest");
