[**@httpx/assert v0.16.2**](../../README.md)

***

[@httpx/assert](../../README.md) / [string.guards](../README.md) / isParsableStrictIsoDateZ

# Function: isParsableStrictIsoDateZ()

> **isParsableStrictIsoDateZ**(`v`): `v is ParsableStrictIsoDateZ`

Defined in: [string.guards.ts:46](https://github.com/belgattitude/httpx/blob/4dae8c09c15139f4a822e2110336093570f143a3/packages/assert/src/string.guards.ts#L46)

Check if a value is a string that contains an ISO-8601 date time in 'YYYY-MM-DDTHH:mm:ss.sssZ'
format (UTC+0 / time). This check allow the value to be safely passed to `new Date()`or `Date.parse()`
without parser or timezone mis-interpretations. 'T' and 'Z' checks are done in a case-insensitive way.

```typescript
isParsableStrictIsoDateZ('2023-12-28T23:37:31.653Z'); // ✅ true
isParsableStrictIsoDateZ('2023-12-29T23:37:31.653z'); // ✅ true  (case-insensitive works)
isParsableStrictIsoDateZ('2023-12-28T23:37:31.653');  // ❌ false (missing 'Z')
isParsableStrictIsoDateZ('2023-02-29T23:37:31.653Z'); // ❌ false (No 29th february in 2023)

const dateStr = '2023-12-29T23:37:31.653Z';
if (isParsableStrictIsoDateZ(dateStr)) {
  const date = new Date(dateStr);
  const timestampNumber = Date.parse(dateStr);
} else {
  // invalid format
}
```

## Parameters

### v

`unknown`

## Returns

`v is ParsableStrictIsoDateZ`

## See

 - https://en.wikipedia.org/wiki/ISO_8601
 - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
 - https://en.wikipedia.org/wiki/Coordinated_Universal_Time
