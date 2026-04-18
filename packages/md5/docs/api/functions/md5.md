[**@httpx/md5 v1.0.3**](../README.md)

***

[@httpx/md5](../README.md) / md5

# Function: md5()

> **md5**(`text`): `string`

Create a MD5 hash of a string.

## Parameters

### text

`string`

## Returns

`string`

The MD5 hash of the input string as a hexadecimal string.

## Example

```typescript
import { md5 } from '@httpx/md5';

const hash = md5('Hello: 🌍🚀✨🦄');

// Hexadecimal RFC1321 / NodeJs string
// '8f11a08695d43b4f737a9706dffbf208'
```

## Throws

TypeError if the input is not a string
