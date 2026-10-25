---
"@httpx/xcache": minor
---

Add `CborxSerializer`, a binary serializer based on [cbor-x](https://github.com/kriszyp/cbor-x) (optional peer dependency).

```typescript
import { CacheCompress } from "@httpx/xcache";
import { CborxSerializer } from "@httpx/xcache/cbor-x";

const compressor = new CacheCompress({
  serializer: new CborxSerializer(),
  algorithm: "gzip",
});
```

It supports extended types (Date, BigInt, Map, Set, undefined, NaN, typed arrays, shared and cyclic references) and is the fastest and smallest serializer with them. Defaults: `useRecords: true` (only readable by cbor-x) and `structuredClone: true`, other cbor-x options can be passed to the constructor.

- New `ICacheBinarySerializer` interface (`binary: true`, `serialize` returns a `Uint8Array`), supported by `CacheCompress` (not as the `createHonoXCache` response serializer).
- `ICacheSerializer` gets an optional `binary?: false` discriminant.
