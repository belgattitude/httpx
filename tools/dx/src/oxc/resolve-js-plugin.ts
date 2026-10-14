import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

/**
 * oxlint resolves `jsPlugins` specifiers from the consuming package. The plugins are
 * dependencies of @httpx/dx, so resolve them from here: it doesn't rely on hoisting.
 */
export const resolveJsPlugin = (name: string, specifier: string) => {
  return { name, specifier: require.resolve(specifier) };
};
