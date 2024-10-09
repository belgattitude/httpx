---
"@httpx/plain-object": major
---

Small performance increase

```
@httpx/plain-object: `isPlainObject(v)` - bench/comparative.bench.ts > Compare calling isPlainObject with 110x mixed types values
 1.11x faster than (sindresorhus/)is-plain-obj: `isPlainObj(v)`
 1.79x faster than @sindresorhus/is: `is.plainObject(v)`
 2.29x faster than (jonschlinkert/)is-plain-object: `isPlainObject(v)`
 14.66x faster than estoolkit:  `isPlainObject(v)`
 73.82x faster than lodash-es: `_.isPlainObject(v)`
```
