---
'@httpx/exception': minor
---

Add field error validation support for 422 HttpUnprocessableEntity

Example:

```typescript
import { HttpUnprocessableEntity } from "@httpx/exception";

const e422 = new HttpUnprocessableEntity({
  errors: [
    {
      message: "Invalid email",
      path: "email",
      code: "invalid_email",
    },
    {
      message: "Invalid address",
      path: ["addresses", 0, "line1"],
      code: "empty_string",
    },
  ],
});

console.log(e422.errors);
```
