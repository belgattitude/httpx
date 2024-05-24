[**@httpx/assert v0.12.1**](../../README.md) • **Docs**

***

[@httpx/assert v0.12.1](../../README.md) / [string.guards](../README.md) / isParsableStrictIsoDateZ

# Function: isParsableStrictIsoDateZ()

> **isParsableStrictIsoDateZ**(`v`): `v is ParsableStrictIsoDateZ`

Checks if the value is a string containing a valid ISO-8601 date time
with microseconds that ends with 'z' representing UTC+0 timezone (aka zulu time).
Format is 'YYYY-MM-DDTHH:mm:ss.sssZ'. Datetime is checked for validity.

```typescript
isParsableStrictIsoDateZ('2023-12-29T23:37:31.653z')
```

## Parameters

• **v**: `unknown`

## Returns

`v is ParsableStrictIsoDateZ`

## Link

https://en.wikipedia.org/wiki/ISO_8601

## Link

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString

## Link

https://en.wikipedia.org/wiki/Coordinated_Universal_Time

## Source

[string.guards.ts:35](https://github.com/belgattitude/httpx/blob/9af23c30700a45e9eb95108b7ac53f133f16092b/packages/assert/src/string.guards.ts#L35)
