import { createVitestConfig } from "@httpx/devtools-vitest";
import { mergeConfig } from "vitest/config";

export default mergeConfig(createVitestConfig(), {
  test: {
    benchmark: {
      // The benches run the sources: the eviction one creates a node per set
      // (DoublyLinkedNode import, a vite module runner getter)
      // @link https://vitest.dev/guide/benchmarking#module-runner-overhead
      suppressExportGetterWarnings: true,
    },
  },
});
