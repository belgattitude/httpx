import { defineConfig } from "oxlint";
import { jsPluginSettings } from "ultracite/oxlint/js-plugins";
import react from "ultracite/oxlint/react";
import tanstack from "ultracite/oxlint/tanstack";
import tanstackJsPlugins from "ultracite/oxlint/tanstack/js-plugins";

import { oxlintDefaultConfig } from "./oxlint-default-config.ts";

/**
 * oxlint-tailwindcss rules (Tailwind CSS v4), at the severity the plugin recommends.
 * oxlint's `categories` never turn on the rules of a JS plugin, so they are listed one by one.
 * The opt-in ones are listed as "off" to make the choice visible.
 *
 * @link https://oxlint-tailwindcss.pages.dev
 */
const tailwindRules = {
  // Correctness
  "tailwindcss/no-conflicting-classes": "error",
  "tailwindcss/no-contradicting-variants": "warn",
  "tailwindcss/no-dark-without-light": "warn",
  "tailwindcss/no-duplicate-classes": "warn",
  "tailwindcss/no-dynamic-classes": "error",
  "tailwindcss/no-unknown-classes": "off",
  // Modernization
  "tailwindcss/enforce-canonical": "warn",
  "tailwindcss/enforce-negative-arbitrary-values": "warn",
  "tailwindcss/no-deprecated-classes": "error",
  "tailwindcss/no-unnecessary-arbitrary-value": "warn",
  "tailwindcss/prefer-scale-token": "off",
  "tailwindcss/prefer-theme-tokens": "off",
  // Consistency
  "tailwindcss/consistent-variant-order": "warn",
  "tailwindcss/enforce-consistent-important-position": "warn",
  "tailwindcss/enforce-consistent-line-wrapping": "off",
  "tailwindcss/enforce-consistent-variable-syntax": "warn",
  "tailwindcss/enforce-logical": "off",
  "tailwindcss/enforce-physical": "off",
  "tailwindcss/enforce-shorthand": "warn",
  "tailwindcss/enforce-sort-order": "warn",
  "tailwindcss/no-unnecessary-whitespace": "warn",
  // Design-system guardrails
  "tailwindcss/max-class-count": "off",
  "tailwindcss/no-arbitrary-value": "off",
  "tailwindcss/no-borrowed-component-styles": "off",
  "tailwindcss/no-default-palette": "off",
  "tailwindcss/no-hardcoded-colors": "warn",
  "tailwindcss/no-restricted-classes": "off",
} as const;

type OxlintReactConfigOptions = {
  /**
   * The css file containing `@import "tailwindcss"`, relative to the package linted
   * (ie: "src/styles/global.css"). Required by the tailwind rules to read the theme.
   */
  tailwindEntryPoint: string;
};

/**
 * The `tanstack-start-*` rules of ultracite's `tanstack/js-plugins` preset, left out on purpose:
 * we use React Query (kept) but not TanStack Start.
 */
const tanstackStartRules = [
  "tanstack-start-get-mutation",
  "tanstack-start-loader-parallel-fetch",
  "tanstack-start-missing-head-content",
  "tanstack-start-no-anchor-element",
  "tanstack-start-no-direct-fetch-in-loader",
  "tanstack-start-no-dynamic-server-fn-import",
  "tanstack-start-no-navigate-in-render",
  "tanstack-start-no-secrets-in-loader",
  "tanstack-start-no-use-server-in-handler",
  "tanstack-start-no-useeffect-fetch",
  "tanstack-start-redirect-in-try-catch",
  "tanstack-start-route-property-order",
  "tanstack-start-server-fn-method-order",
  "tanstack-start-server-fn-validate-input",
].map((rule) => `react-doctor/${rule}`);

/**
 * @tanstack/eslint-plugin-query rules: its `recommended` set plus `prefer-query-options` (from `recommended-strict`).
 *
 * @link https://tanstack.com/query/latest/docs/eslint/eslint-plugin-query
 */
const tanstackQueryRules = {
  "@tanstack/query/exhaustive-deps": "error",
  "@tanstack/query/no-rest-destructuring": "warn",
  "@tanstack/query/stable-query-client": "error",
  "@tanstack/query/no-unstable-deps": "error",
  "@tanstack/query/infinite-query-property-order": "error",
  "@tanstack/query/no-void-query-fn": "error",
  "@tanstack/query/mutation-property-order": "error",
  "@tanstack/query/prefer-query-options": "error",
} as const;

/**
 * React Doctor's query rules that the official plugin above reports too, turned off to avoid duplicate diagnostics.
 */
const duplicatedReactDoctorQueryRules = [
  "react-doctor/query-no-rest-destructuring",
  "react-doctor/query-no-void-query-fn",
  "react-doctor/query-stable-query-client",
] as const;

/**
 * Alternate oxlint base for the packages rendering React with Tailwind CSS.
 *
 * It is the default base ({@link oxlintDefaultConfig}) plus:
 * - react, react-perf and jsx-a11y rules (ultracite react preset)
 * - the TanStack option ordering and route file rules (ultracite tanstack preset)
 * - the oxlint-tailwindcss rules
 * - the @tanstack/eslint-plugin-query rules (recommended + prefer-query-options)
 * - the React Query rules of ultracite's `tanstack/js-plugins` preset (oxlint-plugin-react-doctor)
 *
 * oxlint does not merge the `settings` of an extended config, so use the returned
 * config as the root one (spread it) instead of putting it in `extends`:
 *
 * ```ts
 * export default defineConfig({
 *   ...createOxlintReactConfig({ tailwindEntryPoint: "src/styles/global.css" }),
 *   overrides: [],
 * });
 * ```
 */
export const createOxlintReactConfig = (options: OxlintReactConfigOptions) =>
  defineConfig({
    extends: [oxlintDefaultConfig, react, tanstack, tanstackJsPlugins],
    jsPlugins: [
      "oxlint-tailwindcss",
      {
        name: "@tanstack/query",
        specifier: "@tanstack/eslint-plugin-query",
      },
    ],
    settings: {
      ...jsPluginSettings,
      tailwindcss: {
        // mapped by glob so the rules also run on the plain `*.ts` files (`cva()`, `cn()`, `className` variables, ...)
        entryPoint: [
          {
            files: ["**/*.ts", "**/*.tsx"],
            use: options.tailwindEntryPoint,
          },
        ],
      },
    },
    rules: {
      ...tanstackQueryRules,
      ...Object.fromEntries(
        duplicatedReactDoctorQueryRules.map((rule) => [rule, "off"])
      ),
      ...Object.fromEntries(tanstackStartRules.map((rule) => [rule, "off"])),
      ...tailwindRules,
      // forwardRef is deprecated in React 19 (`ref` is a regular prop of function components). No lint rule reports it:
      // React Doctor's `no-react19-deprecated-apis` only targets APIs React 19 removed and `forward-ref-uses-ref` just checks
      // that the render function accepts `ref`. So `React.forwardRef(...)` is banned explicitly. `import { forwardRef }` is not:
      // `no-restricted-imports` also reports every `import * as React from "react"` (the shadcn convention used all over the code).
      "no-restricted-properties": [
        "error",
        {
          object: "React",
          property: "forwardRef",
          message:
            "forwardRef is deprecated in React 19, take `ref` as a regular prop instead.",
        },
      ],
      // The preset only sets namedComponents, unnamed ones (`memo(() => ...)`, `forwardRef(...)`) then default to
      // function expressions, which `func-names` rejects. Arrow functions everywhere.
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "arrow-function",
          unnamedComponents: "arrow-function",
        },
      ],
    },
  });
