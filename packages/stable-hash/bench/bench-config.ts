import { vitestBenchOptionsConfig } from "@httpx/devtools-vitest";

const { isCiOrCodSpeed } = vitestBenchOptionsConfig;
export const benchConfig = {
  benchOptions: {
    iterations: isCiOrCodSpeed ? 2 : 10,
  },
} as const;
