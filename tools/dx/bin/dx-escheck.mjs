#!/usr/bin/env node

/**
 * Runs the es-check version pinned by @httpx/dx with the `escheck.config.ts`
 * of the current package, forwarding all other arguments.
 *
 * es-check only reads json configs: the config is written to a temporary
 * `.escheckrc.json` and passed with `--config`.
 *
 * @example dx-escheck
 */

import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { loadConfigFile } from "./lib/load-config-file.mjs";
import { runPackageBin } from "./lib/run-package-bin.mjs";

const { config } = await loadConfigFile("escheck.config");
const configs = Array.isArray(config) ? config : [config];

if (
  configs.some(
    (c) => typeof c === "object" && c !== null && "checkBrowser" in c
  )
) {
  console.log("[@httpx/dx] es-check browserslist enabled");
}

const tmpDir = mkdtempSync(path.join(tmpdir(), "dx-escheck-"));
const configPath = path.join(tmpDir, ".escheckrc.json");
writeFileSync(configPath, JSON.stringify(configs));
process.on("exit", () => {
  rmSync(tmpDir, { recursive: true, force: true });
});

runPackageBin("es-check", { args: [`--config=${configPath}`] });
