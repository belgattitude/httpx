---
"@httpx/xcache": minor
---

Breaking: serializers requiring an optional peer dependency moved to their own entry.

The root entry imported `superjson` and `devalue`, so importing `@httpx/xcache` failed (ie: node, `ERR_MODULE_NOT_FOUND`) when one of these optional peer dependencies wasn't installed. The root entry now has no peer dependency import.

```typescript
// Before
import { SuperjsonSerializer, DevalueSerializer } from "@httpx/xcache";
import { CborxSerializer } from "@httpx/xcache/cbor-x";
import { DevalueSerializer } from "@httpx/xcache/devalue";
// After
import { SuperjsonSerializer } from "@httpx/xcache/superjson";
```

`JsonSerializer` and the interfaces (`ICacheSerializer`, `ICacheBinarySerializer`...) are still exported by `@httpx/xcache`.
