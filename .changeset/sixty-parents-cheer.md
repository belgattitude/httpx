---
'@httpx/dsn-parser': patch
---

Reduce total bundle size from 1.30kb to 1.13kb mingzip

dsn-parser tree-shakes well, 1.13kb is the size of the full import.
