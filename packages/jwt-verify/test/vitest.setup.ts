const isBrowser = typeof window !== "undefined";
if (!isBrowser) {
  const { config } = await import("@dotenvx/dotenvx").then((mod) => mod);
  config({ path: [".env.local"] });
}
// oxlint-disable-next-line unicorn/require-module-specifiers -- makes this file a module, required for the top-level await
export {};
