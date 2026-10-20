/**
 * Ensure rolldown (vite, tsdown...) and webpack drop unused exception classes
 * from the dist.
 *
 * Each exception class is counted by its `STATUS=` static in the bundle.
 *
 * Note: esbuild is not checked, it keeps every class with a computed static
 * key (`static [brandKey] = ...`) as it can't prove the key side-effect free.
 */
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";

import { rolldown } from "rolldown";
import webpack from "webpack";

const dist = path.resolve("dist");
const allClasses = 40;

const cases = [
  { import: "{ isHttpStatusCode }", classes: 0 },
  { import: "{ HttpException }", classes: 0 },
  { import: "{ HttpNotFound }", classes: 1 },
  { import: "{ HttpNotFound, HttpInternalServerError }", classes: 2 },
  { import: "{ createHttpException }", classes: allClasses },
  { import: "{ toJson }", from: "serializer/index.js", classes: 0 },
];

/** @type {Record<string, (entry: string, outDir: string) => Promise<string>>} */
const bundlers = {
  rolldown: async (entry) => {
    const bundle = await rolldown({
      input: entry,
      platform: "neutral",
      logLevel: "silent",
    });
    const { output } = await bundle.generate({ format: "esm", minify: true });
    await bundle.close();
    return output[0].code;
  },
  webpack: async (entry, outDir) => {
    const compiler = webpack({
      mode: "production",
      entry,
      output: { path: outDir, filename: "bundle.js" },
      devtool: false,
    });
    try {
      const stats = await promisify(compiler.run.bind(compiler))();
      if (stats?.hasErrors() === true) {
        throw new Error(stats.toString("errors-only"));
      }
    } finally {
      await promisify(compiler.close.bind(compiler))();
    }
    return await readFile(path.join(outDir, "bundle.js"), "utf8");
  },
};

const tmpDir = await mkdtemp(path.join(tmpdir(), "httpx-exception-treeshake-"));
let failed = false;
try {
  for (const c of cases) {
    const name = c.import.replaceAll(/[{} ]/g, "");
    const entry = path.join(tmpDir, "entry.js");
    await writeFile(
      entry,
      `import ${c.import} from ${JSON.stringify(path.join(dist, c.from ?? "index.js"))}; console.log(${name});`
    );
    for (const [bundler, bundle] of Object.entries(bundlers)) {
      const code = await bundle(entry, path.join(tmpDir, bundler));
      const found = code.match(/STATUS=/g)?.length ?? 0;
      const ok = found === c.classes;
      failed ||= !ok;
      console.log(
        `${ok ? "✓" : "✗"} ${bundler} import ${c.import}${c.from === undefined ? "" : ` from ${c.from}`}: ${found} exception classes (expected ${c.classes}), ${code.length}B`
      );
    }
  }
} finally {
  await rm(tmpDir, { recursive: true, force: true });
}

if (failed) {
  console.error("unused exception classes were not tree-shaken");
  process.exit(1);
}
