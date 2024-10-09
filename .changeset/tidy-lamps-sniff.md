---
"@httpx/plain-object": major
---

isPlainObject allows static built-in classes: for Atomic, Math, Json.

The changes shouldn't affect most users, but it's worth noting that the `isPlainObject`
function no longer consider static build-in objects as plain objects (Math, JSON, Atomics).

This fix an issue with `{ [Symbol.toStringTag]: 'tag' }` that wasn't considered as a plain object.

If the behaviour is needed there's a new `isStaticBuiltInClass` function that can be used to check
if a value is a static built-in class (Math, JSON, Atomics).

```typescript
import { isPlainObject, isStaticBuiltInClass } from '@httpx/plain-object';
const v = Math; // or Atomics or JSON
if (isPlainObject(v) && !isStaticBuiltInClass(v)) {
  console.log('v is a plain object but not a static built-in class');
}
```