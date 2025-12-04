---
"prisma-exception": patch
"@httpx/plain-object": patch
"@httpx/stable-hash": patch
"@httpx/dsn-parser": patch
"@httpx/jwt-verify": patch
"@httpx/exception": patch
"@httpx/memo-intl": patch
"@httpx/compress": patch
"@httpx/json-api": patch
"@httpx/assert": patch
"@httpx/encode": patch
"@httpx/xcache": patch
"@httpx/treeu": patch
"@httpx/hash": patch
"@httpx/lru": patch
---

Rebuild with latest esbuild 0.27.1

See upstream fixes: [esbuild v0.27.1 release notes](https://github.com/evanw/esbuild/releases/tag/v0.27.1)

PS: due to a failing ci action, the correct changes can be found in [#2648](https://github.com/belgattitude/httpx/pull/2648)