---
"@httpx/xcache": minor
---

Raise `CacheCompress` defaults to avoid compressing small payloads, where the cpu cost outweighs the memory saving:

- `minimumByteSaving`: 32 KB (was 16 KB), compression is skipped when it saves less than 32 KB.
- `minimumStringLength`: 16K characters (was 1000). It's now also checked on the serialized data (not only on string data): payloads serializing to less than this are never compressed.

Small payloads are skipped before compression (no gzip/deflate work) when the serialized data is shorter than `minimumStringLength`, or shorter than `minimumByteSaving` (the saving can't exceed it).

To keep the previous behaviour:

```typescript
new CacheCompress({
  serializer,
  algorithm: "gzip",
  minimumByteSaving: 16_384,
  minimumStringLength: 1000,
});
```
