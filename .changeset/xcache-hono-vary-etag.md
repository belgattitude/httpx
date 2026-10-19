---
"@httpx/xcache": patch
---

Hono helper fixes (from review):

- `Vary: Accept-Encoding` is now merged with a caller-provided `Vary` header (any casing) instead of overwriting it, ie: `Vary: Cookie` becomes `Vary: Cookie, Accept-Encoding`.
- A replacement cache entry (ie: `forceRevalidate`) always gets a more recent `createdAt` than the entry it replaces, so the ETag changes even when revalidated within the same millisecond (no stale `304`).
