---
"@httpx/xcache": patch
---

Document how to choose a serializer in the README.

- A serializer is only needed when compression is enabled, without a compressor values are stored as-is.
- Memory gains per serializer (json, superjson, superjson+dedupe, devalue) versus uncompressed live objects: from -86% to -96% on the benchmarked datasets.
- Performance and size comparison table with recommendations, advantages and drawbacks of each serializer, and how to enable superjson `dedupe` with a custom serializer.
- Benchmarks updated for Node 26.12.0 and Bun 1.4.3.
