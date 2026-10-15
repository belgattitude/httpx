export {
  createVitestConfig,
  type CreateVitestConfigOptions,
} from "./vitest/create-vitest-config.ts";
export { vitestDefaultConfig } from "./vitest/vitest-default-config.ts";
// Re-exported so consumers only depend on @httpx/dx
export * from "vitest/config";
