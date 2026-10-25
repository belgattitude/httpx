import {
  createCompressedEntry,
  createNativeEntry,
  isXMemCacheEntry,
} from "./x-mem-cache-entry";

describe("isXMemCacheEntry", () => {
  const meta = {
    algorithm: "gzip",
    encoding: "binary",
    serializer: "json",
    originalSize: 10,
    compressedSize: 5,
    ratio: 2,
  } as const;

  it.each([
    ["native", createNativeEntry({ id: 1 }, 1)],
    ["native with undefined data", createNativeEntry(undefined, 1)],
    ["native skipped", createNativeEntry("data", 1, "trivial_value")],
    [
      "compressed binary",
      createCompressedEntry(new Uint8Array([1, 2]), meta, 1),
    ],
    ["compressed base64", createCompressedEntry("H4sI", meta, 1)],
  ])("should return true for %s entries", (_label, entry) => {
    expect(isXMemCacheEntry(entry)).toBe(true);
  });

  it.each([
    ["null", null],
    ["undefined", undefined],
    ["string", "native"],
    ["number", 1],
    ["array", ["native"]],
    ["lookalike native", { format: "native", data: { id: 1 } }],
    ["lookalike compressed", { format: "compressed", data: "H4sI", meta }],
    [
      "branded with invalid format",
      { ...createNativeEntry(1, 1), format: "other" },
    ],
    [
      "branded compressed with invalid data",
      { ...createCompressedEntry("H4sI", meta, 1), data: 1 },
    ],
    [
      "branded compressed without meta",
      { ...createCompressedEntry("H4sI", meta, 1), meta: null },
    ],
  ])("should return false for %s", (_label, value) => {
    expect(isXMemCacheEntry(value)).toBe(false);
  });
});
