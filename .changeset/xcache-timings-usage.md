---
"@httpx/xcache": minor
---

Timings, usage and savings statistics, strings compressed without serializer.

#### Timings

The time spent creating cache entries (cache miss) is stored in `timings`, returned in the `runAsync` meta (on a cache hit: the timings of the execution that created the entry) and by `getStats()` / `getEntryInfo()`. On cache hits of compressed entries, `meta.readTimings` returns the time spent reading the entry for this call.

```typescript
const { meta } = await xMemCache.runAsync({ key: ["/api/data"], fn });
// meta.timings (milliseconds, max 2 decimals)
// {
//   fn: 152.37,      // time taken by the cached function
//   serialize: 3.12, // absent when not serialized (no compressor, strings...)
//   compress: 8.4,   // absent when compression wasn't attempted
// }

// compressed cache hits (deserialize is absent for strings)
// meta.readTimings: { decompress: 1.05, deserialize: 2.3 }
```

`CacheCompress.compress()` returns the serialization and compression times in `timings`, and `CacheCompress.decompress(data, timings?)` fills the provided object with the decompression and deserialization times (both optional for custom `ICacheCompressor`). `XMemCache.readEntry(entry, timings?)` accepts the same object.

#### Usage and savings

```typescript
const { entries, totals } = xMemCache.getStats();
// entries[0].timings: { fn: 152.37, serialize: 3.12, compress: 8.4 }
// entries[0].usage (since the entry creation, dropped when it expires)
// { hits: 42, deduped: 3, avgReadTime: 1.12, savedTime: 6798.09 }

// totals (since the instance creation, kept when entries expire or on clear)
// { hits: 1250, misses: 80, deduped: 12, bypassed: 5, savedTime: 184320.12 }

xMemCache.resetStats(); // reset the totals
```

`savedTime` (milliseconds) is the function time of hits and deduped calls, minus the read time of hits (decompress + deserialize) and the time spent serializing / compressing on misses. It can be negative when caching a key costs more than it saves.

#### Strings and numbers are never serialized

`CacheCompress` never calls the serializer for strings and numbers: numbers are never compressed (trivial values), strings are compressed as-is (`meta.serializer: "none"`) and returned without deserialization. Compressed strings are smaller and faster to read (ie: no JSON quoting/escaping).

Note for `createHonoXCache`: compressed string results (`serializer: "none"`) are decompressed and serialized for the response, the compressed bytes are only sent as-is (`Content-Encoding`) for data compressed with the response serializer.
