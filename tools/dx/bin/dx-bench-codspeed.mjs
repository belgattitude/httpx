#!/usr/bin/env node

/**
 * Runs the vitest benchmarks once with the CodSpeed instrumentation
 * (`CODSPEED=1`: the vitest config of @httpx/dx adds the CodSpeed plugin),
 * on node, forwarding the vitest arguments.
 *
 * @example dx-bench-codspeed
 */

import { parseRuntime, runBench } from "./lib/run-bench.mjs";

const help = `Usage: dx-bench-codspeed [vitest bench options]

Runs the vitest benchmarks once (vitest bench --run) on node, with the
CodSpeed plugin (CODSPEED=1). Run it in the CodSpeed runner (CI) to get
measurements.

Options:
  -h, --help  Show this help

The other options are forwarded to vitest bench.
`;

const argv = process.argv.slice(2);
if (argv.includes("--help") || argv.includes("-h")) {
  console.log(help);
  process.exit(0);
}

const { runtime = "node", args } = parseRuntime(argv);
if (runtime !== "node") {
  console.error(
    `dx-bench-codspeed: the CodSpeed instrumentation only supports node (got "${runtime}")`
  );
  process.exit(1);
}

runBench({ runtime, codspeed: true, args });
