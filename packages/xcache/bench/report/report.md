# @httpx/xcache benchmark report

Generated on 2026-10-25 with @httpx/xcache 0.11.0.

## Platform

|              |                              |
| ------------ | ---------------------------- |
| OS           | macOS 27.0.1 (Darwin 27.0.0) |
| Architecture | arm64                        |
| CPU          | Apple M5 Pro (18 cores)      |
| Memory       | 24 GiB                       |

## Engines

| Runtime | Version | JS engine                            |
| ------- | ------- | ------------------------------------ |
| Node.js | 26.12.0 | V8 14.6.202.34-node.39               |
| Bun     | 1.4.4   | JavaScriptCore (WebKit d6375c72affe) |

## Summary

Bun 1.4.4 vs Node.js 26.12.0 (geometric mean of the median times of all serializers, memory is indicative: each engine accounts memory differently).

| Scenario | Cache miss | Cache hit | Memory per entry |
| --- | --: | --: | --: |
| Small payload | **1.57× faster** | **1.59× faster** | 1.33× more |
| Medium payload | **1.56× faster** | **1.60× faster** | 1.60× more |
| Large payload | **1.63× faster** | **1.63× faster** | 1.63× more |
| Large payload with extended types | **1.74× faster** | **1.57× faster** | 1.56× more |
| Hono, medium payload (requests) | **1.83× faster** | **2.60× faster** | - |
| **Overall** (cache) | **1.62× faster** | **1.60× faster** | 1.52× more |

Best serializer per scenario (Node.js, excluding "No compression"):

| Scenario | ⚡ Fastest miss | 🚀 Fastest hit | 🪶 Smallest memory |
| --- | --- | --- | --- |
| Small payload | json + gzip | all similar | devalue + gzip |
| Medium payload | json + gzip | superjson + gzip | cbor-x + gzip |
| Large payload | json + gzip | cbor-x + gzip | cbor-x + gzip |
| Large payload with extended types | cbor-x + gzip | cbor-x + gzip | cbor-x + gzip |

## Method

- The cached function resolves immediately: times are the cache overhead only.
- **Cache miss**: cache key generation, serialization, compression and storage (a new key each time).
- **Cache hit**: lookup, decompression and deserialization of the same key.
- Times are medians (mean, p99 and sample count in `report.json`).
- **Memory per entry**: growth of `heapUsed + external` after a forced GC, between a half-full and a full cache of fresh payloads (fixed costs excluded), median of 3 runs. "No compression" keeps the live objects.
- Compression: `CacheCompress` with `gzip` and the default options (compressed from 16K characters and 32 KB saved), `binary` encoding.

## Scenarios

⚡ fastest cache miss (serialize + compress), 🚀 fastest cache hit (decompress + deserialize), 🪶 smallest size. "No compression" is excluded, it keeps the live objects.

### 1. Small payload

Array of small records, under the compression minimum size (stored as-is): 20 records, 1.7 kB as JSON.

| Serializer | Stored as | Compressed size | Miss Node.js | Miss Bun | Hit Node.js | Hit Bun | Memory Node.js | Memory Bun |
| --- | --- | --: | --: | --: | --: | --: | --: | --: |
| No compression | native | - | 583 ns | 416 ns | 167 ns | 125 ns | 3.8 kB | 3.2 kB |
| json + gzip | native | - | ⚡ **3.0 µs** | ⚡ **1.4 µs** | 209 ns | 🚀 **125 ns** | 4.6 kB | 5.4 kB |
| superjson + gzip | native | - | 20.4 µs | 18.2 µs | 🚀 **208 ns** | 🚀 **125 ns** | 4 kB | 5.4 kB |
| devalue + gzip | native | - | 12.1 µs | 6.4 µs | 🚀 **208 ns** | 🚀 **125 ns** | 🪶 **2 kB** | 🪶 **5.4 kB** |
| cbor-x + gzip | native | - | 4.3 µs | 2.8 µs | 🚀 **208 ns** | 🚀 **125 ns** | 4.6 kB | 5.4 kB |

### 2. Medium payload

Array of records, compressed with the default options: 3,400 records, 299.2 kB as JSON.

| Serializer | Stored as | Compressed size | Miss Node.js | Miss Bun | Hit Node.js | Hit Bun | Memory Node.js | Memory Bun |
| --- | --- | --: | --: | --: | --: | --: | --: | --: |
| No compression | native | - | 584 ns | 417 ns | 167 ns | 125 ns | 575.8 kB | 486.7 kB |
| json + gzip | compressed | 27.8 kB | ⚡ **1.17 ms** | ⚡ **573.5 µs** | 639.0 µs | 400.4 µs | 29.3 kB | 57 kB |
| superjson + gzip | compressed | 27.8 kB | 3.93 ms | 3.85 ms | 🚀 **638.2 µs** | 🚀 **391.7 µs** | 28.7 kB | 56.6 kB |
| devalue + gzip | compressed | 66.8 kB | 3.65 ms | 2.69 ms | 1.33 ms | 739.9 µs | 67.6 kB | 98.8 kB |
| cbor-x + gzip | compressed | 🪶 **22.9 kB** | 1.57 ms | 674.9 µs | 677.9 µs | 410.2 µs | 🪶 **24.7 kB** | 🪶 **54.9 kB** |

### 3. Large payload

Array of records, compressed with the default options: 44,000 records, 3.9 MB as JSON.

| Serializer | Stored as | Compressed size | Miss Node.js | Miss Bun | Hit Node.js | Hit Bun | Memory Node.js | Memory Bun |
| --- | --- | --: | --: | --: | --: | --: | --: | --: |
| No compression | native | - | 625 ns | 417 ns | 208 ns | 125 ns | 8.4 MB | 6.4 MB |
| json + gzip | compressed | 360.1 kB | ⚡ **15.2 ms** | ⚡ **7.45 ms** | 8.76 ms | 5.68 ms | 361 kB | 🪶 **0 B** |
| superjson + gzip | compressed | 360.1 kB | 59.3 ms | 50.2 ms | 8.47 ms | 5.72 ms | 360.9 kB | 721.5 kB |
| devalue + gzip | compressed | 848.6 kB | 66.5 ms | 49.6 ms | 22.3 ms | 11.0 ms | 849.3 kB | 1.7 MB |
| cbor-x + gzip | compressed | 🪶 **297.3 kB** | 19.8 ms | 8.45 ms | 🚀 **8.16 ms** | 🚀 **5.48 ms** | 🪶 **302.1 kB** | 702.3 kB |

### 4. Large payload with extended types

Same as large, with Date, BigInt, undefined and NaN values (json is not supported): 44,000 records, 6.9 MB as JSON.

| Serializer | Stored as | Compressed size | Miss Node.js | Miss Bun | Hit Node.js | Hit Bun | Memory Node.js | Memory Bun |
| --- | --- | --: | --: | --: | --: | --: | --: | --: |
| No compression | native | - | 791 ns | 417 ns | 167 ns | 125 ns | 16.1 MB | 11.3 MB |
| superjson + gzip | compressed | 1.2 MB | 408 ms | 230 ms | 154 ms | 106 ms | 1.2 MB | 2.4 MB |
| devalue + gzip | compressed | 1.4 MB | 139 ms | 89.8 ms | 49.0 ms | 26.8 ms | 1.4 MB | 2.9 MB |
| cbor-x + gzip | compressed | 🪶 **588.7 kB** | ⚡ **36.7 ms** | ⚡ **20.9 ms** | 🚀 **13.6 ms** | 🚀 **8.00 ms** | 🪶 **593.7 kB** | 🪶 **1.2 MB** |

## Hono (medium payload)

`createHonoXCache` with a JSON response (`JsonSerializer`) and an `XMemCache` instance compressing with different serializers, 299.2 kB as JSON, response body read by the client. Compressed entries are sent as-is (`Content-Encoding: gzip`) when their bytes are JSON: `JsonSerializer`, or superjson with JSON detection (`detectJson`, default) when the data has no extended types. Otherwise they are decompressed, deserialized and serialized to JSON on each request.

| Setup | Hit sent as-is | Miss Node.js | Miss Bun | Hit gzip Node.js | Hit gzip Bun | Hit identity Node.js | Hit identity Bun |
| --- | --- | --: | --: | --: | --: | --: | --: |
| No cache (c.json) | - | 615.4 µs | 188.9 µs | 602.9 µs | 191.0 µs | 604.7 µs | 189.6 µs |
| json + gzip | ✅ yes | ⚡ **1.23 ms** | ⚡ **593.0 µs** | 8.1 µs | 🚀 **1.6 µs** | 414.3 µs | 189.5 µs |
| superjson + gzip | ✅ yes | 3.93 ms | 3.35 ms | 🚀 **7.8 µs** | 1.7 µs | 🚀 **408.3 µs** | 🚀 **187.0 µs** |
| superjson + gzip (detectJson: false) | ❌ no | 5.12 ms | 3.96 ms | 1.15 ms | 604.1 µs | 1.16 ms | 600.3 µs |
| cbor-x + gzip | ❌ no | 2.95 ms | 1.46 ms | 1.19 ms | 630.5 µs | 1.17 ms | 637.8 µs |

- **No cache (c.json)**: Hono c.json(payload) on each request, baseline (the payload is already in memory, a real handler also pays the data fetching).
- **json + gzip**: Compressed JSON, sent as-is.
- **superjson + gzip**: Plain data detected and stored as JSON (detectJson), sent as-is.
- **superjson + gzip (detectJson: false)**: Stored in the superjson format: decompressed, deserialized and serialized to JSON.
- **cbor-x + gzip**: Stored as CBOR: decompressed, deserialized and serialized to JSON.

"Hit gzip": client accepting gzip (`Accept-Encoding: gzip`), "Hit identity": client not accepting it (the compressed bytes are decompressed). "No cache" is the baseline (same time for miss and hits), not a candidate for the icons.
