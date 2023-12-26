---
"@httpx/exception": minor
---

Add new typeguards: isErrorWithErrorStatusCode and isObjectWithErrorStatusCode

Those typeguards can be used in specific circumstances when an originating
error has a statusCode field which indicates by convention the preferred status 
to send.

```typescript
import { isErrorWithErrorStatusCode, createHttpException } from '@httpx/exception';

try {
  throw new (class extends Error {
    statusCode = 400;
  })();
} catch (e) {
  if (isErrorWithErrorStatusCode(e)) {
    throw createException(e.statusCode, 'Something wrong happened')
  }  
}
```


```typescript
const noSuchUser = {
  statusCode: 404
} satisfies ObjectWithStatusCode;

class NoSuchItem extends DomainError implements ObjectWithStatusCode {
  statusCode: 404
}

if (isObjectWithErrorStatusCode(noSuchUser)) {
  throw createException(e.statusCode, 'Nothing')
}
```

