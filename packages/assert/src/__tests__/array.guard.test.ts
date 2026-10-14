import { describe, expect, it } from "vitest";

import { isArrayNonEmpty } from "../array.guards";

describe("Array typeguards tests", () => {
  describe("isArrayNotEmpty", () => {
    it.each([
      [false, []],
      [false, [...[]]],
      [false, new Date()],
      [true, [...["cool"]]],
      [true, ["cool"]],
    ])("should return %s when %s is given", (expected, v) => {
      expect(isArrayNonEmpty(v)).toBe(expected);
    });
  });
});
