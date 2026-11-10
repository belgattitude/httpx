import { describe, test } from "vitest";

import { createMIntl } from "../src";
import { benchConfig } from "./bench.config";

const intl = createMIntl();
const nbRows = benchConfig.samples;
describe(`createMIntl DateFormatter benchmarks (${nbRows} instances)`, () => {
  const dates = Array.from({ length: nbRows }).map((_v, idx) => {
    return {
      date: 10_000 + idx,
    };
  });

  test("memoized vs not memoized", async ({ bench }) => {
    await bench.compare(
      bench("With memoization `intl.DateFormatter()`", () => {
        for (const row of dates) {
          const formatter = intl.DateTimeFormat("fr-FR", {
            dateStyle: "full",
            timeStyle: "full",
            timeZone: "UTC",
          });
          formatter.format(new Date(row.date));
        }
      }),
      bench("Without memoization `new Intl.DateFormatter()`", () => {
        for (const row of dates) {
          const formatter = new Intl.DateTimeFormat("fr-FR", {
            dateStyle: "full",
            timeStyle: "full",
            timeZone: "UTC",
          });
          formatter.format(new Date(row.date));
        }
      }),
      benchConfig.benchOptions
    );
  });
});
