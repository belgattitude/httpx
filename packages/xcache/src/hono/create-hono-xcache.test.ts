import { Decompressor } from "@httpx/compress";
import { TimeLruCache } from "@httpx/lru";
import { Hono } from "hono";
import { compress } from "hono/compress";
import { expect, vi } from "vitest";

import { CacheCompress } from "../compress/cache-compress";
import { JsonSerializer } from "../serializer/json-serializer";
import { SuperjsonSerializer } from "../serializer/superjson-serializer";
import { XMemCache } from "../x-mem-cache";
import { createHonoXCache, type HonoXCacheLruOptions } from "./index";

const payload = {
  rows: Array.from({ length: 2000 }, (_, i) => {
    return { id: i, name: `Item ${i}` };
  }),
};
const smallPayload = { id: 1 };

const createApp = (options: Omit<HonoXCacheLruOptions, "lru"> = {}) => {
  const lru = new TimeLruCache({ maxSize: 50, defaultTTL: 60_000 });
  const xcache = createHonoXCache({ lru, debugHeaders: true, ...options });
  const fetchData = vi.fn<() => Promise<typeof payload>>(() =>
    Promise.resolve(payload)
  );
  const fetchSmall = vi.fn<() => Promise<typeof smallPayload>>(() =>
    Promise.resolve(smallPayload)
  );
  const app = new Hono();
  app.get("/data", (c) =>
    xcache.json(c, { key: ["/data"], fn: () => fetchData() })
  );
  app.get("/small", (c) =>
    xcache.json(c, {
      key: ["/small"],
      fn: () => fetchSmall(),
      headers: { "Cache-Control": "max-age=60" },
    })
  );
  return { app, xcache, fetchData, fetchSmall };
};

const decompressBody = async (
  res: Response,
  algorithm: "gzip" | "deflate"
): Promise<unknown> => {
  const bytes = await new Decompressor(algorithm).fromUint8Array(
    new Uint8Array(await res.arrayBuffer())
  );
  return JSON.parse(new TextDecoder().decode(bytes)) as unknown;
};

/**
 * Accept-Encoding is a forbidden request header in browsers, it's silently
 * dropped from Request objects: compressed responses can't be tested there.
 */
const canSetAcceptEncoding = new Request("http://localhost", {
  headers: { "Accept-Encoding": "gzip" },
}).headers.has("Accept-Encoding");

describe("createHonoXCache", () => {
  it.runIf(canSetAcceptEncoding)(
    "should cache and send compressed bytes as-is when gzip is accepted",
    async () => {
      const { app, fetchData } = createApp();
      const headers = { "Accept-Encoding": "gzip, deflate, br" };

      const miss = await app.request("/data", { headers });
      expect(miss.status).toBe(200);
      expect(miss.headers.get("X-XCache")).toBe("MISS");
      expect(miss.headers.get("Content-Encoding")).toBe("gzip");
      expect(miss.headers.get("Content-Type")).toBe(
        "application/json; charset=utf-8"
      );
      expect(miss.headers.get("Vary")).toBe("Accept-Encoding");
      await expect(decompressBody(miss, "gzip")).resolves.toStrictEqual(
        payload
      );

      const hit = await app.request("/data", { headers });
      expect(hit.headers.get("X-XCache")).toBe("HIT");
      expect(hit.headers.get("Content-Encoding")).toBe("gzip");
      const bytes = new Uint8Array(await hit.clone().arrayBuffer());
      expect(hit.headers.get("Content-Length")).toBe(String(bytes.byteLength));
      expect(bytes.byteLength).toBeLessThan(JSON.stringify(payload).length / 5);
      await expect(decompressBody(hit, "gzip")).resolves.toStrictEqual(payload);
      expect(fetchData).toHaveBeenCalledOnce();
    }
  );

  it.each([[undefined], ["br"], ["gzip;q=0"]])(
    "should decompress when the client does not accept the encoding (Accept-Encoding: %s)",
    async (acceptEncoding) => {
      const { app } = createApp();
      await app.request("/data");
      const res = await app.request("/data", {
        headers:
          acceptEncoding === undefined
            ? {}
            : { "Accept-Encoding": acceptEncoding },
      });
      expect(res.headers.get("X-XCache")).toBe("HIT");
      expect(res.headers.get("Content-Encoding")).toBeNull();
      await expect(res.text()).resolves.toBe(JSON.stringify(payload));
    }
  );

  it.runIf(canSetAcceptEncoding)("should support deflate", async () => {
    const { app } = createApp({ compression: { algorithm: "deflate" } });
    await app.request("/data");
    const res = await app.request("/data", {
      headers: { "Accept-Encoding": "deflate" },
    });
    expect(res.headers.get("Content-Encoding")).toBe("deflate");
    await expect(decompressBody(res, "deflate")).resolves.toStrictEqual(
      payload
    );

    const gzipOnly = await app.request("/data", {
      headers: { "Accept-Encoding": "gzip" },
    });
    expect(gzipOnly.headers.get("Content-Encoding")).toBeNull();
    await expect(gzipOnly.json()).resolves.toStrictEqual(payload);
  });

  it("should serialize native entries (compression skipped)", async () => {
    const { app, fetchSmall } = createApp();
    const headers = { "Accept-Encoding": "gzip" };
    await app.request("/small", { headers });
    const res = await app.request("/small", { headers });
    expect(res.headers.get("X-XCache")).toBe("HIT");
    expect(res.headers.get("Content-Encoding")).toBeNull();
    expect(res.headers.get("Cache-Control")).toBe("max-age=60");
    await expect(res.json()).resolves.toStrictEqual(smallPayload);
    expect(fetchSmall).toHaveBeenCalledOnce();
  });

  it("should serialize compressed strings", async () => {
    const { xcache } = createApp();
    const text = "<li>Hello world</li>".repeat(5000);
    const app = new Hono();
    app.get("/text", (c) =>
      xcache.json(c, { key: ["/text"], fn: () => Promise.resolve(text) })
    );
    const headers = { "Accept-Encoding": "gzip" };
    await app.request("/text", { headers });
    expect(xcache.getEntryInfo({ key: ["/text"] })?.compression).toMatchObject({
      serializer: "json",
      content: "string",
    });
    const res = await app.request("/text", { headers });
    expect(res.headers.get("X-XCache")).toBe("HIT");
    // the compressed bytes are the string, not a json body
    expect(res.headers.get("Content-Encoding")).toBeNull();
    await expect(res.json()).resolves.toBe(text);
  });

  it("should work without compression", async () => {
    const { app } = createApp({ compression: false });
    const headers = { "Accept-Encoding": "gzip" };
    await app.request("/data", { headers });
    const res = await app.request("/data", { headers });
    expect(res.headers.get("X-XCache")).toBe("HIT");
    expect(res.headers.get("Content-Encoding")).toBeNull();
    expect(res.headers.get("Vary")).toBeNull();
    await expect(res.json()).resolves.toStrictEqual(payload);
  });

  it("should return 304 when If-None-Match matches the ETag", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(1000);
    try {
      const { app, xcache } = createApp();
      const first = await app.request("/data");
      const etag = first.headers.get("ETag") ?? "";
      expect(etag).toMatch(/^W\/".+"$/);

      const notModified = await app.request("/data", {
        headers: { "If-None-Match": etag, "Accept-Encoding": "gzip" },
      });
      expect(notModified.status).toBe(304);
      expect(notModified.headers.get("ETag")).toBe(etag);
      expect(notModified.headers.get("Content-Encoding")).toBeNull();
      await expect(notModified.text()).resolves.toBe("");

      const stale = await app.request("/data", {
        headers: { "If-None-Match": 'W/"other"' },
      });
      expect(stale.status).toBe(200);
      expect(stale.headers.get("ETag")).toBe(etag);

      // a new entry gets a new etag
      xcache.cache.clear();
      vi.setSystemTime(2000);
      const renewed = await app.request("/data", {
        headers: { "If-None-Match": etag },
      });
      expect(renewed.status).toBe(200);
      expect(renewed.headers.get("ETag")).not.toBe(etag);
    } finally {
      vi.useRealTimers();
    }
  });

  it("should bypass the cache when disabled globally", async () => {
    const { app, fetchData } = createApp({ enabled: false });
    const headers = { "Accept-Encoding": "gzip" };
    await app.request("/data", { headers });
    const res = await app.request("/data", { headers });
    expect(res.headers.get("X-XCache")).toBe("BYPASS");
    expect(res.headers.get("ETag")).toBeNull();
    expect(res.headers.get("Content-Encoding")).toBeNull();
    await expect(res.json()).resolves.toStrictEqual(payload);
    expect(fetchData).toHaveBeenCalledTimes(2);
  });

  it("should bypass the cache per call", async () => {
    const lru = new TimeLruCache({ maxSize: 50, defaultTTL: 60_000 });
    const xcache = createHonoXCache({ lru, debugHeaders: true });
    const app = new Hono();
    app.get("/data", (c) =>
      xcache.json(c, {
        key: ["/data"],
        fn: () => Promise.resolve(payload),
        enabled: c.req.query("nocache") === undefined,
      })
    );
    await app.request("/data");
    const hit = await app.request("/data");
    expect(hit.headers.get("X-XCache")).toBe("HIT");
    const bypass = await app.request("/data?nocache");
    expect(bypass.headers.get("X-XCache")).toBe("BYPASS");
  });

  it("should dedupe concurrent requests", async () => {
    const { app, fetchData } = createApp();
    const headers = { "Accept-Encoding": "gzip" };
    const [a, b] = await Promise.all([
      app.request("/data", { headers }),
      app.request("/data", { headers }),
    ]);
    expect(fetchData).toHaveBeenCalledOnce();
    expect(a.headers.get("X-XCache")).toBe("MISS");
    expect(b.headers.get("X-XCache")).toBe("DEDUPED");
    expect(b.headers.get("ETag")).toBe(a.headers.get("ETag"));
    // browsers drop Accept-Encoding (forbidden header): no Content-Encoding
    expect(b.headers.get("Content-Encoding")).toBe(
      a.headers.get("Content-Encoding")
    );
  });

  it("should not dedupe concurrent requests when disabled", async () => {
    const { app, fetchData } = createApp({ dedupe: false });
    const responses = await Promise.all([
      app.request("/data"),
      app.request("/data"),
    ]);
    expect(fetchData).toHaveBeenCalledTimes(2);
    for (const res of responses) {
      expect(res.headers.get("X-XCache")).toBe("MISS");
    }
  });

  it("should not dedupe concurrent requests disabling it per call", async () => {
    const lru = new TimeLruCache({ maxSize: 50, defaultTTL: 60_000 });
    const xcache = createHonoXCache({ lru, debugHeaders: true });
    const fetchData = vi.fn<() => Promise<typeof payload>>(() =>
      Promise.resolve(payload)
    );
    const app = new Hono();
    app.get("/data", (c) =>
      xcache.json(c, {
        key: ["/data"],
        fn: () => fetchData(),
        dedupe: c.req.query("nodedupe") === undefined,
      })
    );
    await Promise.all([app.request("/data"), app.request("/data?nodedupe")]);
    expect(fetchData).toHaveBeenCalledTimes(2);
  });

  describe("abort signal", () => {
    const createAbortApp = (
      getSignal: (c: { req: { raw: Request } }) => AbortSignal
    ) => {
      const lru = new TimeLruCache({ maxSize: 50, defaultTTL: 60_000 });
      const xcache = createHonoXCache({ lru, debugHeaders: true });
      const fetchData = vi.fn<
        (params: {
          signal?: AbortSignal | undefined;
        }) => Promise<typeof payload>
      >(
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
            setTimeout(() => resolve(payload), 50);
          })
      );
      const app = new Hono();
      app.get("/data", (c) =>
        xcache.json(c, {
          key: ["/data"],
          fn: ({ signal }) => fetchData({ signal }),
          signal: getSignal(c),
        })
      );
      return { app, lru, fetchData };
    };

    it("should return 499 when the client disconnects", async () => {
      const { app, lru, fetchData } = createAbortApp((c) => c.req.raw.signal);
      const ac = new AbortController();
      const res = app.request("/data", { signal: ac.signal });
      ac.abort();
      const response = await res;
      expect(response.status).toBe(499);
      await expect(response.text()).resolves.toBe("");
      expect(fetchData.mock.calls[0]?.[0].signal?.aborted).toBe(true);
      expect(lru.size).toBe(0);
    });

    it("should not call the function when already disconnected", async () => {
      const { app, fetchData } = createAbortApp((c) => c.req.raw.signal);
      const res = await app.request("/data", { signal: AbortSignal.abort() });
      expect(res.status).toBe(499);
      expect(fetchData).not.toHaveBeenCalled();
    });

    it("should serve the data when not aborted", async () => {
      const { app, lru } = createAbortApp((c) => c.req.raw.signal);
      const res = await app.request("/data");
      expect(res.status).toBe(200);
      await expect(res.json()).resolves.toStrictEqual(payload);
      expect(lru.size).toBe(1);
    });

    it("should keep the execution while another client waits", async () => {
      const { app, lru, fetchData } = createAbortApp((c) => c.req.raw.signal);
      const ac = new AbortController();
      const disconnected = app.request("/data", { signal: ac.signal });
      const connected = app.request("/data");
      ac.abort();
      const disconnectedRes = await disconnected;
      expect(disconnectedRes.status).toBe(499);
      const res = await connected;
      expect(res.status).toBe(200);
      expect(res.headers.get("X-XCache")).toBe("DEDUPED");
      expect(fetchData).toHaveBeenCalledOnce();
      expect(lru.size).toBe(1);
    });

    it("should propagate a timeout when the client is still connected", async () => {
      const { app } = createAbortApp((c) =>
        AbortSignal.any([c.req.raw.signal, AbortSignal.timeout(5)])
      );
      const res = await app.request("/data");
      // default hono error handler
      expect(res.status).toBe(500);
    });
  });

  it("should not compress when compression is disabled", async () => {
    const { app, fetchData } = createApp({ compressionEnabled: false });
    const headers = { "Accept-Encoding": "gzip" };
    await app.request("/data", { headers });
    const res = await app.request("/data", { headers });
    expect(res.headers.get("X-XCache")).toBe("HIT");
    expect(res.headers.get("Content-Encoding")).toBeNull();
    expect(res.headers.get("ETag")).not.toBeNull();
    await expect(res.json()).resolves.toStrictEqual(payload);
    expect(fetchData).toHaveBeenCalledOnce();
  });

  describe("cacheControl", () => {
    it("should not send Cache-Control by default", async () => {
      const { app } = createApp();
      await app.request("/data");
      const res = await app.request("/data");
      expect(res.headers.get("Cache-Control")).toBeNull();
    });

    it("should send a static Cache-Control", async () => {
      const { app } = createApp({ cacheControl: "public, max-age=60" });
      const res = await app.request("/data");
      expect(res.headers.get("Cache-Control")).toBe("public, max-age=60");
    });

    it("should use the remaining ttl as max-age", async () => {
      vi.useFakeTimers({ toFake: ["Date"] });
      vi.setSystemTime(0);
      try {
        const lru = new TimeLruCache({ maxSize: 50, defaultTTL: 60_000 });
        const xcache = createHonoXCache({
          lru,
          cacheControl: { maxAge: "ttl", staleWhileRevalidate: 30 },
        });
        const app = new Hono();
        app.get("/data", (c) =>
          xcache.json(c, {
            key: ["/data"],
            fn: () => Promise.resolve(payload),
          })
        );
        app.get("/short", (c) =>
          xcache.json(c, {
            key: ["/short"],
            fn: () => Promise.resolve(payload),
            ttl: 10_000,
          })
        );
        const miss = await app.request("/data");
        expect(miss.headers.get("Cache-Control")).toBe(
          "private, max-age=60, stale-while-revalidate=30"
        );
        vi.setSystemTime(10_500);
        const hit = await app.request("/data");
        expect(hit.headers.get("Cache-Control")).toBe(
          "private, max-age=49, stale-while-revalidate=30"
        );
        const short = await app.request("/short");
        expect(short.headers.get("Cache-Control")).toBe(
          "private, max-age=10, stale-while-revalidate=30"
        );
        // 304 responses keep the Cache-Control header
        const notModified = await app.request("/data", {
          headers: { "If-None-Match": hit.headers.get("ETag") ?? "" },
        });
        expect(notModified.status).toBe(304);
        expect(notModified.headers.get("Cache-Control")).toBe(
          "private, max-age=49, stale-while-revalidate=30"
        );
      } finally {
        vi.useRealTimers();
      }
    });

    it("should allow per call override and give precedence to headers", async () => {
      const lru = new TimeLruCache({ maxSize: 50, defaultTTL: 60_000 });
      const xcache = createHonoXCache({
        lru,
        cacheControl: "public, max-age=60",
      });
      const app = new Hono();
      app.get("/none", (c) =>
        xcache.json(c, {
          key: ["/none"],
          fn: () => Promise.resolve(payload),
          cacheControl: false,
        })
      );
      app.get("/custom", (c) =>
        xcache.json(c, {
          key: ["/custom"],
          fn: () => Promise.resolve(payload),
          cacheControl: { maxAge: 5 },
        })
      );
      app.get("/header", (c) =>
        xcache.json(c, {
          key: ["/header"],
          fn: () => Promise.resolve(payload),
          headers: { "cache-control": "no-store" },
        })
      );
      app.get("/bypass", (c) =>
        xcache.json(c, {
          key: ["/bypass"],
          fn: () => Promise.resolve(payload),
          enabled: false,
        })
      );
      const none = await app.request("/none");
      expect(none.headers.get("Cache-Control")).toBeNull();
      const custom = await app.request("/custom");
      expect(custom.headers.get("Cache-Control")).toBe("private, max-age=5");
      const header = await app.request("/header");
      expect(header.headers.get("Cache-Control")).toBe("no-store");
      const bypass = await app.request("/bypass");
      expect(bypass.headers.get("Cache-Control")).toBeNull();
    });
  });

  it("should not cache errors and let hono handle them", async () => {
    class NotFoundError extends Error {
      override readonly name = "NotFoundError";
      readonly statusCode = 404;
    }
    const lru = new TimeLruCache({ maxSize: 50, defaultTTL: 60_000 });
    const xcache = createHonoXCache({ lru, debugHeaders: true });
    const fetchProduct = vi.fn<(id: string) => Promise<{ id: string }>>((id) =>
      id === "1"
        ? Promise.resolve({ id })
        : Promise.reject(new NotFoundError(`Product ${id} not found`))
    );
    const app = new Hono();
    app.get("/products/:id", (c) =>
      xcache.json(c, {
        key: ["/products", { id: c.req.param("id") }],
        fn: () => fetchProduct(c.req.param("id")),
      })
    );
    // oxlint-disable-next-line promise/prefer-await-to-callbacks -- hono error handler
    app.onError((err, c) =>
      err instanceof NotFoundError
        ? c.json({ error: err.message }, 404)
        : c.json({ error: "Internal Server Error" }, 500)
    );

    for (let i = 0; i < 2; i++) {
      const res = await app.request("/products/2");
      expect(res.status).toBe(404);
      expect(res.headers.get("X-XCache")).toBeNull();
      await expect(res.json()).resolves.toStrictEqual({
        error: "Product 2 not found",
      });
    }
    // errors are not cached: retried on each request
    expect(fetchProduct).toHaveBeenCalledTimes(2);

    const ok = await app.request("/products/1");
    expect(ok.status).toBe(200);
    expect(lru.size).toBe(1);
  });

  it("should preserve the caller-provided Vary header", async () => {
    const lru = new TimeLruCache({ maxSize: 50, defaultTTL: 60_000 });
    const xcache = createHonoXCache({ lru });
    const app = new Hono();
    app.get("/data", (c) =>
      xcache.json(c, {
        key: ["/data"],
        fn: () => Promise.resolve(payload),
        headers: { vary: "Cookie", "Cache-Control": "public, max-age=60" },
      })
    );
    const res = await app.request("/data");
    expect(res.headers.get("Vary")).toBe("Cookie, Accept-Encoding");
  });

  it("should change the ETag when revalidated in the same millisecond", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(1000);
    try {
      const lru = new TimeLruCache({ maxSize: 50, defaultTTL: 60_000 });
      const xcache = createHonoXCache({ lru });
      let version = 0;
      const app = new Hono();
      app.get("/data", (c) =>
        xcache.json(c, {
          key: ["/data"],
          fn: () => Promise.resolve({ version: ++version }),
          forceRevalidate: c.req.query("refresh") !== undefined,
        })
      );
      const first = await app.request("/data");
      const etag = first.headers.get("ETag") ?? "";
      // same millisecond, content changed by the revalidation
      const refreshed = await app.request("/data?refresh", {
        headers: { "If-None-Match": etag },
      });
      expect(refreshed.status).toBe(200);
      expect(refreshed.headers.get("ETag")).not.toBe(etag);
      await expect(refreshed.json()).resolves.toStrictEqual({ version: 2 });
    } finally {
      vi.useRealTimers();
    }
  });

  it("should not send an ETag when disabled", async () => {
    const { app } = createApp({ etag: false });
    const res = await app.request("/data");
    expect(res.headers.get("ETag")).toBeNull();
  });

  it.runIf(canSetAcceptEncoding)(
    "should not be compressed twice by hono compress middleware",
    async () => {
      const lru = new TimeLruCache({ maxSize: 50, defaultTTL: 60_000 });
      const xcache = createHonoXCache({ lru });
      const app = new Hono();
      app.use(compress());
      app.get("/data", (c) =>
        xcache.json(c, {
          key: ["/data"],
          fn: () => Promise.resolve(payload),
        })
      );
      const headers = { "Accept-Encoding": "gzip" };
      await app.request("/data", { headers });
      const res = await app.request("/data", { headers });
      expect(res.headers.get("Content-Encoding")).toBe("gzip");
      await expect(decompressBody(res, "gzip")).resolves.toStrictEqual(payload);
    }
  );

  it("should support other serializers with a custom content type", async () => {
    const data = {
      date: new Date("2026-01-01T00:00:00.000Z"),
      rows: payload.rows,
    };
    const serializer = new SuperjsonSerializer();
    const lru = new TimeLruCache({ maxSize: 50, defaultTTL: 60_000 });
    const xcache = createHonoXCache({
      lru,
      serializer,
      contentType: "application/superjson+json",
    });
    const app = new Hono();
    app.get("/sj", (c) =>
      xcache.json(c, { key: ["/sj"], fn: () => Promise.resolve(data) })
    );
    await app.request("/sj");
    const res = await app.request("/sj");
    expect(res.headers.get("Content-Type")).toBe("application/superjson+json");
    expect(serializer.deserialize(await res.text())).toStrictEqual(data);
  });

  it.runIf(canSetAcceptEncoding)(
    "should send plain data as-is with other serializers (no json detection)",
    async () => {
      const serializer = new SuperjsonSerializer();
      const lru = new TimeLruCache({ maxSize: 50, defaultTTL: 60_000 });
      const xcache = createHonoXCache({ lru, serializer });
      const app = new Hono();
      app.get("/sj", (c) =>
        xcache.json(c, { key: ["/sj"], fn: () => Promise.resolve(payload) })
      );
      const headers = { "Accept-Encoding": "gzip" };
      await app.request("/sj", { headers });
      expect(
        xcache.getEntryInfo({ key: ["/sj"] })?.compression
      ).not.toHaveProperty("content");
      const res = await app.request("/sj", { headers });
      expect(res.headers.get("Content-Encoding")).toBe("gzip");
      const bytes = await new Decompressor("gzip").fromUint8Array(
        new Uint8Array(await res.arrayBuffer())
      );
      expect(
        serializer.deserialize(new TextDecoder().decode(bytes))
      ).toStrictEqual(payload);
    }
  );

  describe("with an existing XMemCache instance", () => {
    const createInstance = (
      serializer: JsonSerializer | SuperjsonSerializer,
      encoding: "binary" | "base64"
    ) =>
      new XMemCache({
        lru: new TimeLruCache({ maxSize: 50, defaultTTL: 60_000 }),
        compressor: new CacheCompress({
          algorithm: "gzip",
          serializer,
          encoding,
          minimumByteSaving: 0,
          minimumStringLength: 0,
        }),
      });

    it("should add the hono origin to the cache keys", async () => {
      const cache = createInstance(new JsonSerializer(), "binary");
      const xcache = createHonoXCache({ cache });
      const app = new Hono();
      app.get("/data", (c) =>
        xcache.json(c, {
          key: ["/data"],
          fn: () => Promise.resolve({ from: "hono", rows: payload.rows }),
        })
      );
      const { meta } = await cache.runAsync({
        key: ["/data"],
        fn: () => Promise.resolve({ from: "runAsync", rows: payload.rows }),
      });
      const res = await app.request("/data");
      // not served from the runAsync entry
      await expect(res.json()).resolves.toMatchObject({ from: "hono" });
      expect(cache.getStats().items).toBe(2);
      expect(meta.generatedKey).not.toContain('"origin"');
      expect(xcache.getEntryInfo({ key: ["/data"] })?.key).toBe(
        '{"compressorId":"cache-compress:json","key":["/data"],"ns":"default","origin":"hono"}'
      );
      expect(cache.getEntryInfo({ key: ["/data"] })?.key).toBe(
        meta.generatedKey
      );
    });

    it.runIf(canSetAcceptEncoding)(
      "should send base64 entries as-is (decoded) with the same serializer",
      async () => {
        const cache = createInstance(new JsonSerializer(), "base64");
        const xcache = createHonoXCache({ cache, debugHeaders: true });
        const app = new Hono();
        app.get("/data", (c) =>
          xcache.json(c, { key: ["/data"], fn: () => Promise.resolve(payload) })
        );
        const headers = { "Accept-Encoding": "gzip" };
        await app.request("/data", { headers });
        const res = await app.request("/data", { headers });
        expect(res.headers.get("X-XCache")).toBe("HIT");
        expect(res.headers.get("Content-Encoding")).toBe("gzip");
        expect(res.headers.get("Vary")).toBe("Accept-Encoding");
        await expect(decompressBody(res, "gzip")).resolves.toStrictEqual(
          payload
        );
        const plain = await app.request("/data");
        await expect(plain.json()).resolves.toStrictEqual(payload);
      }
    );

    it("should re-serialize entries compressed with another serializer", async () => {
      const cache = createInstance(new SuperjsonSerializer(), "binary");
      const xcache = createHonoXCache({ cache, debugHeaders: true });
      const data = {
        date: new Date("2026-01-01T00:00:00.000Z"),
        rows: payload.rows,
      };
      const app = new Hono();
      app.get("/data", (c) =>
        xcache.json(c, { key: ["/data"], fn: () => Promise.resolve(data) })
      );
      const headers = { "Accept-Encoding": "gzip" };
      await app.request("/data", { headers });
      const res = await app.request("/data", { headers });
      expect(res.headers.get("X-XCache")).toBe("HIT");
      // superjson bytes can't be sent as json
      expect(res.headers.get("Content-Encoding")).toBeNull();
      await expect(res.json()).resolves.toStrictEqual({
        date: "2026-01-01T00:00:00.000Z",
        rows: payload.rows,
      });
    });

    it.runIf(canSetAcceptEncoding)(
      "should send plain json entries detected by superjson as-is",
      async () => {
        const cache = createInstance(new SuperjsonSerializer(), "binary");
        const xcache = createHonoXCache({ cache, debugHeaders: true });
        const app = new Hono();
        app.get("/data", (c) =>
          xcache.json(c, { key: ["/data"], fn: () => Promise.resolve(payload) })
        );
        const headers = { "Accept-Encoding": "gzip" };
        await app.request("/data", { headers });
        expect(
          xcache.getEntryInfo({ key: ["/data"] })?.compression
        ).toMatchObject({ serializer: "superjson", content: "json" });
        const res = await app.request("/data", { headers });
        expect(res.headers.get("X-XCache")).toBe("HIT");
        expect(res.headers.get("Content-Encoding")).toBe("gzip");
        await expect(decompressBody(res, "gzip")).resolves.toStrictEqual(
          payload
        );
        const plain = await app.request("/data");
        await expect(plain.json()).resolves.toStrictEqual(payload);
      }
    );

    it("should serialize plain json entries for other response serializers", async () => {
      const serializer = new SuperjsonSerializer();
      const cache = createInstance(serializer, "binary");
      const xcache = createHonoXCache({
        cache,
        serializer,
        debugHeaders: true,
      });
      const app = new Hono();
      app.get("/data", (c) =>
        xcache.json(c, { key: ["/data"], fn: () => Promise.resolve(payload) })
      );
      const headers = { "Accept-Encoding": "gzip" };
      await app.request("/data", { headers });
      const res = await app.request("/data", { headers });
      expect(res.headers.get("X-XCache")).toBe("HIT");
      // the json bytes are not in the superjson format
      expect(res.headers.get("Content-Encoding")).toBeNull();
      expect(serializer.deserialize(await res.text())).toStrictEqual(payload);
    });

    it("should use the instance enabled option", async () => {
      const cache = new XMemCache({
        lru: new TimeLruCache({ maxSize: 50, defaultTTL: 60_000 }),
        enabled: false,
      });
      const xcache = createHonoXCache({ cache, debugHeaders: true });
      const app = new Hono();
      app.get("/data", (c) =>
        xcache.json(c, { key: ["/data"], fn: () => Promise.resolve(payload) })
      );
      const res = await app.request("/data");
      expect(res.headers.get("X-XCache")).toBe("BYPASS");
      expect(res.headers.get("Vary")).toBeNull();
      expect(xcache.cache).toBe(cache);
    });
  });
});
