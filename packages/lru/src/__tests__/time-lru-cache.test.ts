import { TimeLruCache } from "../time-lru-cache";

const HUNDRED_MILLIS = 100;
const SIXTY_MILLIS = 60;

describe("TimeLruCache", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Start from a known point in time
    vi.setSystemTime(0);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("expiresIn", () => {
    it("should return the remaining ttl", () => {
      const lru = new TimeLruCache({
        maxSize: 2,
        defaultTTL: HUNDRED_MILLIS,
      });
      lru.set("key1", "value1");
      lru.set("key2", "value2", 4 * HUNDRED_MILLIS);
      expect(lru.expiresIn("key1")).toBe(HUNDRED_MILLIS);
      expect(lru.expiresIn("key2")).toBe(4 * HUNDRED_MILLIS);
      vi.setSystemTime(Date.now() + SIXTY_MILLIS);
      expect(lru.expiresIn("key1")).toBe(HUNDRED_MILLIS - SIXTY_MILLIS);
      expect(lru.expiresIn("unknown")).toBeUndefined();
    });

    it("should return undefined for expired items without evicting them", () => {
      const fn = vi.fn<(key: string, value: unknown) => void>();
      const lru = new TimeLruCache({
        maxSize: 2,
        defaultTTL: HUNDRED_MILLIS,
        onEviction: fn,
      });
      lru.set("key1", "value1");
      vi.setSystemTime(Date.now() + HUNDRED_MILLIS + 1);
      expect(lru.expiresIn("key1")).toBeUndefined();
      expect(lru.size).toBe(1);
      expect(fn).not.toHaveBeenCalled();
    });

    it("should not mark the item as recently used", () => {
      const lru = new TimeLruCache({
        maxSize: 2,
        defaultTTL: HUNDRED_MILLIS,
      });
      lru.set("key1", "value1");
      lru.set("key2", "value2");
      lru.expiresIn("key1");
      lru.set("key3", "value3");
      expect(lru.has("key1")).toBe(false);
    });

    it("should be updated when the item is set again", () => {
      const lru = new TimeLruCache({
        maxSize: 2,
        defaultTTL: HUNDRED_MILLIS,
      });
      lru.set("key1", "value1");
      vi.setSystemTime(Date.now() + SIXTY_MILLIS);
      lru.set("key1", "value1", 2 * HUNDRED_MILLIS);
      expect(lru.expiresIn("key1")).toBe(2 * HUNDRED_MILLIS);
    });
  });

  describe("eviction", () => {
    it("should evict items based on ttl", () => {
      const lru = new TimeLruCache({
        maxSize: 2,
        defaultTTL: HUNDRED_MILLIS,
      });
      lru.set("key1", "value1", HUNDRED_MILLIS);
      lru.set("key2", "value2", 4 * HUNDRED_MILLIS);
      expect(lru.get("key1")).toBe("value1");
      expect(lru.get("key2")).toBe("value2");
      // Advance fake time beyond key1's ttl
      vi.setSystemTime(Date.now() + HUNDRED_MILLIS + SIXTY_MILLIS);
      expect(lru.get("key1")).toBeUndefined();
      expect(lru.get("key2")).toBe("value2");
    });

    it("should call onEviction when trying to get an expired item", () => {
      const fn = vi.fn<(key: string, value: unknown) => void>();

      const lru = new TimeLruCache({
        maxSize: 2,
        defaultTTL: HUNDRED_MILLIS,
        onEviction: (key, value) => {
          fn(key, value);
        },
      });
      lru.set("key1", "value1", HUNDRED_MILLIS);
      lru.set("key2", "value2", 4 * HUNDRED_MILLIS);
      // Move time forward so key1 expires but key2 does not
      vi.setSystemTime(Date.now() + HUNDRED_MILLIS + SIXTY_MILLIS);
      lru.get("key1");
      lru.get("key2");
      expect(fn).toHaveBeenCalledExactlyOnceWith("key1", "value1");
    });

    it("should call eviction on has() if item expired", () => {
      const fn = vi.fn<(key: string, value: unknown) => void>();

      const lru = new TimeLruCache({
        maxSize: 2,
        defaultTTL: HUNDRED_MILLIS,
        onEviction: (key, value) => {
          fn(key, value);
        },
      });
      lru.set("key1", "value1", HUNDRED_MILLIS);
      vi.setSystemTime(Date.now() + HUNDRED_MILLIS + SIXTY_MILLIS);
      lru.has("key1");
      expect(fn).toHaveBeenCalledExactlyOnceWith("key1", "value1");
    });

    it.each(["get", "has"] as const)(
      "should remove expired items accessed with %s()",
      (method) => {
        const fn = vi.fn<(key: string, value: unknown) => void>();
        const lru = new TimeLruCache({
          maxSize: 2,
          defaultTTL: HUNDRED_MILLIS,
          onEviction: (key, value) => {
            fn(key, value);
          },
        });
        lru.set("key1", "value1", HUNDRED_MILLIS);
        lru.set("key2", "value2", 4 * HUNDRED_MILLIS);
        vi.setSystemTime(Date.now() + HUNDRED_MILLIS + SIXTY_MILLIS);
        lru[method]("key1");
        expect(lru.size).toBe(1);
        expect([...lru]).toStrictEqual([["key2", "value2"]]);
        expect(lru.delete("key1")).toBe(false);
        // evicted once
        lru[method]("key1");
        expect(fn).toHaveBeenCalledExactlyOnceWith("key1", "value1");
        // the key can be set again
        lru.set("key1", "value1bis");
        expect(lru.get("key1")).toBe("value1bis");
        expect(lru.size).toBe(2);
      }
    );
  });
  describe("getOrSet", () => {
    it("should get existing item if not expired", () => {
      const lru = new TimeLruCache({
        maxSize: 2,
        defaultTTL: HUNDRED_MILLIS,
      });
      lru.set("key1", "value1", HUNDRED_MILLIS * 5);
      const val = lru.getOrSet("key1", () => "newValue", {
        ttl: HUNDRED_MILLIS,
      });
      expect(val).toBe("value1");
    });

    it("should force a revalidation is requested", () => {
      const lru = new TimeLruCache({
        maxSize: 2,
        defaultTTL: HUNDRED_MILLIS,
      });
      lru.set("key1", "value1", HUNDRED_MILLIS * 10);
      const val = lru.getOrSet("key1", () => "newValue", {
        ttl: HUNDRED_MILLIS,
        forceRevalidate: true,
      });
      expect(val).toBe("newValue");
    });

    it("should set a new value item has expired", () => {
      const lru = new TimeLruCache({
        maxSize: 2,
        defaultTTL: HUNDRED_MILLIS,
      });
      lru.set("key1", "value1", HUNDRED_MILLIS);
      // Advance fake time beyond key1's ttl
      vi.setSystemTime(Date.now() + HUNDRED_MILLIS + SIXTY_MILLIS);
      const val = lru.getOrSet("key1", () => "newValue", {
        ttl: HUNDRED_MILLIS,
      });
      expect(val).toBe("newValue");
    });
  });
});
