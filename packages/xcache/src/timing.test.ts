import { onTestFinished, vi } from "vitest";

import { elapsedSince, now, roundMs } from "./timing";

const maxTwoDecimals = /^\d+(\.\d{1,2})?$/;

describe("timing", () => {
  it.each([
    [1.23456, 1.23],
    [1.235, 1.24],
    [0.004, 0],
    [0.1 + 0.2, 0.3],
    [152, 152],
  ])("roundMs(%s) should return %s", (ms, expected) => {
    expect(roundMs(ms)).toBe(expected);
  });

  it("should return elapsed times with max 2 decimals", () => {
    vi.useFakeTimers({ toFake: ["performance"] });
    onTestFinished(() => {
      vi.useRealTimers();
    });
    for (const advance of [0.001, 0.1234, 1.005, 12.3456, 999.999]) {
      const start = now();
      vi.advanceTimersByTime(advance);
      const elapsed = elapsedSince(start);
      expect(String(elapsed)).toMatch(maxTwoDecimals);
      expect(elapsed).toBeCloseTo(advance, 1);
    }
  });
});
