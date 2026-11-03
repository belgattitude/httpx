import { expect, onTestFinished, vi } from "vitest";

import { type CacheKeyTuple, genCacheKeyString } from "../cache-key";
import { XMemCache, type XMemCacheOptions } from "../x-mem-cache";

const createCache = (options: Partial<XMemCacheOptions> = {}) =>
  new XMemCache({ lru: { maxSize: 50, defaultTTL: 10_000 }, ...options });

/**
 * Generated key of an entry created with the default namespace (to delete
 * entries before they're stored).
 */
const genKey = (key: CacheKeyTuple) =>
  genCacheKeyString({ key, namespace: "default" });

/**
 * Function resolving when release() is called, to control executions.
 */
const createDeferredFn = <T>(value: T) => {
  let release: () => void = () => {};
  const fn = vi.fn<() => Promise<T>>(
    () =>
      // oxlint-disable-next-line promise/avoid-new
      new Promise<T>((resolve) => {
        release = () => resolve(value);
      })
  );
  return { fn, release: () => release() };
};

describe("XMemCache delete", () => {
  it("should remove a single entry by generated key", async () => {
    const cache = createCache();
    const { meta } = await cache.runAsync({
      key: ["/user", 1],
      fn: () => Promise.resolve(1),
    });
    await cache.runAsync({ key: ["/user", 2], fn: () => Promise.resolve(2) });

    expect(cache.delete(meta.generatedKey)).toBe(1);
    expect(cache.getEntryInfo({ key: ["/user", 1] })).toBeUndefined();
    expect(cache.getEntryInfo({ key: ["/user", 2] })).toBeDefined();
    expect(cache.size).toBe(1);
    // already removed
    expect(cache.delete(meta.generatedKey)).toBe(0);
    expect(cache.delete(genKey(["/unknown"]))).toBe(0);

    const fn = vi.fn<() => Promise<number>>(() => Promise.resolve(1));
    const rerun = await cache.runAsync({ key: ["/user", 1], fn });
    expect(rerun.meta.cached).toBe(false);
    expect(fn).toHaveBeenCalledOnce();
  });

  it("should remove several entries", async () => {
    const cache = createCache();
    const fn = () => Promise.resolve(1);
    const r1 = await cache.runAsync({ key: ["/user", 1], fn });
    const r2 = await cache.runAsync({ key: ["/user", 2], fn });
    const r3 = await cache.runAsync({
      key: ["/user", 3],
      namespace: "admin",
      fn,
    });
    await cache.runAsync({ key: ["/other"], fn });
    expect(
      cache.delete([
        r1.meta.generatedKey,
        r2.meta.generatedKey,
        // duplicates are counted once
        r1.meta.generatedKey,
        r3.meta.generatedKey,
        genKey(["/unknown"]),
      ])
    ).toBe(3);
    expect(cache.size).toBe(1);
    expect(cache.getEntryInfo({ key: ["/other"] })).toBeDefined();
    expect(cache.delete([])).toBe(0);
  });

  it("should accept the keys from entries, getStats and getEntryInfo", async () => {
    const cache = createCache();
    const fn = () => Promise.resolve(1);
    await cache.runAsync({ key: ["/a"], fn, tags: ["a"] });
    await cache.runAsync({ key: ["/b"], fn, origin: "custom" });
    await cache.runAsync({ key: ["/c"], fn });

    const [aKey] = [...cache.entries()].find(([, e]) => e.tags !== undefined)!;
    const bKey = cache.getEntryInfo({ key: ["/b"], origin: "custom" })!.key;
    const cKey = cache.getStats().entries.at(-1)!.key;
    expect(cache.delete([aKey, bKey, cKey])).toBe(3);
    expect(cache.size).toBe(0);
  });

  it("should remove the entry tags", async () => {
    const cache = createCache();
    const { meta } = await cache.runAsync({
      key: ["/a"],
      fn: () => Promise.resolve(1),
      tags: ["a", "shared"],
    });
    await cache.runAsync({
      key: ["/b"],
      fn: () => Promise.resolve(2),
      tags: ["shared"],
    });
    expect(cache.delete(meta.generatedKey)).toBe(1);
    expect(cache.getTags()).toStrictEqual([{ tag: "shared", items: 1 }]);
    expect(cache.invalidateTags("a")).toBe(0);
  });

  it("should not count expired entries", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    onTestFinished(() => {
      vi.useRealTimers();
    });
    const cache = createCache();
    const { meta } = await cache.runAsync({
      key: ["/a"],
      fn: () => Promise.resolve(1),
      ttl: 10,
    });
    vi.setSystemTime(Date.now() + 20);
    expect(cache.delete(meta.generatedKey)).toBe(0);
    expect(cache.size).toBe(0);
  });

  describe("in-flight executions", () => {
    it("should not store the result of an execution started before", async () => {
      const cache = createCache();
      const first = createDeferredFn(1);
      const call1 = cache.runAsync({ key: ["/a"], fn: first.fn });
      // joins the in-flight execution
      const call2 = cache.runAsync({ key: ["/a"], fn: first.fn });
      expect(cache.delete(genKey(["/a"]))).toBe(0);
      // doesn't join the (possibly stale) execution
      const second = createDeferredFn(2);
      const call3 = cache.runAsync({ key: ["/a"], fn: second.fn });
      first.release();
      second.release();
      const [r1, r2, r3] = await Promise.all([call1, call2, call3]);
      expect(r1.data).toBe(1);
      expect(r2.meta.deduped).toBe(true);
      expect(r3.data).toBe(2);
      expect(r3.meta.deduped).toBeUndefined();
      const hit = await cache.runAsync({ key: ["/a"], fn: first.fn });
      expect(hit.meta.cached).toBe(true);
      expect(hit.data).toBe(2);
    });

    it("should not store when no new call is made", async () => {
      const cache = createCache();
      const a = createDeferredFn(1);
      const b = createDeferredFn(2);
      const callA = cache.runAsync({ key: ["/a"], fn: a.fn });
      const callB = cache.runAsync({ key: ["/b"], fn: b.fn });
      cache.delete([genKey(["/a"])]);
      a.release();
      b.release();
      const [resultA] = await Promise.all([callA, callB]);
      expect(resultA.data).toBe(1);
      expect(cache.size).toBe(1);
      expect(cache.getEntryInfo({ key: ["/b"] })).toBeDefined();
    });

    it("should not store a revalidation of a deleted entry", async () => {
      const cache = createCache();
      const { meta } = await cache.runAsync({
        key: ["/a"],
        fn: () => Promise.resolve(1),
      });
      const { fn, release } = createDeferredFn(2);
      const call = cache.runAsync({ key: ["/a"], fn, forceRevalidate: true });
      expect(cache.delete(meta.generatedKey)).toBe(1);
      release();
      const result = await call;
      expect(result.data).toBe(2);
      expect(result.meta.cached).toBe(false);
      expect(cache.size).toBe(0);
    });
  });
});
