import {
  runCommand,
  runPackageBin,
  resolvePackageBin,
} from "./run-package-bin.mjs";

export const runtimes = ["node", "bun"];

/**
 * Splits the `--runtime=<runtime>` / `--runtime <runtime>` option from the
 * other cli arguments.
 *
 * @param {string[]} argv
 * @returns {{ runtime: string | undefined, args: string[] }}
 */
export const parseRuntime = (argv) => {
  /** @type {string | undefined} */
  let runtime;
  /** @type {string[]} */
  const args = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i] ?? "";
    if (arg.startsWith("--runtime=")) {
      runtime = arg.slice("--runtime=".length);
    } else if (arg === "--runtime") {
      runtime = argv[i + 1];
      i++;
    } else {
      args.push(arg);
    }
  }
  return { runtime, args };
};

/**
 * Runs the vitest benchmarks (`vitest bench --run`, or in watch mode with
 * `--watch`) with the vitest pinned by @httpx/dx, on node or bun
 * (`bun --bun`, the bun of the PATH), forwarding the other vitest arguments.
 * `codspeed` sets `CODSPEED=1`: the vitest config of @httpx/dx then adds
 * the CodSpeed plugin.
 *
 * @param {{ runtime: "node" | "bun", codspeed: boolean, args: string[] }} options
 */
export const runBench = ({ runtime, codspeed, args }) => {
  const watch = args.includes("--watch") || args.includes("-w");
  const vitestArgs = ["bench", ...(watch ? [] : ["--run"]), ...args];
  const env = codspeed ? { CODSPEED: "1" } : {};
  if (runtime === "bun") {
    runCommand("bun", ["--bun", resolvePackageBin("vitest"), ...vitestArgs], {
      env,
    });
  } else {
    runPackageBin("vitest", { argv: vitestArgs, env });
  }
};
