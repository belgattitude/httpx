import { describe, test } from "vitest";

import { MIntl } from "../src";
import { benchConfig } from "./bench.config";

const nbRows = benchConfig.samples;
describe(`MIntl Locale benchmarks (${nbRows} instances)`, () => {
  const arr = Array.from({ length: nbRows }).map((_v, idx) => {
    return {
      idx,
    };
  });

  test("memoized vs not memoized", async ({ bench }) => {
    await bench.compare(
      bench("With memoization `MIntl.Locale()`", () => {
        for (const _row of arr) {
          const locale = MIntl.Locale("fr-FR", {
            caseFirst: "lower",
          });
          const _language = locale.language;
        }
      }),
      bench("Without memoization `new Intl.Locale()`", () => {
        for (const _row of arr) {
          const locale = new Intl.Locale("fr-FR", {
            caseFirst: "lower",
          });
          const _language = locale.language;
        }
      }),
      benchConfig.benchOptions
    );
  });
});
