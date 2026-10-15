import { hashKey } from "@tanstack/query-core";
import hash from "stable-hash";
import { hash as stableHashX } from "stable-hash-x";
import { describe, test } from "vitest";

import { createStableKeyOrThrow } from "../src";
import { benchConfig } from "./bench-config";

describe(`Comparison`, () => {
  const params = {
    key8: true,
    key7: "string",
    strArr: Array.from({ length: 10 }, (_, i) => i.toString()).toReversed(),
    plainObject: {
      key1: "string",
    },
  };
  test("stable hash libraries", async ({ bench }) => {
    await bench.compare(
      bench("@httpx/stable-hash", () => {
        createStableKeyOrThrow(params, {
          sortArrayValues: false,
        });
      }),
      bench("stable-hash", () => {
        hash(params);
      }),
      bench("stable-hash-x", () => {
        stableHashX(params);
      }),
      bench("@tanstack/query-core (hashKey)", () => {
        hashKey([params]);
      }),
      benchConfig.benchOptions
    );
  });
});
