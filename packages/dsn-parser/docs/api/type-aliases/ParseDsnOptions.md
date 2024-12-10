[**@httpx/dsn-parser v1.8.5**](../README.md)

***

[@httpx/dsn-parser](../README.md) / ParseDsnOptions

# Type Alias: ParseDsnOptions

> **ParseDsnOptions**: `object`

## Type declaration

### lowercaseDriver?

> `optional` **lowercaseDriver**: `boolean`

Whether to lowercase parsed driver name, default: false

### overrides?

> `optional` **overrides**: `Omit`\<`Partial`\<[`ParsedDsn`](ParsedDsn.md)\>, `"params"`\>

Overrides parsed values by those one (except query params)
