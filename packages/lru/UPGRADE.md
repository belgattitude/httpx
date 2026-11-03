## Upgrade

### Deprecations in v0.17

#### TimeLruCache.expiresIn()

`expiresIn()` is deprecated and will be removed in a future version. Use `expiresAt()`, which returns the expiry time (epoch milliseconds) of an entry, including expired entries not evicted yet.

```typescript
// before
const remaining = lru.expiresIn("key1"); // undefined when missing or expired

// after
const expiresAt = lru.expiresAt("key1"); // undefined when missing
const remaining =
  expiresAt === undefined || expiresAt < Date.now()
    ? undefined
    : expiresAt - Date.now();
// to check if an entry is present and not expired, prefer has() or peek()
```

The same applies to `NullTimeLruCache` and the `ITimeLruCache` interface.
