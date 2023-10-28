---
'@httpx/exception': patch
---

Fix createHttpException that wasn't allowing issues on HttpUnprocessableEntity

```typescript
const e422 = createHttpException(422, {
    message: 'Validation failed',
    issues: [
        {
            message: 'Invalid address',
            path: ['addresses', 0, 'line1'],
            code: 'empty_string',
        },
    ],
});
```