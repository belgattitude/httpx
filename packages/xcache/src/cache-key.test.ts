import { createStableKeyOrThrow } from "@httpx/stable-hash";

import { type CacheKeyTuple, genCacheKeyString } from "./cache-key";

describe("genCacheKeyString", () => {
  it("should generate a stable cache key string", () => {
    const key: CacheKeyTuple = ["/api/user", { id: 1 }];
    const result = genCacheKeyString({ key });
    expect(result).toBeTypeOf("string");
    expect(result).toBe('{"key":["/api/user",{"id":1}]}');
  });

  it("should include namespace in the cache key string", () => {
    const key: CacheKeyTuple = ["/api/user", { id: 2 }];
    const namespace = "test";
    const result = genCacheKeyString({ key, namespace });
    expect(result).toBe('{"key":["/api/user",{"id":2}],"ns":"test"}');
  });

  it("should throw TypeError for invalid key", () => {
    // @ts-expect-error: invalid key type
    expect(() => genCacheKeyString({ key: null })).toThrow(TypeError);
  });

  it("should throw TypeError for invalid key, empty string", () => {
    expect(() => genCacheKeyString({ key: [""] })).toThrow(TypeError);
  });
});

describe("genCacheKeyString equivalence with createStableKeyOrThrow", () => {
  it.each([
    [["/api/user"]],
    [["/api/user", 1, true, null, "a"]],
    [["/api/user", { b: 2, a: [3, 1, 2], d: new Date(0), n: 10n }]],
    [["/api/user", [3, 1, 2], undefined]],
  ] satisfies [CacheKeyTuple][])("should match for case %#", (key) => {
    for (const namespace of [undefined, "", "ns-1"]) {
      for (const compressorId of [undefined, "", "cache-compress:devalue"]) {
        expect(genCacheKeyString({ key, namespace, compressorId })).toBe(
          createStableKeyOrThrow(
            {
              ...(namespace ? { ns: namespace } : {}),
              ...(compressorId ? { compressorId } : {}),
              key,
            },
            { sortArrayValues: false }
          )
        );
      }
    }
  });
});
