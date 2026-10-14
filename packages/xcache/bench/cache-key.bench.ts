import { bench } from "vitest";

import { genCacheKeyString } from "../src/cache-key";
import { benchConfig } from "./bench-config";

const options = benchConfig.benchOptions;

describe(`genCacheKey benches`, () => {
  const params = {
    date: new Date(),
    bigint: 10n,
    string: "test-string",
    number: 42,
    boolean: true,
  };

  bench(
    "original function",
    () => {
      const _keyStr = genCacheKeyString({
        key: ["test", params],
        namespace: "test-namespace",
      });
    },
    options
  );
});
