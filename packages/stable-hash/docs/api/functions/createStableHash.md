[**@httpx/stable-hash v0.1.0**](../README.md)

***

[@httpx/stable-hash](../README.md) / createStableHash

# Function: createStableHash()

> **createStableHash**\<`T`\>(`value`, `options`?): `Promise`\<`Result`\>

Create a stable sha-256/hexadecimal hash from a value. Useful for caching
or memoization.

Object keys are sorted to maintain equality between objects with
the same keys but in different order.

## Type Parameters

• **T** *extends* `SupportedDataTypesRW`

## Parameters

### value

`T`

### options?

`CreateStableHashOptions`

## Returns

`Promise`\<`Result`\>

## Example

```typescript
import { createStableHash } from '@httpx/stable-hash';

const params = {
  key8: 'a string',
  key1: 1,
  key3: true,
  key2: [3, 2, 1],
  key7: {
    key2: true,
    key1: new Date('2025-02-11T08:58:32.075Z'),
  },
};

const result = await createStableHash(params);
if (!result.success) {
  throw result.error;
}
const hash = result.hash;
// -> 'fb17a6300efcf62ae80708e2a672aee581b7f0dd7c6a9a7a748218846c679394'
```
