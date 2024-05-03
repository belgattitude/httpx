---
"@httpx/assert": minor
---

Add generic convenience typing in isPlainObject

You can now pass a generic type in isPlainObject and assertPlainObject. 

It allows to get typescript autocompletion after running isPlainObject<CustomType>(v).
But notice all keys becomes optional and values are set to unknown in this case to reflect
that no runtime check was done.

#### isPlainObject

| Name                  | Type                                                                           | Comment |
|-----------------------|--------------------------------------------------------------------------------|---------|
| isPlainObject<T?>     | `PlainObject<T extends Record<string, unknown> = Record<string, unknown>` |         |
| assertPlainObject<T?> | `PlainObject<T extends Record<string, unknown> = Record<string, unknown>` |         |

```typescript
import { isPlainObject, assertPlainObject } from '@httpx/assert';

// Simple case: without generic value
isPlainObject({cwol: true}); // 👈 true
isPlainObject(new Promise()); // 👈 false
assertPlainObject({});

// With generic value (unchecked at runtime!)
type CustomType = {
  name: string;
  deep: {
    yes: boolean | null;
  };
};
const value = {
  name: 'hello',
  deep: {
    yes: true,
  },
} as unknown;

if (isPlainObject<CustomType>(value)) {
  // Notice it's a deep partial to allow autocompletion
  const test = value?.deep?.yes; // 👈  yes will be unknown (no runtime check)
}
```
