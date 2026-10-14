import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);

/**
 * Resolves `<pkg>/bin/<pkg>` from the @httpx/dx dependencies.
 *
 * @param {string} pkgName
 * @returns {string}
 */
const resolvePackageBin = (pkgName) => {
  const pkgJsonPath = require.resolve(`${pkgName}/package.json`);
  const binPath = path.join(path.dirname(pkgJsonPath), "bin", pkgName);
  if (!existsSync(binPath)) {
    throw new Error(`unable to locate the ${pkgName} bin (${binPath})`);
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
 * Runs the package bin pinned by @httpx/dx, forwarding all cli
 * arguments, signals and the exit code.
 *
 * @param {string} pkgName
 * @param {{ env?: Record<string, string> }} [options]
 */
export const runPackageBin = (pkgName, options = {}) => {
  const child = spawn(
    process.execPath,
    [resolvePackageBin(pkgName), ...process.argv.slice(2)],
    { stdio: "inherit", env: { ...process.env, ...options.env } }
  );

  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => {
      child.kill(signal);
    });
  }

  child.on("error", (error) => {
    console.error(`dx: failed to run ${pkgName}: ${error.message}`);
    process.exit(1);
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code ?? 1);
  });
};
