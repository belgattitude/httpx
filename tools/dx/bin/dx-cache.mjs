#!/usr/bin/env node

/**
 * Manages the tool caches of the monorepo (see `dxConfig`): the global cache
 * (`<root>/.cache`, one directory per tool) and the cache of the root and of
 * every package (`node_modules/.cache`).
 *
 * @example dx-cache stats
 * @example dx-cache clean --dry-run
 */

import { existsSync, readdirSync, rmSync, statSync } from "node:fs";
import path from "node:path";

import { findMonorepoRoot } from "../src/cache/monorepo-cache-dir.ts";
import { dxConfig } from "../src/dx-config.ts";

const help = `Usage: dx-cache <command> [options]

Manages the tool caches of the monorepo:
  - the global cache: <root>/${dxConfig.cacheDir}/<tool>
  - the package caches: <package>/${dxConfig.packageCacheDir}

Commands:
  stats              Show the number and the size of the cached files, with a total
  clean              Remove the caches

Options:
  --dry-run          (clean) List the caches without removing them
  -h, --help         Show this help
`;

/**
 * Collects the package cache directories under `dir`, without walking into
 * node_modules and dot directories (.git, .turbo...).
 *
 * @param {string} dir
 * @returns {string[]}
 */
const findPackageCaches = (dir) => {
  const caches = [];
  const packageCache = path.join(dir, dxConfig.packageCacheDir);
  if (existsSync(packageCache)) {
    caches.push(packageCache);
  }
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (
      entry.isDirectory() &&
      entry.name !== "node_modules" &&
      !entry.name.startsWith(".")
    ) {
      caches.push(...findPackageCaches(path.join(dir, entry.name)));
    }
  }
  return caches;
};

/**
 * @param {string} root
 * @returns {{ global: string, caches: string[] }} the global cache and all the
 * existing cache directories (one per tool for the global cache)
 */
const findCaches = (root) => {
  const global = path.join(root, dxConfig.cacheDir);
  const toolCaches = existsSync(global)
    ? readdirSync(global, { withFileTypes: true }).map((entry) =>
        path.join(global, entry.name)
      )
    : [];
  return { global, caches: [...toolCaches, ...findPackageCaches(root)] };
};

/**
 * Counts the files (symlinks are not followed) under `entryPath`.
 *
 * @param {string} entryPath
 * @returns {{ files: number, bytes: number }}
 */
const measure = (entryPath) => {
  const stats = statSync(entryPath, { throwIfNoEntry: false });
  if (stats === undefined) {
    return { files: 0, bytes: 0 };
  }
  if (!stats.isDirectory()) {
    return { files: 1, bytes: stats.size };
  }
  let files = 0;
  let bytes = 0;
  for (const entry of readdirSync(entryPath, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) {
      continue;
    }
    const child = measure(path.join(entryPath, entry.name));
    files += child.files;
    bytes += child.bytes;
  }
  return { files, bytes };
};

/**
 * @param {number} bytes
 * @returns {string}
 */
const formatBytes = (bytes) => {
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return `${unit === 0 ? value : value.toFixed(1)} ${units[unit]}`;
};

/**
 * @param {string} root
 */
const stats = (root) => {
  const { caches } = findCaches(root);
  if (caches.length === 0) {
    console.log("No cache");
    return;
  }
  const total = { files: 0, bytes: 0 };
  /** @type {string[][]} */
  const rows = [];
  for (const cache of caches) {
    const { files, bytes } = measure(cache);
    total.files += files;
    total.bytes += bytes;
    rows.push([path.relative(root, cache), String(files), formatBytes(bytes)]);
  }
  const header = ["Cache", "Files", "Size"];
  const footer = ["Total", String(total.files), formatBytes(total.bytes)];
  const widths = [0, 1, 2].map((col) =>
    Math.max(
      ...[header, ...rows, footer].map((line) => (line[col] ?? "").length)
    )
  );
  /**
   * @param {string[]} line
   * @returns {string}
   */
  const format = ([name = "", files = "", size = ""]) =>
    [
      name.padEnd(widths[0] ?? 0),
      files.padStart(widths[1] ?? 0),
      size.padStart(widths[2] ?? 0),
    ].join("  ");
  const separator = "-".repeat(format(header).length);
  console.log(
    [
      format(header),
      separator,
      ...rows.map(format),
      separator,
      format(footer),
    ].join("\n")
  );
};

/**
 * @param {string} root
 * @param {boolean} dryRun
 */
const clean = (root, dryRun) => {
  const { global, caches } = findCaches(root);
  const toRemove = [
    ...(existsSync(global) ? [global] : []),
    ...caches.filter((cache) => !cache.startsWith(global + path.sep)),
  ];
  if (toRemove.length === 0) {
    console.log("No cache to remove");
    return;
  }
  for (const cache of toRemove) {
    if (!dryRun) {
      rmSync(cache, { recursive: true, force: true });
    }
    console.log(
      `${dryRun ? "Would remove" : "Removed"} ${path.relative(root, cache)}`
    );
  }
};

const args = process.argv.slice(2);
const command = args.find((arg) => !arg.startsWith("-"));

if (args.includes("--help") || args.includes("-h")) {
  console.log(help);
  process.exit(0);
}
if (command !== "stats" && command !== "clean") {
  console.error(
    command === undefined
      ? help
      : `dx-cache: unknown command "${command}"\n\n${help}`
  );
  process.exit(1);
}

const root = findMonorepoRoot();
if (root === undefined) {
  console.error(`dx-cache: no pnpm-workspace.yaml found from ${process.cwd()}`);
  process.exit(1);
}

if (command === "stats") {
  stats(root);
} else {
  clean(root, args.includes("--dry-run"));
}
