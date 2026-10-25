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
| Small payload | **1.59× faster** | **1.51× faster** | 1.32× more |
| Medium payload | **1.70× faster** | **1.74× faster** | 1.45× more |
| Large payload | **1.67× faster** | **1.58× faster** | 1.70× more |
| Large payload with extended types | **1.64× faster** | **1.54× faster** | 1.30× more |
| **Overall** | **1.65× faster** | **1.59× faster** | 1.44× more |

Best serializer per scenario (Node.js, excluding "No compression"):

| Scenario | ⚡ Fastest miss | 🚀 Fastest hit | 🪶 Smallest memory |
| --- | --- | --- | --- |
| Small payload | json + gzip | all similar | devalue + gzip |
| Medium payload | json + gzip | json + gzip | cbor-x + gzip |
| Large payload | json + gzip | superjson + gzip | cbor-x + gzip |
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
| No compression | native | - | 875 ns | 625 ns | 250 ns | 208 ns | 3.8 kB | 3.2 kB |
| json + gzip | native | - | ⚡ **4.7 µs** | ⚡ **2.1 µs** | 🚀 **333 ns** | 🚀 **209 ns** | 4.6 kB | 5.4 kB |
| superjson + gzip | native | - | 32.4 µs | 28.4 µs | 334 ns | 🚀 **209 ns** | 4 kB | 5.4 kB |
| devalue + gzip | native | - | 19.0 µs | 10.2 µs | 🚀 **333 ns** | 🚀 **209 ns** | 🪶 **2 kB** | 5.4 kB |
| cbor-x + gzip | native | - | 6.7 µs | 4.3 µs | 334 ns | 🚀 **209 ns** | 4.6 kB | 🪶 **5.3 kB** |

### 2. Medium payload

Array of records, compressed with the default options: 1,000 records, 88 kB as JSON.

| Serializer | Stored as | Compressed size | Miss Node.js | Miss Bun | Hit Node.js | Hit Bun | Memory Node.js | Memory Bun |
| --- | --- | --: | --: | --: | --: | --: | --: | --: |
| No compression | native | - | 916 ns | 625 ns | 292 ns | 208 ns | 169 kB | 136.2 kB |
| json + gzip | compressed | 8.3 kB | ⚡ **559.2 µs** | ⚡ **224.9 µs** | 🚀 **326.8 µs** | 🚀 **179.5 µs** | 9.6 kB | 13 kB |
| superjson + gzip | compressed | 8.3 kB | 1.75 ms | 1.65 ms | 333.6 µs | 182.9 µs | 9.1 kB | 🪶 **12.9 kB** |
| devalue + gzip | compressed | 19.6 kB | 1.58 ms | 1.00 ms | 660.9 µs | 340.1 µs | 20.5 kB | 41.5 kB |
| cbor-x + gzip | compressed | 🪶 **6.7 kB** | 725.8 µs | 311.4 µs | 342.2 µs | 191.9 µs | 🪶 **8 kB** | 16.6 kB |

### 3. Large payload

Array of records, compressed with the default options: 11,000 records, 974 kB as JSON.

| Serializer | Stored as | Compressed size | Miss Node.js | Miss Bun | Hit Node.js | Hit Bun | Memory Node.js | Memory Bun |
| --- | --- | --: | --: | --: | --: | --: | --: | --: |
| No compression | native | - | 917 ns | 625 ns | 292 ns | 208 ns | 1.9 MB | 1.5 MB |
| json + gzip | compressed | 90.3 kB | ⚡ **5.94 ms** | ⚡ **2.74 ms** | 3.08 ms | 1.98 ms | 91.1 kB | 181.9 kB |
| superjson + gzip | compressed | 90.3 kB | 21.8 ms | 18.4 ms | 🚀 **3.08 ms** | 🚀 **1.97 ms** | 91.2 kB | 181.9 kB |
| devalue + gzip | compressed | 213.5 kB | 21.5 ms | 15.3 ms | 6.82 ms | 3.95 ms | 214.3 kB | 421.9 kB |
| cbor-x + gzip | compressed | 🪶 **74.4 kB** | 7.89 ms | 3.22 ms | 3.36 ms | 2.02 ms | 🪶 **77.4 kB** | 🪶 **175.7 kB** |

### 4. Large payload with extended types

Same as large, with Date, BigInt, undefined and NaN values (json is not supported): 11,000 records, 1.7 MB as JSON.

| Serializer | Stored as | Compressed size | Miss Node.js | Miss Bun | Hit Node.js | Hit Bun | Memory Node.js | Memory Bun |
| --- | --- | --: | --: | --: | --: | --: | --: | --: |
| No compression | native | - | 917 ns | 625 ns | 292 ns | 208 ns | 3.9 MB | 2.8 MB |
| superjson + gzip | compressed | 321.9 kB | 139 ms | 74.8 ms | 52.6 ms | 35.4 ms | 322.7 kB | 616.1 kB |
| devalue + gzip | compressed | 359.4 kB | 44.9 ms | 27.9 ms | 18.4 ms | 10.8 ms | 360.2 kB | 359.4 kB |
| cbor-x + gzip | compressed | 🪶 **147.1 kB** | ⚡ **13.3 ms** | ⚡ **7.98 ms** | 🚀 **4.79 ms** | 🚀 **3.06 ms** | 🪶 **150.5 kB** | 🪶 **318.2 kB** |
