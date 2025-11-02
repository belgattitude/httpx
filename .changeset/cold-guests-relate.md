---
"@httpx/xcache": patch
---

Update minimum peer-deps for devalue and superjson to latest. They bring fixes and some 
speedup.

```json
{
  "peerDependencies": {
    "devalue": "^5.4.2",
    "superjson": "^2.2.5"
  },
  "peerDependenciesMeta": {
    "devalue": {
      "optional": true
    },
    "superjson": {
      "optional": true
    }
  }
}
```