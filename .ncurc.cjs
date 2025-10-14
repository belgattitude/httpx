// @ts-check

const { defineConfig } = require('npm-check-updates');

module.exports = defineConfig({
  workspaces: true,
  mergeConfig: true,
  root: true,
  packageManager: "yarn",
  /**
  cooldown: (packageName) => {
    if (npmPreapprovedPackagesPrefixes.some((prefix) => packageName.startsWith(prefix))) {
      return 1;
    }
    return 3;
  },*/
  cooldown: packageName => (packageName.startsWith('@my-company') ? 0 : 3),
  reject: [
    // Cause v9 isn't yet supported
    "eslint",
    // Cause v5 contains a postinstall script that looks suspicious
    "normalize-diacritics",
    "recharts",
    // Cause latest is obsolete
    // "@duckdb/duckdb-wasm",
    // Cause kubb has an issue in v4
    "@kubb/cli",
    "@kubb/core",
    "@kubb/oas",
    "@kubb/plugin-client",
    "@kubb/plugin-oas",
    "@kubb/plugin-react-query",
    "rooks",
    // Opentelemetry
    "@opentelemetry/exporter-trace-otlp-http",
    "@opentelemetry/resources",
    "@opentelemetry/sdk-node",
    "@opentelemetry/sdk-trace-node",
    "@opentelemetry/semantic-conventions"
    // hono-api can be challenging to auto-update, uncomment if needed
    // "@standard-community/standard-json",
    // "@standard-community/standard-openapi",
    // "hono-openapi"
  ]
})
