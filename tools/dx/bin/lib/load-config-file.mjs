import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const extensions = [".ts", ".mts", ".js", ".mjs"];

/**
 * Imports the default export of the first `<basename>.{ts,mts,js,mjs}` found in
 * the current working directory (typescript files rely on the node type stripping).
 *
 * @param {string} basename ie: `escheck.config`
 * @returns {Promise<{ path: string, config: unknown }>}
 */
export const loadConfigFile = async (basename) => {
  const candidates = extensions.map((ext) =>
    path.resolve(process.cwd(), `${basename}${ext}`)
  );
  const configPath = candidates.find((candidate) => existsSync(candidate));
  if (configPath === undefined) {
    throw new Error(
      `no ${basename}.{${extensions.map((ext) => ext.slice(1)).join(",")}} found in ${process.cwd()}`
    );
  }
  /** @type {unknown} */
  const mod = await import(pathToFileURL(configPath).href);
  const config =
    typeof mod === "object" && mod !== null && "default" in mod
      ? mod.default
      : undefined;
  return { path: configPath, config };
};
