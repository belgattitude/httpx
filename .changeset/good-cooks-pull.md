---
"@httpx/plain-object": major
---

Fix issue with plain objects that contains a [Symbol.iterator]

`isPlainObject` now accepts `[Symbol.iterator]` as a valid property for plain objects.

```typescript 
const v = {
  [Symbol.iterator]: function* () {
    yield 1;
  },
} // Since v2 considered as a plain object 
```

Which allows to add iterators to plain objects.
