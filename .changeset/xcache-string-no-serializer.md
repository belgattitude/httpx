---
"@httpx/xcache": minor
---

`CacheCompress` never calls the serializer for strings and numbers: numbers are never compressed (trivial values), strings are compressed as-is (`meta.serializer: "none"`) and returned without deserialization. Compressed strings are smaller and faster to read (ie: no JSON quoting/escaping).

Note for `createHonoXCache`: compressed string results (`serializer: "none"`) are decompressed and serialized for the response, the compressed bytes are only sent as-is (`Content-Encoding`) for data compressed with the response serializer.
