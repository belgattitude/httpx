---
"@httpx/exception": major
---

Stack traces won't be serialized anymore by default as they
might contain sensitive information in production.  

For development or logging, it's possible to opt-in stack serialization selectively in 
`convertToSerializable`, `createFromSerializable`, `toJson` and `fromJson` functions thanks
to the `SerializerParams.includeStack` param.

```typescript
import { fromJson, toJson } from '@httpx/exception';

const json = toJson(new HttpException(500), {
  includeStack: process.env.NODE_ENV === 'development',
});

const e = fromJson(json, {
  includeStack: process.env.NODE_ENV === 'development',
});
```