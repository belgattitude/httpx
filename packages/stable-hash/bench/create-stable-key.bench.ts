import { describe, test } from "vitest";

import { createStableKeyOrThrow } from "../src";
import { benchConfig } from "./bench-config";

describe(`createStableKeyOrThrow`, () => {
  const params = {
    key8: true,
    key7: "string",
    strArr: Array.from({ length: 10 }, (_, i) => i.toString()).toReversed(),
    plainObject: {
      key1: "string",
    },
  };
  test("with and without array sorting", async ({ bench }) => {
    await bench.compare(
      bench("createStableKeyOrThrow with array sorting", () => {
        createStableKeyOrThrow(params);
      }),
      bench("createStableKeyOrThrow without array sorting", () => {
        createStableKeyOrThrow(params, {
          sortArrayValues: false,
        });
      }),
      benchConfig.benchOptions
    );
  });
});
