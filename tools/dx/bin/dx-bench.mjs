#!/usr/bin/env node

/**
 * Runs the vitest benchmarks with the vitest pinned by @httpx/dx, on node
 * (default) or bun, forwarding the other vitest arguments.
 *
 * @example dx-bench
 * @example dx-bench --runtime=bun --reporter=verbose
 * @example dx-bench --watch
 */

import { parseRuntime, runBench, runtimes } from "./lib/run-bench.mjs";

const help = `Usage: dx-bench [options] [vitest bench options]

Runs the vitest benchmarks once (vitest bench --run).

Options:
  --runtime=<runtime>  Runtime running vitest: node (default) or bun (bun --bun, the bun of the PATH)
  --watch, -w          Run the benchmarks in watch mode
  -h, --help           Show this help

The other options are forwarded to vitest bench (ie: --reporter=verbose).
Use dx-bench-codspeed to run them with the CodSpeed instrumentation.
`;

const argv = process.argv.slice(2);
if (argv.includes("--help") || argv.includes("-h")) {
  console.log(help);
  process.exit(0);
}

const { runtime = "node", args } = parseRuntime(argv);
if (runtime !== "node" && runtime !== "bun") {
  console.error(
    `dx-bench: unsupported runtime "${runtime}" (${runtimes.join(", ")})\n\n${help}`
  );
  process.exit(1);
}

runBench({ runtime, codspeed: false, args });
