import {
  acceptsEncoding,
  buildCacheControl,
  createWeakEtag,
  fnv1a32,
  matchesIfNoneMatch,
} from "./http-utils";

describe("acceptsEncoding", () => {
  it.each([
    ["gzip, deflate, br", "gzip", true],
    ["deflate, gzip;q=1.0, *;q=0.5", "gzip", true],
    ["GZIP", "gzip", true],
    ["br", "gzip", false],
    ["gzip;q=0", "gzip", false],
    ["gzip;q=0.0, deflate", "gzip", false],
    ["*", "gzip", true],
    ["*;q=0", "gzip", false],
    ["*;q=0.5, gzip;q=0", "gzip", false],
    ["identity", "deflate", false],
    ["", "gzip", false],
    [undefined, "gzip", false],
  ])("acceptsEncoding(%j, %s) should be %s", (header, encoding, expected) => {
    expect(acceptsEncoding(header, encoding)).toBe(expected);
  });
});

describe("matchesIfNoneMatch", () => {
  const etag = 'W/"abc-123"';

  it.each([
    ['W/"abc-123"', true],
    ['"abc-123"', true],
    ['"other", W/"abc-123"', true],
    ["*", true],
    ['"other"', false],
    ["", false],
    [undefined, false],
  ])("matchesIfNoneMatch(%j) should be %s", (header, expected) => {
    expect(matchesIfNoneMatch(header, etag)).toBe(expected);
  });
});

describe("createWeakEtag", () => {
  it("should create a weak etag from the key and creation time", () => {
    const etag = createWeakEtag("key", 1000);
    expect(etag).toMatch(/^W\/"[0-9a-z]+-rs"$/);
    expect(createWeakEtag("key", 1000)).toBe(etag);
    expect(createWeakEtag("key", 1001)).not.toBe(etag);
    expect(createWeakEtag("other", 1000)).not.toBe(etag);
  });

  it("fnv1a32 should return a stable unsigned 32-bit hash", () => {
    expect(fnv1a32("")).toBe(0x81_1c_9d_c5);
    expect(fnv1a32("a")).toBe(0xe4_0c_29_2c);
  });
});

describe("buildCacheControl", () => {
  it.each([
    [undefined, 5000, undefined],
    [false, 5000, undefined],
    ["", 5000, undefined],
    ["public, max-age=60", 5000, "public, max-age=60"],
    [{ maxAge: 60 }, 5000, "private, max-age=60"],
    [{ maxAge: 60, scope: "public" }, undefined, "public, max-age=60"],
    [{ maxAge: "ttl" }, 59_999, "private, max-age=59"],
    [{ maxAge: "ttl" }, 500, "private, max-age=0"],
    [{ maxAge: "ttl" }, undefined, undefined],
    [
      { maxAge: "ttl", scope: "public", staleWhileRevalidate: 30 },
      120_000,
      "public, max-age=120, stale-while-revalidate=30",
    ],
    [{ maxAge: -1 }, undefined, "private, max-age=0"],
  ] satisfies [
    Parameters<typeof buildCacheControl>[0],
    number | undefined,
    string | undefined,
  ][])(
    "buildCacheControl(%j, %s) should be %j",
    (option, expiresIn, expected) => {
      expect(buildCacheControl(option, expiresIn)).toBe(expected);
    }
  );
});
