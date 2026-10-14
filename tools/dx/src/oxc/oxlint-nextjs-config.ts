import { defineConfig } from "oxlint";
import next from "ultracite/oxlint/next";

import { createOxlintReactConfig } from "./oxlint-react-config.ts";

/**
 * App router special files and pages router pages.
 *
 * @link https://nextjs.org/docs/app/api-reference/file-conventions
 */
const nextjsRouteFiles = [
  "**/app/**/{page,layout,template,loading,error,global-error,not-found,default,forbidden,unauthorized}.{jsx,tsx}",
  "**/pages/**/*.{jsx,tsx}",
];

type OxlintNextjsConfigOptions = Parameters<typeof createOxlintReactConfig>[0];

/**
 * Alternate oxlint base for the Next.js apps.
 *
 * It is the react base ({@link createOxlintReactConfig}) plus the oxlint `nextjs`
 * plugin rules (ultracite next preset). On the Next.js route files, the function
 * declarations required by the react base are not enforced.
 *
 * Like the react base, use the returned config as the root one (spread it) instead
 * of putting it in `extends`, oxlint does not merge the `settings` of an extended config.
 * Merge its `overrides` when adding your own:
 *
 * ```ts
 * const nextjsConfig = createOxlintNextjsConfig({ tailwindEntryPoint: "src/styles/globals.css" });
 * export default defineConfig({
 *   ...nextjsConfig,
 *   overrides: [...nextjsConfig.overrides, { files: ["*.ts"], rules: {} }],
 * });
 * ```
 */
export const createOxlintNextjsConfig = (
  options: OxlintNextjsConfigOptions
) => {
  const reactConfig = createOxlintReactConfig(options);
  return defineConfig({
    ...reactConfig,
    extends: [...(reactConfig.extends ?? []), next],
    overrides: [
      {
        // Next.js route files are default exported function declarations by convention
        // (`export default function Page()`), keep the arrow functions rule for the other components.
        files: nextjsRouteFiles,
        rules: {
          "react/function-component-definition": "off",
        },
      },
    ],
  });
};
