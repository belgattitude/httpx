import browserslistToEsbuild from "browserslist-to-esbuild";
import type { UserConfig } from "tsdown";

const nodeTarget = "node22";

export type CreateTsdownConfigOptions = {
  /**
   * Add the browsers of the package `.browserslistrc` to the esbuild target
   * (resolved from the current working directory, i.e. the package being built).
   * @default false
   */
  browserslist?: boolean;
};

const getTarget = (browserslist: boolean): string[] =>
  browserslist ? [nodeTarget, ...browserslistToEsbuild()] : [nodeTarget];

/**
 * tsdown base for the publishable packages: esm only, declarations from
 * `tsconfig.build.json`, attw and publint checks.
 */
export const createTsdownConfig = (
  options: CreateTsdownConfigOptions = {}
): UserConfig => {
  const { browserslist = false } = options;
  const target = getTarget(browserslist);
  return {
    entry: ["./src/index.ts"],
    attw: {
      profile: "esm-only",
      level: "error",
    },
    publint: {
      level: "error",
    },
    // Declarations only for src (the package tsconfig also covers tests, config files...)
    dts: { tsconfig: "./tsconfig.build.json" },
    clean: true,
    format: {
      esm: {
        target,
      },
    },
    platform: "neutral",
    treeshake: true,
    exports: false,
    minify: "dce-only",
    unbundle: false,
    ...(browserslist
      ? {
          hooks: {
            // Logged when building, not when the config is imported
            "build:prepare": () => {
              console.log(
                `[@httpx/dx] tsdown browserslist enabled, target: ${target.join(", ")}`
              );
            },
          },
        }
      : {}),
  };
};
