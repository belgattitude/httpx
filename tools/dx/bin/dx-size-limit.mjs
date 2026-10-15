#!/usr/bin/env node

/**
 * Runs the size-limit version pinned by @httpx/dx with its `@size-limit/file`
 * and `@size-limit/esbuild` plugins, forwarding all arguments.
 *
 * size-limit loads its plugins from the dependencies of the package being
 * checked: this runs the size-limit cli steps (config, calc, report) with the
 * plugins of @httpx/dx instead, so the packages don't depend on them.
 *
 * @example dx-size-limit
 */

// The size-limit internals are untyped javascript
/* oxlint-disable typescript/no-unsafe-assignment, typescript/no-unsafe-call, typescript/no-unsafe-member-access, typescript/strict-boolean-expressions */

import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

import esbuildPlugin from "@size-limit/esbuild";
import filePlugin from "@size-limit/file";

const require = createRequire(import.meta.url);
const sizeLimitDir = path.dirname(require.resolve("size-limit/package.json"));

/**
 * size-limit internals (not part of its exports), pinned by @httpx/dx.
 *
 * @param {string} file
 */
const importInternal = (file) =>
  import(pathToFileURL(path.join(sizeLimitDir, file)).href);

const [
  { default: calc },
  { default: createReporter },
  { default: debug },
  { default: getConfig },
  { Plugins },
  { default: parseArgs },
  { default: readPkgUp },
  { SizeLimitError },
  { createSpinner },
] = await Promise.all([
  importInternal("calc.js"),
  importInternal("create-reporter.js"),
  importInternal("debug.js"),
  importInternal("get-config.js"),
  importInternal("load-plugins.js"),
  importInternal("parse-args.js"),
  importInternal("read-pkg-up.js"),
  importInternal("size-limit-error.js"),
  import(
    pathToFileURL(
      createRequire(path.join(sizeLimitDir, "package.json")).resolve(
        "nanospinner"
      )
    ).href
  ),
]);

const isJsonOutput = process.argv.includes("--json");
const isSilentMode = process.argv.includes("--silent");
const reporter = createReporter(process, isJsonOutput, isSilentMode);
const plugins = new Plugins([filePlugin, esbuildPlugin].flat());

let args;
let config;
try {
  const pkg = await readPkgUp(process.cwd());
  if (!pkg?.packageJson) {
    throw new SizeLimitError("noPackage");
  }
  args = parseArgs(plugins, process.argv);
  config = await getConfig(plugins, process, args, pkg);
  await calc(
    plugins,
    config,
    isJsonOutput || isSilentMode ? null : createSpinner
  );
  debug.results(process, args, config);
  reporter.results(plugins, config);
  if ((config.failed || config.missed) && !args.why) {
    process.exit(1);
  }
} catch (error) {
  debug.error(process, args, config);
  reporter.error(error);
  process.exit(1);
}
