---
"@httpx/exception": minor
---

Support `instanceof` across multiple copies of the same major version (ie: esm + cjs builds loaded side by side, duplicated installs).

Exceptions are now branded with a global `Symbol.for("@httpx/exception-v{major}")` symbol (non-enumerable, not serialized) and `HttpException[Symbol.hasInstance]` falls back to it when the regular prototype check fails. Typeguards (`isHttpException`, `isHttpClientException`, `isHttpServerException`), the serializer and `tryOrFail` benefit from it.

```typescript
import { HttpNotFound, isHttpException } from "@httpx/exception";
const { HttpNotFound: CjsHttpNotFound } = require("@httpx/exception");

const e = new CjsHttpNotFound();
e instanceof HttpNotFound; // 👉 true (was false)
isHttpException(e); // 👉 true (was false)
```

Exceptions from a different major version are intentionally not recognized. Bundle size increases by ~170b (compressed).
