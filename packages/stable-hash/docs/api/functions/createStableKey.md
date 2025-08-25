[**@httpx/stable-hash v0.3.2**](../README.md)

***

[@httpx/stable-hash](../README.md) / createStableKey

# Function: createStableKey()

> **createStableKey**\<`T`\>(`value`, `options?`): `Result`

Create a stable key from a given value useful for caching or memoization.

Object keys are sorted to maintain equality between objects with
the same keys but in different order.

This function is

## Type Parameters

### T

`T` *extends* `SupportedDataTypesRW`

## Parameters

### value

`T`

### options?

`CreateStableKeyOptions`

## Returns

`Result`

## Example

```typescript
import { createStableKey } from '@httpx/stable-hash';

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

const result = createStableKey(params);
if (!result.success) {
  throw result.error;
}
const key = result.key;

// Will return a string containing
// "{"key1":1,"key2":[1,2,3],"key3":true,"key7":{"key1":"2025-02-11T08:58:32.075Z","key2":true},"key8":"a string"}"
```
