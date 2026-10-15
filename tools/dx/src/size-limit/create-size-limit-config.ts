import browserslistToEsbuild from "browserslist-to-esbuild";
import type { Check, SizeLimitConfig } from "size-limit";

export type CreateSizeLimitConfigOptions = {
  /**
   * Bundle the checks for the browsers of the package `.browserslistrc` (resolved
   * from the current working directory) instead of the esbuild default (esnext).
   * @default false
   */
  browserslist?: boolean;
};

let browserslistLogged = false;

const withBrowserslistTarget = (check: Check): Check => {
  return {
    ...check,
    modifyEsbuildConfig: (config) => {
      const target = browserslistToEsbuild();
      // Logged when measuring (not when the config is imported), on stderr to
      // keep the `--json` output parsable
      if (!browserslistLogged) {
        browserslistLogged = true;
        console.error(
          `[@httpx/dx] size-limit browserslist enabled, target: ${target.join(", ")}`
        );
      }
      const modified = { ...config, target };
      return check.modifyEsbuildConfig
        ? check.modifyEsbuildConfig(modified)
        : modified;
    },
  };
};

/**
 * size-limit config for the given checks (the limits are specific to each package).
 */
export const createSizeLimitConfig = (
  checks: SizeLimitConfig,
  options: CreateSizeLimitConfigOptions = {}
): SizeLimitConfig => {
  const { browserslist = false } = options;
  return browserslist ? checks.map(withBrowserslistTarget) : checks;
};
