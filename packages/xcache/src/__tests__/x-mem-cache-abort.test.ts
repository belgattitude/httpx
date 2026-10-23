import { TimeLruCache } from "@httpx/lru";
import { expect, vi } from "vitest";

import { CacheCompress } from "../compress/cache-compress";
import { JsonSerializer } from "../serializer/json-serializer";
import { XMemCache, type XMemCacheOptions } from "../x-mem-cache";

const payload = {
  rows: Array.from({ length: 500 }, (_, i) => {
    return { id: i, name: `Item ${i}` };
  }),
};

type FnParams = { key: unknown; signal?: AbortSignal };

/**
 * A function resolving when the test decides to, ignoring the signal.
 */
const createDeferredFn = () => {
  const { promise, resolve, reject } = Promise.withResolvers<typeof payload>();
  const fn = vi.fn<(params: FnParams) => Promise<typeof payload>>(
    () => promise
  );
  return {
    fn,
    resolve: (value: typeof payload = payload) => resolve(value),
    reject: (error: Error) => reject(error),
  };
};

/**
 * A function rejecting with the signal reason when aborted (ie: fetch).
 */
const createAbortableFn = () =>
  vi.fn<(params: FnParams) => Promise<typeof payload>>(
    ({ signal }) =>
      // oxlint-disable-next-line promise/avoid-new
      new Promise((resolve, reject) => {
        signal?.addEventListener(
          "abort",
          () => reject(signal.reason as Error),
          {
            once: true,
          }
        );
      })
  );

const createCache = (options: Omit<XMemCacheOptions, "lru"> = {}) => {
  const lru = new TimeLruCache({ maxSize: 50, defaultTTL: 10_000 });
  const cache = new XMemCache({ lru, ...options });
  return { cache, lru };
};

const isAbortError = (error: unknown) =>
  error instanceof DOMException && error.name === "AbortError";

describe("XMemCache abort signal", () => {
  describe("already aborted signal", () => {
    it("should reject without calling the function", async () => {
      const { cache } = createCache();
      const fn = vi.fn<() => Promise<typeof payload>>(() =>
        Promise.resolve(payload)
      );
      const signal = AbortSignal.abort();
      await expect(
        cache.runAsync({ key: ["/data"], fn, signal })
      ).rejects.toSatisfy(isAbortError);
      await expect(
        cache.runAsyncEntry({ key: ["/data"], fn, signal })
      ).rejects.toSatisfy(isAbortError);
      expect(fn).not.toHaveBeenCalled();
    });

    it("should reject on a cache hit", async () => {
      const { cache } = createCache();
      const fn = vi.fn<() => Promise<typeof payload>>(() =>
        Promise.resolve(payload)
      );
      await cache.runAsync({ key: ["/data"], fn });
      const reason = new Error("custom reason");
      await expect(
        cache.runAsync({
          key: ["/data"],
          fn,
          signal: AbortSignal.abort(reason),
        })
      ).rejects.toBe(reason);
      expect(fn).toHaveBeenCalledOnce();
    });
  });

  it("should pass the signal to the function", async () => {
    const { cache } = createCache({ dedupe: false });
    const fn = vi.fn<(params: FnParams) => Promise<typeof payload>>(() =>
      Promise.resolve(payload)
    );
    const ac = new AbortController();
    await cache.runAsync({ key: ["/data"], fn, signal: ac.signal });
    expect(fn).toHaveBeenCalledWith({ key: ["/data"], signal: ac.signal });
  });

  it("should not pass a signal when none is provided", async () => {
    const { cache } = createCache();
    const fn = vi.fn<(params: FnParams) => Promise<typeof payload>>(() =>
      Promise.resolve(payload)
    );
    await cache.runAsync({ key: ["/data"], fn });
    expect(fn).toHaveBeenCalledWith({ key: ["/data"] });
  });

  describe.each([
    { name: "without dedupe", dedupe: false },
    { name: "with dedupe", dedupe: true },
  ])("$name", ({ dedupe }) => {
    it("should reject as soon as aborted, even if the function ignores the signal", async () => {
      const { cache, lru } = createCache({ dedupe });
      const { fn, resolve } = createDeferredFn();
      const ac = new AbortController();
      const call = cache.runAsync({ key: ["/data"], fn, signal: ac.signal });
      ac.abort();
      await expect(call).rejects.toSatisfy(isAbortError);
      // the function settles later: the result is not stored
      resolve();
      await vi.waitFor(() => expect(fn).toHaveBeenCalledOnce());
      await Promise.resolve();
      expect(lru.size).toBe(0);
    });

    it("should abort the function signal", async () => {
      const { cache, lru } = createCache({ dedupe });
      const fn = createAbortableFn();
      const ac = new AbortController();
      const call = cache.runAsync({ key: ["/data"], fn, signal: ac.signal });
      const reason = new Error("timeout");
      ac.abort(reason);
      await expect(call).rejects.toBe(reason);
      const fnSignal = fn.mock.calls[0]?.[0].signal;
      expect(fnSignal?.aborted).toBe(true);
      expect(fnSignal?.reason).toBe(reason);
      expect(lru.size).toBe(0);
    });

    it("should not store a fallback value returned after an abort", async () => {
      const { cache, lru } = createCache({ dedupe });
      const fallback = { rows: [] };
      const fn = vi.fn<(params: FnParams) => Promise<typeof payload>>(
        ({ signal }) =>
          // oxlint-disable-next-line promise/avoid-new
          new Promise((resolve) => {
            signal?.addEventListener("abort", () => resolve(fallback), {
              once: true,
            });
          })
      );
      const ac = new AbortController();
      const call = cache.runAsync({ key: ["/data"], fn, signal: ac.signal });
      ac.abort();
      await expect(call).rejects.toSatisfy(isAbortError);
      await Promise.resolve();
      expect(lru.size).toBe(0);
      const next = vi.fn<() => Promise<typeof payload>>(() =>
        Promise.resolve(payload)
      );
      const { data, meta } = await cache.runAsync({ key: ["/data"], fn: next });
      expect(data).toBe(payload);
      expect(meta.cached).toBe(false);
      expect(next).toHaveBeenCalledOnce();
    });

    it("should not abort when the function settles first", async () => {
      const { cache, lru } = createCache({ dedupe });
      const fn = vi.fn<(params: FnParams) => Promise<typeof payload>>(() =>
        Promise.resolve(payload)
      );
      const ac = new AbortController();
      const { data } = await cache.runAsync({
        key: ["/data"],
        fn,
        signal: ac.signal,
      });
      ac.abort();
      expect(data).toBe(payload);
      expect(lru.size).toBe(1);
    });

    it("should propagate function errors", async () => {
      const { cache } = createCache({ dedupe });
      const { fn, reject } = createDeferredFn();
      const ac = new AbortController();
      const call = cache.runAsync({ key: ["/data"], fn, signal: ac.signal });
      const error = new Error("fetch failed");
      reject(error);
      await expect(call).rejects.toBe(error);
    });

    it("should remove the abort listener once settled", async () => {
      const { cache } = createCache({ dedupe });
      const ac = new AbortController();
      const add = vi.spyOn(ac.signal, "addEventListener");
      const remove = vi.spyOn(ac.signal, "removeEventListener");
      await cache.runAsync({
        key: ["/data"],
        fn: () => Promise.resolve(payload),
        signal: ac.signal,
      });
      await expect(
        cache.runAsync({
          key: ["/error"],
          fn: () => Promise.reject(new Error("failed")),
          signal: ac.signal,
        })
      ).rejects.toThrow("failed");
      expect(add).toHaveBeenCalledTimes(2);
      expect(remove).toHaveBeenCalledTimes(2);
      expect(remove.mock.calls.map(([, listener]) => listener)).toStrictEqual(
        add.mock.calls.map(([, listener]) => listener)
      );
    });
  });

  describe("with dedupe", () => {
    it("should only reject the aborted caller", async () => {
      const { cache, lru } = createCache();
      const fn = vi.fn<(params: FnParams) => Promise<typeof payload>>(
        async ({ signal }) => {
          await Promise.resolve();
          signal?.throwIfAborted();
          return payload;
        }
      );
      const ac1 = new AbortController();
      const ac2 = new AbortController();
      const first = cache.runAsync({ key: ["/data"], fn, signal: ac1.signal });
      const second = cache.runAsync({ key: ["/data"], fn, signal: ac2.signal });
      ac1.abort();
      await expect(first).rejects.toSatisfy(isAbortError);
      const { data, meta } = await second;
      expect(data).toBe(payload);
      expect(meta.deduped).toBe(true);
      expect(fn).toHaveBeenCalledOnce();
      expect(fn.mock.calls[0]?.[0].signal?.aborted).toBe(false);
      expect(lru.size).toBe(1);
    });

    it("should abort the execution when all the callers are aborted", async () => {
      const { cache, lru } = createCache();
      const fn = createAbortableFn();
      const ac1 = new AbortController();
      const ac2 = new AbortController();
      const first = cache.runAsync({ key: ["/data"], fn, signal: ac1.signal });
      const second = cache.runAsync({ key: ["/data"], fn, signal: ac2.signal });
      const fnSignal = fn.mock.calls[0]?.[0].signal;
      ac1.abort();
      expect(fnSignal?.aborted).toBe(false);
      const reason = new Error("last reason");
      ac2.abort(reason);
      expect(fnSignal?.aborted).toBe(true);
      expect(fnSignal?.reason).toBe(reason);
      await expect(first).rejects.toSatisfy(isAbortError);
      await expect(second).rejects.toBe(reason);
      expect(lru.size).toBe(0);
    });

    it("should start a new execution after an aborted one", async () => {
      const { cache } = createCache();
      const { fn: aborted } = createDeferredFn();
      const ac = new AbortController();
      const call = cache.runAsync({
        key: ["/data"],
        fn: aborted,
        signal: ac.signal,
      });
      ac.abort();
      await expect(call).rejects.toSatisfy(isAbortError);
      // the aborted execution is still pending, but can't be joined
      const fn = vi.fn<() => Promise<typeof payload>>(() =>
        Promise.resolve(payload)
      );
      const { data, meta } = await cache.runAsync({ key: ["/data"], fn });
      expect(data).toBe(payload);
      expect(meta.deduped).toBeUndefined();
      expect(fn).toHaveBeenCalledOnce();
    });

    it("should keep the execution while a caller without signal waits", async () => {
      const { cache } = createCache();
      const { fn, resolve } = createDeferredFn();
      const ac = new AbortController();
      const withSignal = cache.runAsync({
        key: ["/data"],
        fn,
        signal: ac.signal,
      });
      const withoutSignal = cache.runAsync({ key: ["/data"], fn });
      ac.abort();
      await expect(withSignal).rejects.toSatisfy(isAbortError);
      expect(fn.mock.calls[0]?.[0].signal?.aborted).toBe(false);
      resolve();
      const { data, meta } = await withoutSignal;
      expect(data).toBe(payload);
      expect(meta.deduped).toBe(true);
    });

    it("should not abort an execution started without signal", async () => {
      const { cache, lru } = createCache();
      const { fn, resolve } = createDeferredFn();
      const first = cache.runAsync({ key: ["/data"], fn });
      const ac = new AbortController();
      const second = cache.runAsync({ key: ["/data"], fn, signal: ac.signal });
      ac.abort();
      await expect(second).rejects.toSatisfy(isAbortError);
      expect(fn.mock.calls[0]?.[0].signal).toBeUndefined();
      resolve();
      await expect(first).resolves.toMatchObject({ data: payload });
      expect(lru.size).toBe(1);
    });

    it("should handle a rejection of an execution without callers", async () => {
      const { cache } = createCache();
      const { fn, reject } = createDeferredFn();
      const ac = new AbortController();
      const call = cache.runAsync({ key: ["/data"], fn, signal: ac.signal });
      ac.abort();
      await expect(call).rejects.toSatisfy(isAbortError);
      // no unhandled rejection (vitest would fail the run)
      reject(new Error("late failure"));
      await Promise.resolve();
    });

    it("should abort with compression", async () => {
      const { cache, lru } = createCache({
        compressor: new CacheCompress({
          algorithm: "gzip",
          serializer: new JsonSerializer(),
          minimumByteSaving: 0,
          minimumStringLength: 0,
        }),
      });
      const fn = createAbortableFn();
      const ac = new AbortController();
      const call = cache.runAsyncEntry({
        key: ["/data"],
        fn,
        signal: ac.signal,
      });
      ac.abort();
      await expect(call).rejects.toSatisfy(isAbortError);
      expect(lru.size).toBe(0);
    });
  });

  it("should support AbortSignal.timeout", async () => {
    const { cache } = createCache();
    const fn = createAbortableFn();
    await expect(
      cache.runAsync({ key: ["/data"], fn, signal: AbortSignal.timeout(10) })
    ).rejects.toSatisfy(
      (error) => error instanceof DOMException && error.name === "TimeoutError"
    );
  });
});
