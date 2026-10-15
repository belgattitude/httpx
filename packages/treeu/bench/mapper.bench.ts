import { describe, test } from "vitest";

import { FlatTreeWsMapper } from "../src";
import { benchConfig } from "./bench-config";
import { getBenchFlatTreeWsData } from "./treeu-bench-data";

describe(`Bench mapper (10_000 entries)`, () => {
  const pathNames = getBenchFlatTreeWsData();
  test("FlatTreeWsMapper", async ({ bench }) => {
    await bench("FlatTreeWsMapper.toTreeNodesOrThrow", () => {
      new FlatTreeWsMapper().toTreeNodesOrThrow(pathNames, {
        separator: "/",
      });
    }).run(benchConfig.benchOptions);
  });
});
