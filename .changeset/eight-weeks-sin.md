---
'@httpx/exception': minor
---

Add support for HttpUnprocessableEntity.issues in serializer.

```typescript
import { fromJson, toJson } from '@httpx/exception/serializer';

const e422 = new HttpUnprocessableEntity({
    message: 'Validation failed',
    issues: [
        {
            message: 'Invalid address',
            path: ['addresses', 0, 'line1'],
            code: 'empty_string',
        },
    ],
});

const json = toJson(e422);
const js = fromJson(json);

expect((js as HttpUnprocessableEntity).issues).toStrictEqual(e422.issues);
expect(js).toStrictEqual(e422);

```
