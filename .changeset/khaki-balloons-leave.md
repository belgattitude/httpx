---
"@httpx/assert": minor
---

Improve assertion error messages (now typed as TypeError)

Assertions errors includes information about received value. They're
now typed as native TypeError.

```typescript
expect(() => assertUuid('123')).toThrow(
  new TypeError('Value is expected to be an uuid, got: string(3)')
);
expect(() => assertUuid(false, undefined, { version: 1 })).toThrow(
  new TypeError('Value is expected to be an uuid v1, got: boolean(false)')
);
expect(() => assertUuidV1(Number.NaN)).toThrow(
  new TypeError('Value is expected to be an uuid v1, got: NaN')
);
expect(() => assertUuidV3(new Error())).toThrow(
  new TypeError('Value is expected to be an uuid v3, got: Error')
);
expect(() => assertUuidV4(new Date())).toThrow(
  new TypeError('Value is expected to be an uuid v4, got: Date')
);
expect(() => assertUuidV5(() => {})).toThrow(
  new TypeError('Value is expected to be an uuid v5, got: function')
);
```