---
"@httpx/plain-object": minor
---

`isPlainObject()` and `assertPlainObject()` now fail typecheck when given a static built-in namespace.

Static built-in namespaces pass the plain object runtime check (a trade-off kept for performance and size). When statically known, they are now rejected at typecheck:

```typescript
isPlainObject(Math); // ❌ typecheck error (still returns true at runtime)
isPlainObject(JSON); // ❌ typecheck error
isPlainObject(Atomics); // ❌ typecheck error
isPlainObject(Reflect); // ❌ typecheck error
isPlainObject(Intl); // ❌ typecheck error
isPlainObject(WebAssembly); // ❌ typecheck error
isPlainObject(Temporal); // ❌ typecheck error (when Temporal is available in your libs)
isPlainObject(Temporal.Now); // ❌ typecheck error
assertPlainObject(Math); // ❌ typecheck error

isPlainObject(value as unknown); // ✅ unchanged
isPlainObject<CustomType>(value); // ✅ unchanged
```

Inference and narrowing are unchanged, no runtime changes (same output, same performance).

**Breaking (types only)**: the minimum supported TypeScript version is now 5.7 (was 5.0).
