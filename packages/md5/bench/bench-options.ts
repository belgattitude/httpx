import { vitestBenchOptionsConfig } from "@httpx/devtools-vitest";

const { isCiOrCodSpeed } = vitestBenchOptionsConfig;

export const benchConfig = {
  /**
   * Number of strings hashed per bench iteration (~700 chars each), kept
   * small in CI and CodSpeed (instrumented runs are slow).
   */
  totalStrings: isCiOrCodSpeed ? 100 : 10_000,
  benchOptions: {
    warmupIterations: 1,
    iterations: 1,
    // 100ms in CI or CodSpeed, vitest default in local
    ...(isCiOrCodSpeed ? { time: 100 } : {}),
  },
} as const;
