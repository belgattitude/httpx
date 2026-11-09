## Upgrade

### Recommendations in v2.1

#### Prefer `createMIntl()` over the `MIntl` singleton

`createMIntl()` returns an independent memoized instance with its own LRU cache. Create it once (ie: at module level) and import it where needed. The API is the same as `MIntl`, so the change is limited to the import.

```typescript
// before
import { MIntl } from "@httpx/memo-intl";

const price = MIntl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
}).format(10.99);
```

```typescript
// after: ie src/lib/intl.ts
import { createMIntl } from "@httpx/memo-intl";

export const intl = createMIntl({ lru: { maxSize: 50 } });
```

```typescript
import { intl } from "@/lib/intl";

const price = intl
  .NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  })
  .format(10.99);
```

Why:

- The cache size can be tuned to the number of locale/options combinations your app uses.
- The cache is not shared with other libraries that also depend on `@httpx/memo-intl`, so `cache.clear()` and `cache.stats()` only concern your own formatters.
- Tests can create a fresh instance instead of clearing a global cache.

`MIntl` is still exported and supported. If you need a cache shared across bundles or packages (ie: several copies of the library loaded in the same process), use `getOrCreateMIntl("my-app", { lru: { maxSize: 200 } })`, which stores named instances on `globalThis`. The first call for a name sets its options; a later call with different options logs a warning (except when `NODE_ENV` is `production`).

#### Library authors

If you publish a library that uses `MIntl`, switch to a private `createMIntl({ lru: { maxSize: 10 } })` instance (or `getOrCreateMIntl("@my-scope/my-lib")`). `MIntl` is now the `globalThis` default instance shared with the app, so your formatters would compete with the app's entries in the same LRU cache. See [Usage in libraries](./README.md#usage-in-libraries).

#### Behavior changes of `MIntl`

- `MIntl` is now the `"default"` instance stored on `globalThis` (`getOrCreateMIntl()` returns the same object), so copies of the library loaded in the same process share one cache.
- Its LRU cache holds at most 50 instances, down from 100. If your app relies on more than 50 locale/options combinations, use `createMIntl({ lru: { maxSize: 100 } })` to keep the previous size.

#### New constructors

`intl.DisplayNames()` and `intl.DurationFormat()` are now available. `Intl.DurationFormat` requires a supporting runtime (Node 23+, Bun, Chrome 129+, Firefox 136+, Safari 16.4+).
