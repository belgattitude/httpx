import { vitestBenchOptionsConfig } from "@httpx/devtools-vitest";
import type { BenchRunOptions } from "vitest";

const isCiOrCodSpeed =
  vitestBenchOptionsConfig.isCiOrCodSpeed ||
  ["true", "1"].includes(process.env?.CI ?? "false");

export const benchConfig = {
  isCiOrCodSpeed,
  /**
   * Rows of the generated data (~90 bytes each in json with native types):
   * ~100 kB payload in CI or CodSpeed, ~1 MB in local
   */
  rows: isCiOrCodSpeed ? 1100 : 11_000,
  benchOptions: {
    iterations: isCiOrCodSpeed ? 2 : 10,
    time: isCiOrCodSpeed ? 300 : 800, // 300ms in CI or CodeSpeed, 800ms in local
    warmupIterations: 1,
  } as const satisfies BenchRunOptions,
} as const;
