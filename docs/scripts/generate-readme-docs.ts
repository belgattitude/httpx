/**
 * Generates a doc page from the README of every published package that has no
 * hand-written docs yet (no `content/docs/<name>` folder).
 *
 * Pages are written as plain markdown (GitHub flavoured README syntax is not
 * always valid mdx) in the `content/docs/(readme)` group folder (gitignored,
 * not part of the url: `/lru`) and show up in the package switcher.
 */
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const docsDir = path.resolve(import.meta.dirname, "../content/docs");
const packagesDir = path.resolve(import.meta.dirname, "../../packages");
const outputDir = path.join(docsDir, "(readme)");

const toMarkdown = (readme: string) =>
  readme
    // the title comes from the frontmatter
    .replace(/^# .*\n+/, "")
    // same rendering as the hand-written docs (see global.css)
    .replace(
      /^(\[!\[.*)$/m,
      (badges) => `<div class="shields-ctn">\n\n${badges}\n\n</div>`
    );

await rm(outputDir, { recursive: true, force: true });

const generated: string[] = [];

const packageNames = await readdir(packagesDir);

for (const name of packageNames.toSorted()) {
  const readmePath = path.join(packagesDir, name, "README.md");
  const pkgPath = path.join(packagesDir, name, "package.json");
  if (
    !existsSync(readmePath) ||
    !existsSync(pkgPath) ||
    existsSync(path.join(docsDir, name))
  ) {
    continue;
  }
  const pkg = JSON.parse(await readFile(pkgPath, "utf8")) as {
    name: string;
    description?: string;
    private?: boolean;
  };
  if (pkg.private === true) {
    continue;
  }

  const description = pkg.description ?? "";
  const dir = path.join(outputDir, name);
  await mkdir(dir, { recursive: true });
  await writeFile(
    path.join(dir, "index.md"),
    `---
title: ${JSON.stringify(pkg.name)}
description: ${JSON.stringify(description)}
---

${toMarkdown(await readFile(readmePath, "utf8"))}`
  );
  await writeFile(
    path.join(dir, "meta.json"),
    `${JSON.stringify(
      { title: pkg.name, description, root: true, pages: ["index"] },
      null,
      2
    )}\n`
  );
  generated.push(pkg.name);
}

console.log(`Generated README docs: ${generated.join(", ")}`);
