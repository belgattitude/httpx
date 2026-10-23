---
"@httpx/xcache": minor
---

Add abort signal support to `runAsync` and `runAsyncEntry`.

```typescript
const { data } = await xMemCache.runAsync({
  key: ["/api/products", { id }],
  // 👇 the function receives the signal
  fn: ({ signal }) =>
    fetch(`/api/products/${id}`, { signal }).then((r) => r.json()),
  signal: AbortSignal.timeout(5_000),
});
```

- The call rejects with the signal reason as soon as it's aborted (even if the function ignores the signal), already aborted signals reject immediately, cache hits included.
- Results of aborted executions are never stored.
- With dedupe, aborting a call only rejects that call: the shared execution is aborted when all the waiting calls are aborted, and an aborted execution is never joined.
- Hono: pass `signal: c.req.raw.signal` to abort when the client disconnects, a `499` response is returned instead of throwing.
