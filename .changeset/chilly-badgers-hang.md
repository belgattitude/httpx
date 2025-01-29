---
"@httpx/lru": minor
---

Add getOrInsert method

```typescript
const lru = new TinyLRU({ maxSize: 2 });
lru.set('key1', 'value1');
lru.getOrInsert('key1', 'value2'); // 👈 will not overwrite the value
console.log(lru.get('key1')); // value1
```
