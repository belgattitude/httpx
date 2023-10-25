---
'@httpx/exception': minor
---

Reduce drastically bundle size (use es2022)

Importing a single exception starts at 377 bytes, subsequent ones will add less than 50 bytes in average.

> PS: if you use exceptions outside of nodejs and need to support legacy browsers
> a lot of frameworks allows to transpile modules (ie nextjs).

```
✔ Adding to empty webpack project
  
  ESM (import everything *)
  Package size is 395 B less than limit
  Size limit: 2.46 kB
  Size:       2.06 kB with all dependencies, minified and gzipped
  
  ESM (only HttpNotFound exception)
  Package size is 965 B less than limit
  Size limit: 1.42 kB
  Size:       450 B   with all dependencies, minified and gzipped
  
  ESM (two exceptions: HttpNotFound + HttpInternalServerError)
  Package size is 935 B less than limit
  Size limit: 1.44 kB
  Size:       505 B   with all dependencies, minified and gzipped
  
  ESM (only isHttpException)
  Package size is 1.03 kB less than limit
  Size limit: 1.41 kB
  Size:       377 B   with all dependencies, minified and gzipped
  
  ESM (only createHttpException)
  Package size is 571 B less than limit
  Size limit: 2 kB
  Size:       1.43 kB with all dependencies, minified and gzipped
  
  ESM ({ toJson })
  Package size is 1.11 kB less than limit
  Size limit: 1.89 kB
  Size:       779 B   with all dependencies, minified and gzipped
  
  ESM ({ fromJson })
  Package size is 607 B less than limit
  Size limit: 2.5 kB
  Size:       1.89 kB with all dependencies, minified and gzipped
  
  CJS (require everything *)
  Package size is 416 B less than limit
  Size limit: 3.05 kB
  Size:       2.63 kB with all dependencies, minified and gzipped
  
  CJS (only isHttpException)
  Package size is 598 B less than limit
  Size limit: 2.5 kB
  Size:       1.9 kB with all dependencies, minified and gzipped

```