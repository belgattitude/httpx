import { describe, test } from "vitest";

import { createStableHashOrThrow } from "../src/create-stable-hash-or-throw";
import { benchConfig } from "./bench-config";

describe(`createStableHashOrThrow`, () => {
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
      bench("createStableHashOrThrow with array sorting", async () => {
        await createStableHashOrThrow(params);
      }),
      bench("createStableHashOrThrow without array sorting", async () => {
        await createStableHashOrThrow(params, {
          sortArrayValues: false,
        });
      }),
      benchConfig.benchOptions
    );
  });
});
