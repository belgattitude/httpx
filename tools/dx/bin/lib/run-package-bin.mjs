import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);

/**
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
const isRecord = (value) => typeof value === "object" && value !== null;

/**
 * Resolves the package.json of a @httpx/dx dependency, whether or not the
 * package exports it (ie: es-check doesn't).
 *
 * @param {string} pkgName
 * @returns {string}
 */
export const resolvePackageJson = (pkgName) => {
  const pkgJsonPath = (require.resolve.paths(pkgName) ?? [])
    .map((nodeModulesDir) => path.join(nodeModulesDir, pkgName, "package.json"))
    .find((candidate) => existsSync(candidate));
  if (pkgJsonPath === undefined) {
    throw new Error(`unable to locate the ${pkgName} package`);
  }
  return pkgJsonPath;
};

/**
 * Resolves a bin (`<pkg>` by default) declared in the package.json of
 * a @httpx/dx dependency.
 *
 * @param {string} pkgName
 * @param {string} [binName]
 * @returns {string}
 */
const resolvePackageBin = (pkgName, binName = pkgName) => {
  const pkgJsonPath = resolvePackageJson(pkgName);
  /** @type {unknown} */
  const pkgJson = JSON.parse(readFileSync(pkgJsonPath, "utf8"));
  const bin = isRecord(pkgJson) ? pkgJson.bin : undefined;
  const binEntry = isRecord(bin) ? bin[binName] : bin;
  if (typeof binEntry !== "string") {
    throw new TypeError(`no ${binName} bin declared in ${pkgJsonPath}`);
  }
  const binPath = path.join(path.dirname(pkgJsonPath), binEntry);
  if (!existsSync(binPath)) {
    throw new Error(`unable to locate the ${binName} bin (${binPath})`);
  }
  return binPath;
};

/**
 * Resolves the native tsgolint executable shipped with the oxlint-tsgolint
 * version pinned by @httpx/dx.
 *
 * @returns {string}
 */
export const resolveTsgolintExecutable = () => {
  const tsgolintRequire = createRequire(
    require.resolve("oxlint-tsgolint/package.json")
  );
  const exe = process.platform === "win32" ? "tsgolint.exe" : "tsgolint";
  return tsgolintRequire.resolve(
    `@oxlint-tsgolint/${process.platform}-${process.arch}/${exe}`
  );
};

/**
 * Runs a command, forwarding the signals and the exit code (`options.onExit`
 * is called before exiting).
 *
 * @param {string} command
 * @param {string[]} args
 * @param {{ env?: Record<string, string>, cwd?: string, onExit?: (code: number) => void }} [options]
 */
export const runCommand = (command, args, options = {}) => {
  const child = spawn(command, args, {
    stdio: "inherit",
    cwd: options.cwd,
    env: { ...process.env, ...options.env },
  });

  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => {
      child.kill(signal);
    });
  }

  child.on("error", (error) => {
    console.error(`dx: failed to run ${command}: ${error.message}`);
    process.exit(1);
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    options.onExit?.(code ?? 1);
    process.exit(code ?? 1);
  });
};

/**
 * Runs the package bin (`options.bin`, `<pkg>` by default) pinned by this
 * package (@httpx/dx), forwarding the cli arguments (`options.argv`, all of
 * them by default, after `options.args`), signals and the exit code.
 *
 * @param {string} pkgName
 * @param {{ env?: Record<string, string>, args?: string[], argv?: string[], bin?: string, onExit?: (code: number) => void }} [options]
 */
export const runPackageBin = (pkgName, options = {}) => {
  runCommand(
    process.execPath,
    [
      resolvePackageBin(pkgName, options.bin),
      ...(options.args ?? []),
      ...(options.argv ?? process.argv.slice(2)),
    ],
    { env: options.env, onExit: options.onExit }
  );
};
