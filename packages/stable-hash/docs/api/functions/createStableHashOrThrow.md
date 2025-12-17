[**@httpx/stable-hash v0.3.7**](../README.md)

---

[@httpx/stable-hash](../README.md) / createStableHashOrThrow

# Function: createStableHashOrThrow()

> **createStableHashOrThrow**\<`T`\>(`value`, `options?`): `Promise`\<`string`\>

Create a stable hash (sha-256) from a given value useful for caching or memoization.

## Type Parameters

### T

`T` _extends_ `SupportedDataTypesRW`

## Parameters

### value

`T`

### options?

`CreateStableHashOptions`

## Returns

`Promise`\<`string`\>

## Example

```typescript
import { createStableHashOrThrow } from "@httpx/stable-hash";

const params = {
  key8: "a string",
  key1: 1,
  key3: true,
  key2: [3, 2, 1],
  key7: {
    key2: true,
    key1: new Date("2025-02-11T08:58:32.075Z"),
  },
};

try {
  const hash = await createStableHashOrThrow(params, {
    // By default SHA-256 is used (SHA-512 available)
    algorithm: "SHA-256",
    // By default the hash is encoded in hexadecimal
    encoding: "hexa",
  });
  // -> 'fb17a6300efcf62ae80708e2a672aee581b7f0dd7c6a9a7a748218846c679394'
} catch (e) {
  // TypeError in case of an unserializable data type
}
```
