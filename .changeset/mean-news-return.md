---
"@httpx/dsn-parser": patch
---

fix convertJdbcToDsn to throw TypeError is the jdbc param isn't a valid string
