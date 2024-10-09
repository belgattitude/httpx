---
"@httpx/plain-object": major
---

Bundle size reduction from 101B to 75B when importing isPlainObject from @httpx/plain-object

```
  Only { isPlainObject } (ESM)
  Package size is 1 B less than limit
  Size limit: 76 B
  Size:       75 B with all dependencies, minified and brotlied

  Only { assertPlainObject } (ESM)
  Package size is 1 B less than limit
  Size limit: 133 B
  Size:       132 B with all dependencies, minified and brotlied

  Import { assertPlainObject, isPlainObject } (ESM)
  Size:       139 B with all dependencies, minified and brotlied
```
