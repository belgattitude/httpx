# @httpx/dx

Shared lint, format and TypeScript configurations for the httpx monorepo.

This package is private: it is only consumed inside the workspace.

## Install

Add it as a dev dependency of the workspace package:

```json
{
  "devDependencies": {
    "@httpx/dx": "workspace:*"
  }
}
```

The lint and format tooling is shipped as regular dependencies of this package, so the versions are pinned in a single place:

| Dependency | Used by |
| --- | --- |
| `oxlint`, `oxlint-tsgolint`, `oxfmt`, `ultracite` | every package |
| `eslint-plugin-security`, `oxlint-plugin-import-zod` | every package (JS plugins loaded by `oxlintDefaultConfig`) |
| `oxlint-tailwindcss`, `@tanstack/eslint-plugin-query`, `eslint`, `oxlint-plugin-react-doctor` | React and Next.js packages only (`createOxlintReactConfig`, `createOxlintNextjsConfig`) |

Use the `dx-oxlint` and `dx-oxfmt` bins to run the pinned oxlint and oxfmt versions.

## Exports

| Export | Description |
| --- | --- |
| `oxlintDefaultConfig` | oxlint base for every package |
| `createOxlintReactConfig(options)` | oxlint base for React + Tailwind CSS packages |
| `createOxlintNextjsConfig(options)` | oxlint base for Next.js apps |
| `oxfmtDefaultConfig` | oxfmt configuration |
| `@httpx/dx/typescript/tsconfig.base.json` | base `tsconfig.json` |
| `@httpx/dx/oxlint` | re-export of `oxlint` (`defineConfig`…) |
| `@httpx/dx/oxfmt` | re-export of `oxfmt` (`defineConfig`, `format`…) |

## Bins

| Bin | Description |
| --- | --- |
| `dx-oxlint` | runs the pinned oxlint, with `OXLINT_TSGOLINT_PATH` pointing to the pinned tsgolint (unless already set) |
| `dx-oxfmt` | runs the pinned oxfmt |

```json
{
  "scripts": {
    "format": "dx-oxfmt --write",
    "lint": "dx-oxfmt --check --no-error-on-unmatched-pattern && dx-oxlint",
    "lint-fix": "dx-oxlint --fix && dx-oxfmt --write"
  }
}
```

## oxlint

### Default base

`oxlintDefaultConfig` extends the ultracite `core` and `vitest` presets and adds:

- type-aware linting (`oxlint-tsgolint`)
- the `eslint-plugin-security` and `oxlint-plugin-import-zod` JS plugins (zod must be imported as a namespace)
- the monorepo ignore patterns
- `pedantic` and `nursery` rules turned off, `typescript/require-await` enabled and `typescript/no-deprecated` as a warning

```ts
// oxlint.config.ts
import { oxlintDefaultConfig } from "@httpx/dx";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [oxlintDefaultConfig],
  overrides: [],
});
```

`typescript/require-await` is re-enabled in the last `**/*` override of the base. To turn it off in a package, use an override too, a top level `rules` entry is not enough:

```ts
export default defineConfig({
  extends: [oxlintDefaultConfig],
  overrides: [
    {
      files: ["*.ts"],
      rules: {
        "typescript/require-await": "off",
      },
    },
  ],
});
```

### React base

`createOxlintReactConfig` is the default base plus:

- the react, react-perf and jsx-a11y rules (ultracite `react` preset)
- the TanStack rules (ultracite `tanstack` preset) and the React Query rules of `oxlint-plugin-react-doctor`
- the `@tanstack/eslint-plugin-query` rules (recommended + `prefer-query-options`)
- the `oxlint-tailwindcss` rules (Tailwind CSS v4)

oxlint does not merge the `settings` of an extended config, so spread the returned config as the root one instead of putting it in `extends`. Merge its `rules` when adding your own:

```ts
// oxlint.config.ts
import { createOxlintReactConfig } from "@httpx/dx";
import { defineConfig } from "oxlint";

const reactConfig = createOxlintReactConfig({
  // the css file containing `@import "tailwindcss"`
  tailwindEntryPoint: "src/styles/globals.css",
});

export default defineConfig({
  ...reactConfig,
  rules: {
    ...reactConfig.rules,
  },
  overrides: [],
});
```

### Next.js base

`createOxlintNextjsConfig` is the React base plus the oxlint `nextjs` plugin rules (ultracite `next` preset). On the Next.js route files (`page`, `layout`, `error`...), it turns off `react/function-component-definition` so they keep the `export default function Page()` convention.

It takes the same options as the React base and is used the same way. It also returns `overrides`, merge them when adding your own:

```ts
// oxlint.config.ts
import { createOxlintNextjsConfig } from "@httpx/dx";
import { defineConfig } from "oxlint";

const nextjsConfig = createOxlintNextjsConfig({
  tailwindEntryPoint: "src/styles/globals.css",
});

export default defineConfig({
  ...nextjsConfig,
  rules: {
    ...nextjsConfig.rules,
  },
  overrides: [...nextjsConfig.overrides],
});
```

## oxfmt

```ts
// oxfmt.config.ts
export { oxfmtDefaultConfig as default } from "@httpx/dx";
```

In a Tailwind CSS package, give oxfmt the stylesheet. Otherwise it sorts the classes without the theme, in a different order than the `tailwindcss/enforce-sort-order` lint rule:

```ts
// oxfmt.config.ts
import { oxfmtDefaultConfig } from "@httpx/dx";
import { defineConfig } from "oxfmt";

export default defineConfig({
  ...oxfmtDefaultConfig,
  sortTailwindcss: {
    ...(typeof oxfmtDefaultConfig.sortTailwindcss === "object"
      ? oxfmtDefaultConfig.sortTailwindcss
      : {}),
    stylesheet: "./src/styles/globals.css",
  },
});
```

## TypeScript

```json
{
  "extends": "@httpx/dx/typescript/tsconfig.base.json"
}
```

The base `include` and `exclude` use `${configDir}` (TypeScript 5.5+), so they resolve against the package tsconfig extending it: no need to repeat them in the package.
