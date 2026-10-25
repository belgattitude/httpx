---
"@httpx/xcache": minor
---

JSON detection with superjson: plain data is stored as JSON and read with `JSON.parse`.

`CacheCompress` has a new `detectJson` option (default `true`): with `SuperjsonSerializer`, data without extended types is stored as plain JSON (`meta.content: "json"`) and read with `JSON.parse`. The detection has no extra cost (superjson only adds a meta when it encountered extended types). `DevalueSerializer` doesn't support it (its output is never plain JSON).

- `ICacheSerializer` gets an optional `serializeWithJsonDetection`, implemented by `SuperjsonSerializer`.
- `ICacheCompressor` gets an optional `supportsJsonDetection()`.
- `createHonoXCache` sends plain JSON entries as-is (`Content-Encoding`) to json responses, ie: an `XMemCache` instance with a superjson compressor. The caches it creates don't detect JSON, the compressed bytes always match the response serializer.
