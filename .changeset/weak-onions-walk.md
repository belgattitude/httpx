---
"@httpx/plain-object": minor
---

Exclude static built-in classes (Atomics, JSON, Math) from being passed as argument.

This change should not produce any runtime change, but will now produce a typescript error 
if one of these classes is passed as argument. 

Note that it's totally an edge case that probably never happens in real world code.

```typescript
import { isPlainObject } from '@httpx/plain-object';

// ⚠️ Now produce a typescript error
isPlainObject(Math);
// TS2345: Argument of type Math | JSON | Atomics is not assignable to parameter of type never
// Type Math is not assignable to type never

// Same for Atomics and JSON static built-in classes
isPlainObject(Atomics);
isPlainObject(JSON);
```
