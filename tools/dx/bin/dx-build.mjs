#!/usr/bin/env node

/**
 * Runs the tsdown version pinned by @httpx/dx, forwarding all arguments.
 *
 * @example dx-build --watch
 */

import { runPackageBin } from "./lib/run-package-bin.mjs";

runPackageBin("tsdown");
