import { expect, onTestFinished, vi } from "vitest";

import { CacheCompress } from "../compress/cache-compress";
import { JsonSerializer } from "../serializer/json-serializer";
import {
  XMemCache,
  type XMemCacheLruOptions,
  type XMemCacheOptions,
} from "../x-mem-cache";

type User = { id: number; orgId: number };

const createCache = (options: Partial<XMemCacheOptions> = {}) =>
  new XMemCache({ lru: { maxSize: 50, defaultTTL: 10_000 }, ...options });

const getUser = (id: number): Promise<User> =>
  Promise.resolve({ id, orgId: 10 });

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

describe("XMemCache tags", () => {
  it("should remove the entries having one of the tags", async () => {
    const cache = createCache();
    const user1 = await cache.runAsync({
      key: ["/user", 1],
      fn: () => getUser(1),
      tags: ["users", "user:1"],
    });
    await cache.runAsync({
      key: ["/user", 2],
      fn: () => getUser(2),
      tags: ["users", "user:2"],
    });
    await cache.runAsync({ key: ["/other"], fn: () => getUser(3) });
    expect(user1.meta.tags).toStrictEqual(["users", "user:1"]);
    expect(cache.getEntryInfo({ key: ["/user", 1] })?.tags).toStrictEqual([
      "users",
      "user:1",
    ]);

    expect(cache.invalidateTags("user:1")).toBe(1);
    expect(cache.getEntryInfo({ key: ["/user", 1] })).toBeUndefined();
    expect(cache.getEntryInfo({ key: ["/user", 2] })).toBeDefined();
    expect(cache.size).toBe(2);

    // entries matching several tags are counted once
    await cache.runAsync({
      key: ["/user", 1],
      fn: () => getUser(1),
      tags: ["users", "user:1"],
    });
    expect(cache.invalidateTags(["users", "user:1", "unknown"])).toBe(2);
    expect(cache.size).toBe(1);
    expect(cache.getStats().totals.invalidated).toBe(3);

    const fn = vi.fn<() => Promise<User>>(() => getUser(1));
    const rerun = await cache.runAsync({ key: ["/user", 1], fn, tags: [] });
    expect(rerun.meta.cached).toBe(false);
    expect(rerun.meta).not.toHaveProperty("tags");
    expect(fn).toHaveBeenCalledOnce();
  });

  it("should ignore unknown, empty and duplicated tags", async () => {
    const cache = createCache();
    const { meta } = await cache.runAsync({
      key: ["/a"],
      fn: () => getUser(1),
      tags: ["a", "", "a", "b"],
    });
    expect(meta.tags).toStrictEqual(["a", "b"]);
    expect(cache.invalidateTags([])).toBe(0);
    expect(cache.invalidateTags("")).toBe(0);
    expect(cache.invalidateTags("unknown")).toBe(0);
    expect(cache.invalidateTags(["a", "b"])).toBe(1);
  });

  it("should accept tags computed from the result", async () => {
    const cache = createCache();
    const { meta } = await cache.runAsync({
      key: ["/user", 1],
      fn: () => getUser(1),
      tags: (user) => [`org:${user.orgId}`],
    });
    expect(meta.tags).toStrictEqual(["org:10"]);
    expect(cache.invalidateTags("org:10")).toBe(1);
  });

  it("should work with compressed entries and runAsyncEntry", async () => {
    const cache = createCache({
      compressor: new CacheCompress({
        algorithm: "gzip",
        serializer: new JsonSerializer(),
        minimumByteSaving: 0,
        minimumStringLength: 0,
        minimumRatio: 0,
      }),
    });
    const { entry } = await cache.runAsyncEntry({
      key: ["/big"],
      fn: () => Promise.resolve("x".repeat(1000)),
      tags: ["big"],
    });
    expect(entry.format).toBe("compressed");
    expect(entry.tags).toStrictEqual(["big"]);
    expect(cache.invalidateTags("big")).toBe(1);
    expect(cache.size).toBe(0);
  });

  it("should not index bypassed calls", async () => {
    const cache = createCache({ enabled: false });
    const { meta } = await cache.runAsync({
      key: ["/a"],
      fn: () => getUser(1),
      tags: ["a"],
    });
    expect(meta.bypassed).toBe(true);
    expect(meta.tags).toStrictEqual(["a"]);
    expect(cache.invalidateTags("a")).toBe(0);
  });

  describe("index", () => {
    it("should be cleaned when the lru evicts an entry (capacity)", async () => {
      const onEviction =
        vi.fn<NonNullable<XMemCacheLruOptions["onEviction"]>>();
      const cache = new XMemCache({
        lru: { maxSize: 1, defaultTTL: 10_000, onEviction },
      });
      const first = await cache.runAsync({
        key: ["/a"],
        fn: () => getUser(1),
        tags: ["a"],
      });
      await cache.runAsync({ key: ["/b"], fn: () => getUser(2) });
      expect(onEviction).toHaveBeenCalledExactlyOnceWith(
        first.meta.generatedKey,
        expect.objectContaining({ tags: ["a"] })
      );
      expect(cache.invalidateTags("a")).toBe(0);
      expect(cache.size).toBe(1);
    });

    it("should be cleaned when an expired entry is accessed or cleared", async () => {
      vi.useFakeTimers({ toFake: ["Date"] });
      vi.setSystemTime(0);
      onTestFinished(() => {
        vi.useRealTimers();
      });
      const onEviction =
        vi.fn<NonNullable<XMemCacheLruOptions["onEviction"]>>();
      const cache = new XMemCache({
        lru: { maxSize: 10, defaultTTL: 10_000, onEviction },
      });
      const fn = () => getUser(1);
      await cache.runAsync({ key: ["/a"], fn, tags: ["t"], ttl: 1 });
      await cache.runAsync({ key: ["/b"], fn, tags: ["t"], ttl: 1 });
      vi.setSystemTime(5);
      // expired entry found by the lru (onEviction)
      const rerun = await cache.runAsync({ key: ["/a"], fn });
      expect(rerun.meta.cached).toBe(false);
      expect(onEviction).toHaveBeenCalledOnce();
      // removed by clearExpired (no onEviction)
      expect(cache.clearExpired()).toBe(1);
      expect(onEviction).toHaveBeenCalledOnce();
      expect(cache.invalidateTags("t")).toBe(0);
      expect(cache.size).toBe(1);
    });

    it("should be updated when an entry is replaced", async () => {
      const cache = createCache();
      await cache.runAsync({ key: ["/a"], fn: () => getUser(1), tags: ["v1"] });
      await cache.runAsync({
        key: ["/a"],
        fn: () => getUser(1),
        tags: ["v2"],
        forceRevalidate: true,
      });
      expect(cache.invalidateTags("v1")).toBe(0);
      expect(cache.invalidateTags("v2")).toBe(1);

      await cache.runAsync({ key: ["/a"], fn: () => getUser(1), tags: ["v3"] });
      await cache.runAsync({
        key: ["/a"],
        fn: () => getUser(1),
        forceRevalidate: true,
      });
      expect(cache.invalidateTags("v3")).toBe(0);
      expect(cache.size).toBe(1);
    });

    it("should be cleared with the cache", async () => {
      const cache = createCache();
      await cache.runAsync({ key: ["/a"], fn: () => getUser(1), tags: ["a"] });
      expect(cache.clear()).toBe(1);
      expect(cache.invalidateTags("a")).toBe(0);
    });
  });

  describe("in-flight executions", () => {
    it("should not store a result whose tag was invalidated during the execution", async () => {
      const cache = createCache();
      const { fn, release } = createDeferredFn({ id: 1 });
      const call = cache.runAsync({ key: ["/a"], fn, tags: ["a"] });
      // nothing stored yet
      expect(cache.invalidateTags("a")).toBe(0);
      release();
      const { data, meta } = await call;
      expect(data).toStrictEqual({ id: 1 });
      expect(meta.cached).toBe(false);
      expect(cache.size).toBe(0);
    });

    it("should check the tags computed from the result", async () => {
      const cache = createCache();
      const { fn, release } = createDeferredFn({ id: 1, orgId: 10 });
      const call = cache.runAsync({
        key: ["/a"],
        fn,
        tags: (user) => [`org:${user.orgId}`],
      });
      cache.invalidateTags("org:10");
      release();
      await call;
      expect(cache.size).toBe(0);
    });

    it("should store results when other tags are invalidated", async () => {
      const cache = createCache();
      const { fn, release } = createDeferredFn({ id: 1 });
      const call = cache.runAsync({ key: ["/a"], fn, tags: ["a"] });
      const untagged = createDeferredFn({ id: 2 });
      const untaggedCall = cache.runAsync({ key: ["/b"], fn: untagged.fn });
      cache.invalidateTags("other");
      release();
      untagged.release();
      await Promise.all([call, untaggedCall]);
      expect(cache.size).toBe(2);
    });

    it("should not let new calls join an invalidated execution (dedupe)", async () => {
      const cache = createCache();
      const first = createDeferredFn({ id: 1 });
      const call1 = cache.runAsync({ key: ["/a"], fn: first.fn, tags: ["a"] });
      // joins the in-flight execution
      const call2 = cache.runAsync({ key: ["/a"], fn: first.fn, tags: ["a"] });
      cache.invalidateTags("a");
      const second = createDeferredFn({ id: 2 });
      const call3 = cache.runAsync({ key: ["/a"], fn: second.fn, tags: ["a"] });
      first.release();
      second.release();
      const [r1, r2, r3] = await Promise.all([call1, call2, call3]);
      expect(first.fn).toHaveBeenCalledOnce();
      expect(second.fn).toHaveBeenCalledOnce();
      expect(r1.data).toStrictEqual({ id: 1 });
      expect(r2.meta.deduped).toBe(true);
      expect(r3.data).toStrictEqual({ id: 2 });
      expect(r3.meta.deduped).toBeUndefined();
      // only the execution started after the invalidation is stored
      const hit = await cache.runAsync({ key: ["/a"], fn: first.fn });
      expect(hit.meta.cached).toBe(true);
      expect(hit.data).toStrictEqual({ id: 2 });
    });

    it("should detach executions with computed tags on any invalidation", async () => {
      const cache = createCache();
      const first = createDeferredFn({ id: 1 });
      const tags = () => ["a"];
      const call1 = cache.runAsync({ key: ["/a"], fn: first.fn, tags });
      cache.invalidateTags("unrelated");
      const second = createDeferredFn({ id: 2 });
      const call2 = cache.runAsync({ key: ["/a"], fn: second.fn, tags });
      first.release();
      second.release();
      await Promise.all([call1, call2]);
      expect(second.fn).toHaveBeenCalledOnce();
    });

    it("should keep joining executions without matching tags", async () => {
      const cache = createCache();
      const first = createDeferredFn({ id: 1 });
      const call1 = cache.runAsync({ key: ["/a"], fn: first.fn, tags: ["a"] });
      cache.invalidateTags("other");
      const call2 = cache.runAsync({ key: ["/a"], fn: first.fn, tags: ["a"] });
      first.release();
      const [, r2] = await Promise.all([call1, call2]);
      expect(r2.meta.deduped).toBe(true);
      expect(first.fn).toHaveBeenCalledOnce();
    });
  });
});
