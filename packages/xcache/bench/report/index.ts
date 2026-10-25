/**
 * Run the xcache benchmark report with Node.js and Bun, then render
 * bench/report/report.md and report.json.
 *
 * pnpm bench-report
 * NODE_BIN=~/.nvm/versions/node/v26.12.0/bin/node BUN_BIN=bun pnpm bench-report
 * BENCH_ENGINES=node pnpm bench-report (node only)
 * BENCH_TIME_MS=200 pnpm bench-report (faster, less accurate)
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const script = (name: string): string =>
  fileURLToPath(new URL(name, import.meta.url));

const engines = (process.env.BENCH_ENGINES ?? "node,bun").split(",");
const nodeBin = process.env.NODE_BIN ?? process.execPath;
const bunBin = process.env.BUN_BIN ?? "bun";

const run = (command: string, args: string[]): void => {
  const { status, error } = spawnSync(command, args, { stdio: "inherit" });
  if (error !== undefined || status !== 0) {
    throw new Error(
      `${command} ${args.join(" ")} failed: ${error?.message ?? `exit code ${status}`}`
    );
  }
};

if (engines.includes("node")) {
  run(nodeBin, ["--expose-gc", script("run.ts")]);
}
if (engines.includes("bun")) {
  run(bunBin, [script("run.ts")]);
}
run(nodeBin, [script("render.ts")]);
