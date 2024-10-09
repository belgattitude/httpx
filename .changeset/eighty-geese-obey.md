---
"@httpx/plain-object": major
---

Not 100% compatible with sindreshorsus/is-plain-obj anymore

The changes shouldn't affect most users, but it's worth noting that the `isPlainObject` 
function no longer consider static build-in objects as plain objects (Math, JSON, Atomics).

This fix an issue with `{ [Symbol.toStringTag]: 'tag' }` that wasn't considered as a plain object.

If the behaviour is needed there's a new `isStaticBuiltInClass` function that can be used to check
if a value is a static built-in class (Math, JSON, Atomics).

Another change to mention is that `isPlainObject` now accepts `[Symbol.iterator]`
as a valid property for plain objects.

```typescript 
const v = {
  [Symbol.iterator]: function* () {
    yield 1;
  },
} // Since v2 considered as a plain object 
```

Which allows to add iterators to plain objects.
