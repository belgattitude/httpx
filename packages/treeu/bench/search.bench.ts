import { describe, test } from "vitest";

import { FlatTreeWsMapper } from "../src";
import { DfsTreeSearch } from "../src/search/dfs-tree-search";
import { benchConfig } from "./bench-config";
import { getBenchFlatTreeWsData } from "./treeu-bench-data";

describe(`Bench search (10_000 entries)`, () => {
  const wsData = getBenchFlatTreeWsData();

  const arrData = [...wsData].map(([key, value]) => {
    return {
      key,
      value,
    };
  });
  const ranges = {
    first: 0,
    "1/4": Math.floor(arrData.length / 4),
    "1/2": Math.floor(arrData.length / 2),
    "3/4": Math.floor((arrData.length / 4) * 3),
    last: arrData.length - 1,
  };
  const result = new FlatTreeWsMapper().toTreeNodes(wsData, {
    separator: "/",
  });
  if (!result.success) {
    console.log(result.issues);
    throw new Error(`Please fix the benchmarks: ${JSON.stringify(result)}`);
  }
  const { treeNodes } = result;

  const search = new DfsTreeSearch(treeNodes);
  const keyAt = (idx: number) => {
    const item = arrData[idx];
    if (item === undefined) {
      throw new Error(`Bench data has no entry at index ${idx}`);
    }
    return item.key;
  };
  const keys = {
    first: keyAt(ranges.first),
    "1/2": keyAt(ranges["1/2"]),
    "3/4": keyAt(ranges["3/4"]),
  };
  test(`DfsTreeSearch.findOne over ${arrData.length}`, async ({ bench }) => {
    await bench.compare(
      bench(`DfsTreeSearch.findOne(id_${ranges.first}) over ${arrData.length}`, () => {
        search.findOne(keys.first);
      }),
      bench(`DfsTreeSearch.findOne(id_${ranges["1/2"]}) over ${arrData.length}`, () => {
        search.findOne(keys["1/2"]);
      }),
      bench(`DfsTreeSearch.findOne(id_${ranges["3/4"]}) over ${arrData.length}`, () => {
        search.findOne(keys["3/4"]);
      }),
      bench(`DfsTreeSearch.findOne(id_NotExists) over ${arrData.length}`, () => {
        search.findOne("not-exists");
      }),
      benchConfig.benchOptions
    );
  });
});
