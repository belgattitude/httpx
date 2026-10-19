import { vitestBenchOptionsConfig } from "@httpx/devtools-vitest";
import type { BenchRunOptions } from "vitest";

const isCiOrCodSpeed =
  vitestBenchOptionsConfig.isCiOrCodSpeed ||
  ["true", "1"].includes(process.env?.CI ?? "false");

export const benchConfig = {
  isCiOrCodSpeed,
  /**
   * Rows of the generated data (~90 bytes each in json with native types):
   * ~44 kB payload in CI or CodSpeed, ~1 MB in local.
   * 500 rows is the minimum for the payload to be compressed by every
   * serializer with the CacheCompress defaults (minimumStringLength 16K,
   * minimumByteSaving 32 KB).
   */
  rows: isCiOrCodSpeed ? 500 : 11_000,
  /**
   * Simulated latency of the cached async function (only paid on cache
   * miss and by the "original function" bench).
   */
  fetchWaitMs: isCiOrCodSpeed ? 10 : 400,
  benchOptions: {
    iterations: isCiOrCodSpeed ? 2 : 10,
    time: isCiOrCodSpeed ? 100 : 800, // 100ms in CI or CodSpeed, 800ms in local
    warmupIterations: 1,
  } as const satisfies BenchRunOptions,
} as const;
