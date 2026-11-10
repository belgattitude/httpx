import { describe, test } from "vitest";

import { createMIntl } from "../src";
import { benchConfig } from "./bench.config";

const intl = createMIntl();
const nbRows = benchConfig.samples;

describe(`createMIntl RelativeTimeFormat benchmarks (${nbRows} instances)`, () => {
  const dates = Array.from({ length: nbRows }).map((_v, idx) => {
    return {
      idx,
    };
  });

  test("memoized vs not memoized", async ({ bench }) => {
    await bench.compare(
      bench("With memoization `intl.RelativeTimeFormat()`", () => {
        for (const row of dates) {
          const rtf = intl.RelativeTimeFormat("en", {
            localeMatcher: "best fit",
            numeric: "always",
            style: "long",
          });
          rtf.format(row.idx, "day");
        }
      }),
      bench("Without memoization `new Intl.RelativeTimeFormat()`", () => {
        for (const row of dates) {
          const rtf = new Intl.RelativeTimeFormat("en", {
            localeMatcher: "best fit",
            numeric: "always",
            style: "long",
          });
          rtf.format(row.idx, "day");
        }
      }),
      benchConfig.benchOptions
    );
  });
});
