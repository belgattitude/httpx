---
"@httpx/lru": minor
---

Add iterator symbol

```typescript
const lru = new TinyLRU({ maxSize: 2 });
lru.set('key1', 'value1');
lru.set('key2', 'value2');
lru.set('key3', 'value3');
// trigger a get to move key2 to the head
lru.get('key2');
const results = [];
// iterate over the cache entries
for (const [key, value] of lru) {
  results.push([key, value]);
}
expect(results).toStrictEqual([
   ['key3', 'value3'], // Least recently used
   ['key2', 'value2'], // Most recently used
]);
```