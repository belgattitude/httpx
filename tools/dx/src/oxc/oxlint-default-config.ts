import { defineConfig, type OxlintConfig } from "oxlint";
// import antiSlop from "ultracite/oxlint/anti-slop";
import core from "ultracite/oxlint/core";
import { jsPluginSettings, selectJsPlugins } from "ultracite/oxlint/js-plugins";
import vitest from "ultracite/oxlint/vitest";

import { defaultIgnorePatterns } from "./default-ignore-patterns.ts";
import { resolveJsPlugin } from "./resolve-js-plugin.ts";

/**
 * Rules from oxlint's `pedantic` and `nursery` categories. The ultracite preset
 * enables them one by one, they are outside oxlint's recommended set so we turn
 * them off here. Opt back in by removing a rule from this list.
 *
 * Rules that exist in eslint-plugin-unicorn are deliberately NOT in this list,
 * they stay enabled whatever their oxlint category.
 */
const pedanticAndNurseryRules = [
  "accessor-pairs",
  "array-callback-return",
  "eqeqeq",
  "jsdoc/require-param-description",
  "jsdoc/require-param-name",
  "jsdoc/require-returns-description",
  "jsdoc/require-throws-type",
  "jsdoc/require-yields-type",
  "max-classes-per-file",
  "max-nested-callbacks",
  "no-array-constructor",
  "no-constructor-return",
  "no-else-return",
  "no-inline-comments",
  "no-inner-declarations",
  "no-lonely-if",
  "no-loop-func",
  "no-object-constructor",
  "no-promise-executor-return",
  "no-self-compare",
  "no-unreachable-loop",
  "no-useless-return",
  "no-warning-comments",
  "oxc/branches-sharing-code",
  "radix",
  "require-unicode-regexp",
  "sort-vars",
  "symbol-description",
  "typescript/ban-types",
  "typescript/no-confusing-void-expression",
  "typescript/prefer-ts-expect-error",
] as const;

/**
 * ESLint core rules that are turned off because a typescript-eslint or unicorn
 * rule already covers them (the key is the disabled rule, the value the rule
 * that replaces it). Keep the replacement enabled, otherwise nothing checks it.
 */
const eslintRulesCoveredByTypescriptOrUnicorn = {
  "no-throw-literal": "typescript/only-throw-error",
  "prefer-promise-reject-errors": "typescript/prefer-promise-reject-errors",
  "no-negated-condition": "unicorn/no-negated-condition",
  "no-new-wrappers": "unicorn/new-for-builtins",
  "require-await": "typescript/require-await",
} as const;

/**
 * oxlint `unicorn/*` rules that do not exist in eslint-plugin-unicorn anymore
 * (checked against v76, they were removed or replaced upstream). ultracite still
 * enables them, so they are turned off explicitly.
 */
const unicornRulesMissingUpstream = [
  //"unicorn/no-array-for-each", -> renamed to no-for-each in upstream
  "unicorn/no-hex-escape",
  "unicorn/no-instanceof-array",
  "unicorn/no-length-as-slice-end",
  "unicorn/prefer-dom-node-dataset",
] as const;

export const oxlintDefaultConfig: OxlintConfig = defineConfig({
  extends: [
    core,
    vitest,
    // antiSlop,
    selectJsPlugins([]),
  ],
  jsPlugins: [
    resolveJsPlugin("security", "eslint-plugin-security"),
    resolveJsPlugin("import-zod", "oxlint-plugin-import-zod"),
  ],
  options: {
    typeAware: true,
    typeCheck: false,
  },
  ignorePatterns: [...defaultIgnorePatterns],
  rules: {
    // zod must be imported as a namespace (`import * as z from "zod"`) for better tree-shaking
    "import-zod/prefer-zod-namespace": "error",
    // no autofix and existing code mixes camelCase, PascalCase and kebab-case (~60 files would need renaming, even with pascalCase allowed)
    "unicorn/filename-case": "off",
    // buggy: the autofix rewrites `"utf8"` to `"utf-8"`, which is not assignable to node's `BufferEncoding` typings
    "unicorn/text-encoding-identifier-case": "off",
    // classes with only static members are used as namespaces for utility helpers, converting them to plain objects is not wanted
    "unicorn/no-static-only-class": "off",
    // the autofix groups hex digits by bytes (`0x01_9d_21_..n`), which hurts the readability of 128-bit values (uuid as bigint) and is not wanted for now
    "unicorn/numeric-separators-style": "off",
    // nursery (so not enabled by the preset) but part of eslint:recommended since ESLint 10
    "no-useless-assignment": "error",
    // not equivalent to Number.parseInt/parseFloat: Number() returns NaN on trailing garbage ("12px") and 0 on "" where parseInt keeps the leading digits / returns NaN
    "unicorn/prefer-number-coercion": "off",
    // conflicts with typescript/consistent-return (the autofix turns `return undefined;` into a bare `return;` in functions returning values elsewhere)
    // and with React 19 types, where `useRef<T>(undefined)` needs the explicit argument
    "unicorn/no-useless-undefined": "off",
    // competes with typescript/require-await: promise-function-async wants every function returning a Promise to be `async`,
    // require-await rejects an `async` function without `await`, so a function that only returns a Promise (interface fakes, mocks,
    // handlers typed to return a Promise) can't satisfy both. We keep require-await, it catches the useless `async` keywords.
    "typescript/promise-function-async": "off",
    // sequential awaits in loops are deliberate here (ordered batches, DB/file steps, retries), switching them to Promise.all would
    // change the ordering / concurrency. Customization of the preset, use a reasoned disable comment where parallel is wanted.
    "no-await-in-loop": "off",
    // classes implementing an interface (fakes, repos) and arrow-function class fields can't be turned into static methods
    "class-methods-use-this": [
      "error",
      { ignoreClassesWithImplements: "all", enforceForClassFields: false },
    ],

    // Customizations
    "import/consistent-type-specifier-style": [
      "error",
      "prefer-top-level-if-only-type-imports",
    ],
    "arrow-body-style": [
      "error",
      "as-needed",
      { requireReturnForObjectLiteral: true },
    ],
    // this is garbage in ultracite
    "no-plusplus": "off",
    // key order matters for some APIs and objects are not sorted in this codebase (the ultracite tanstack preset turns it off too)
    "sort-keys": "off",
    "no-warning-comments": "off",

    // Always activate security rules
    "security/detect-bidi-characters": "error",
    "security/detect-invisible-characters": "error",
    "security/detect-buffer-noassert": "error",
    "security/detect-eval-with-expression": "error",
    "security/detect-new-buffer": "error",
    "security/detect-non-literal-require": "error",
    "security/detect-child-process": "error",
  },
  settings: jsPluginSettings,
  overrides: [
    {
      // Typescript and tsx files overrides
      files: ["*.ts", "*.tsx"],
      rules: {
        "prefer-named-capture-group": "off",
        "jsdoc/require-param-description": "off",
        "jsdoc/require-throws-type": "off",
        "require-unicode-regexp": "off",
        "prefer-template": "off",
        //"no-useless-rename": "off",
        "no-unsafe-type-assertion": "off",
        "no-unnecessary-type-parameters": "off",
        "no-unnecessary-boolean-literal-compare": "off",
        "func-style": "off",
        "no-inline-comments": "off",
        "consistent-type-definitions": "off",
        "no-shadow": "off",
        complexity: "off",
        "no-explicit-any": "error",
        "jsdoc/check-tag-names": "off",
      },
    },
    {
      // Javascript esm files overrides
      files: ["*.js", "*.mjs"],
      rules: {
        "prefer-named-capture-group": "off",
      },
    },
    {
      // Commonjs files overrides
      files: ["*.cjs"],
      rules: {},
    },
    {
      // Test files
      files: ["*.test.{ts,tsx}", "*.test-d.{ts,tsx}", "*.spec.{ts,tsx}"],
      plugins: ["vitest"],
      rules: {
        "func-name-matching": "off",
        // test helpers are declared next to the tests using them (inside describe/it), hoisting them hurts readability
        "unicorn/consistent-function-scoping": "off",
        // fixtures and mocks are asserted non-null (`rows[0]!`) all over the tests, a failure there is an assertion error anyway
        "typescript/no-non-null-assertion": "off",
        "require-unicode-regexp": "off",
        "no-unsafe-type-assertion": "off",
        "no-unsafe-member-access": "off",
        "strict-boolean-expressions": "off",
        "no-unsafe-assignment": "off",
        "prefer-named-capture-group": "off",
        "vitest/expect-expect": "error",
        "vitest/max-expects": "off",
        "vitest/no-mocks-import": "error",
        "vitest/no-standalone-expect": "error",
        "vitest/no-unneeded-async-expect-function": "error",
        "vitest/prefer-called-exactly-once-with": "error",
        // a hint renames every snapshot key, forcing a full snapshot rewrite
        "vitest/prefer-snapshot-hint": "error",
        "vitest/no-identical-title": "error",
        "vitest/no-import-node-test": "error",
        "vitest/prefer-to-be": "error",
        "vitest/no-conditional-expect": "error",
        // `toBe(true)` is stricter than `toBeTruthy()`
        "vitest/prefer-to-be-truthy": "off",
        "vitest/prefer-to-be-falsy": "off",
        "vitest/prefer-importing-vitest-globals": "off",
        // false positive when the described subject isn't a function
        "vitest/prefer-describe-function-title": "off",
        // typed `import()` mocks reject partial module mocks
        "vitest/prefer-import-in-mock": "off",
      },
    },
    {
      // Type tests (vitest typecheck) may assert with `@ts-expect-error` only
      files: ["*.test-d.{ts,tsx}"],
      plugins: ["vitest"],
      rules: {
        "vitest/expect-expect": "off",
      },
    },
    {
      // Test, bench and script code builds fixtures and mocks, so anti-slop's
      // boundary-parsing rules add noise rather than safety there.
      files: [
        "*.test.ts",
        "*.test-d.ts",
        "*.spec.ts",
        "**/tests/**",
        "**/bench/**",
        "**/scripts/**",
      ],
      rules: {
        // "anti-slop/require-safety-comment-for-type-assertion": "off",
        // "anti-slop/no-chained-type-assertions": "off",
        // "anti-slop/no-runtime-typeof": "off",
        // "anti-slop/no-unsafe-dictionary-type": "off",
        // "anti-slop/no-unknown-parameters": "off",
        // "anti-slop/no-unknown-returns": "off",
        // "anti-slop/no-known-value-widening": "off",
        // "anti-slop/no-module-mocking": "off",
      },
    },
    {
      // Last override: wins over the ones set by the extended presets.
      files: ["**/*"],
      rules: {
        ...Object.fromEntries(
          [
            ...pedanticAndNurseryRules,
            ...unicornRulesMissingUpstream,
            ...Object.keys(eslintRulesCoveredByTypescriptOrUnicorn),
          ].map((rule) => [rule, "off" as const])
        ),
        // the ultracite preset turns it off, but it replaces the eslint require-await (see eslintRulesCoveredByTypescriptOrUnicorn)
        "typescript/require-await": "error",
        // pedantic, but worth surfacing: only a warning until the deprecated usages are cleaned up
        "typescript/no-deprecated": "warn",
      },
    },
  ],
});
