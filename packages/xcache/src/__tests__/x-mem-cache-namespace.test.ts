import { TimeLruCache } from "@httpx/lru";

import { CacheCompress } from "../compress/cache-compress";
import { JsonSerializer } from "../serializer/json-serializer";
import { XMemCache } from "../x-mem-cache";

const payload = { id: 1 };
const fn = () => Promise.resolve(payload);

describe("XMemCache namespace", () => {
  const createLru = () => new TimeLruCache({ maxSize: 50, defaultTTL: 10_000 });

  it("should return the default namespace in the meta and entry info", async () => {
    const cache = new XMemCache({ lru: createLru() });
    const miss = await cache.runAsync({ key: ["/a"], fn });
    const hit = await cache.runAsync({ key: ["/a"], fn });
    expect(miss.meta.namespace).toBe("default");
    expect(hit.meta.namespace).toBe("default");
    expect(cache.getEntryInfo({ key: ["/a"] })?.namespace).toBe("default");
  });

  it("should return the instance and per call namespaces", async () => {
    const cache = new XMemCache({ lru: createLru(), namespace: "shop" });
    const { meta } = await cache.runAsync({ key: ["/a"], fn });
    const other = await cache.runAsync({
      key: ["/a"],
      fn,
      namespace: "admin",
    });
    expect(meta.namespace).toBe("shop");
    expect(meta.generatedKey).toContain('"ns":"shop"');
    expect(other.meta.cached).toBe(false);
    expect(other.meta.namespace).toBe("admin");
    expect(cache.getEntryInfo({ key: ["/a"] })?.namespace).toBe("shop");
    expect(
      cache.getEntryInfo({ key: ["/a"], namespace: "admin" })?.namespace
    ).toBe("admin");
  });

  it("should omit an empty namespace, like the generated key", async () => {
    const cache = new XMemCache({ lru: createLru(), namespace: "" });
    const { meta } = await cache.runAsync({ key: ["/a"], fn });
    expect(meta).not.toHaveProperty("namespace");
    expect(meta.generatedKey).not.toContain('"ns"');
    expect(cache.getEntryInfo({ key: ["/a"] })).not.toHaveProperty("namespace");
  });

  it("should list the namespace of each entry in the stats (shared lru)", async () => {
    const lru = createLru();
    const shop = new XMemCache({
      lru,
      namespace: "shop",
      compressor: new CacheCompress({
        algorithm: "gzip",
        serializer: new JsonSerializer(),
      }),
    });
    const admin = new XMemCache({ lru, namespace: "admin" });
    await shop.runAsync({ key: ["/a"], fn });
    await admin.runAsync({ key: ["/a"], fn });
    // the stats list every xcache entry of the lru: the namespace tells
    // which instance created them
    const namespaces = (cache: XMemCache) =>
      cache.getStats().entries.map(({ namespace }) => namespace);
    expect(namespaces(admin)).toStrictEqual(["shop", "admin"]);
    expect(namespaces(shop)).toStrictEqual(["shop", "admin"]);
  });

  it("should return the namespace with runAsyncEntry", async () => {
    const cache = new XMemCache({ lru: createLru(), namespace: "shop" });
    const miss = await cache.runAsyncEntry({ key: ["/a"], fn });
    const hit = await cache.runAsyncEntry({ key: ["/a"], fn });
    expect(miss.namespace).toBe("shop");
    expect(miss.entry.namespace).toBe("shop");
    expect(hit.cached).toBe(true);
    expect(hit.namespace).toBe("shop");
    expect(hit.entry.namespace).toBe("shop");
  });

  it("should return the namespace when the cache is bypassed", async () => {
    const cache = new XMemCache({ lru: createLru(), enabled: false });
    const { meta } = await cache.runAsync({
      key: ["/a"],
      fn,
      namespace: "shop",
    });
    expect(meta.bypassed).toBe(true);
    expect(meta.namespace).toBe("shop");
  });
});
