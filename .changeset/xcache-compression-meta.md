---
"@httpx/xcache": minor
---

Store compression meta with compressed cache entries and prevent reading incompatible entries.

- Compressed entries now record the `algorithm`, `encoding`, `serializer`, `originalSize`, `compressedSize` and `ratio` used to store them. They are returned by `XMemCache.runAsync()` in `meta.compression`.
- On a cache hit, an existing compressed entry created with a different algorithm, encoding or serializer is treated as a cache miss (function executed again, entry replaced) instead of being decoded with the wrong settings.
- New optional `ICacheCompressor.isCompatible(meta)` method, implemented by `CacheCompress`. `CacheCompress.decompress()` throws a `TypeError` for incompatible data.
- New exported types: `CacheCompressAlgorithm`, `CacheCompressEncoding`, `CacheCompressResult`, `CacheCompressSuccessMeta`.

**Breaking (types)**: `CacheCompressSuccessMeta` now requires `algorithm`, `encoding` and `serializer` (only relevant for custom `ICacheCompressor` implementations).
