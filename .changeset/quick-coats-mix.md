---
"@httpx/assert": minor
---

Improve PlainObject convenience typings when passing a generic.

```typescript
import { isPlainObject, assertPlainObject } from '@httpx/assert';

type TValue = {
  key: string,
  deep: {
    connected: boolean
  }
}
const value = {
  key: 'hello',
  deep: {
    connected: true 
  }  
} as unknown;

// Without generic

assertPlainObject(value);
// value is Record<string, unknown>
// -> no typing

value.key; // unknown, no runtime error
value.anything; // unknown, no runtime error
// value.deep.connected // not possible without explicit typing 

// With generic

assertPlainObject<TValue>(value);

value.key; // unknown, no runtime error
value.anything; // unknown, no runtime error
value.deep?.connected; // connected is 'unknown', typescript suggest the type
```
