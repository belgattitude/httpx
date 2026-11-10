---
"@httpx/memo-intl": minor
---

Add `createMIntl` and `getOrCreateMIntl`, recommend the factory over `MIntl`.

- `createMIntl(options?)` creates an independent instance with its own LRU cache (now the recommended way).
- `getOrCreateMIntl(name?, options?)` returns a named instance stored on `globalThis`. The first call sets its options; later calls with different options log a warning (except when `NODE_ENV` is `production`).
- New memoized constructors: `DisplayNames` and `DurationFormat` (`Intl.DurationFormat` requires Node 23+).
- Behavior change: `MIntl` is now the `"default"` `globalThis` instance, shared by every copy of the library in the process, and its LRU size is 50 (was 100). Use `createMIntl({ lru: { maxSize: 100 } })` to keep the previous size.
- Library authors should use a private `createMIntl()` instance rather than `MIntl` to avoid competing with the app's cache.
- Docs: cached instances mostly hold native ICU memory (from ~1 KB for a `NumberFormat` to ~30 KB for a `DateTimeFormat` on Node), so size `maxSize` to the locale/options combinations you actually use.

See the [upgrade guide](https://github.com/belgattitude/httpx/blob/main/packages/memo-intl/UPGRADE.md).

```typescript
import { createMIntl, getOrCreateMIntl } from "@httpx/memo-intl";

const intl = createMIntl({ lru: { maxSize: 200 } });
const sharedIntl = getOrCreateMIntl("@my-scope/my-lib", {
  lru: { maxSize: 10 },
});
```
