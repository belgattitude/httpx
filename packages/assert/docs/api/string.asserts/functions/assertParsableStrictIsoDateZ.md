[**@httpx/assert v0.15.2**](../../README.md)

***

[@httpx/assert](../../README.md) / [string.asserts](../README.md) / assertParsableStrictIsoDateZ

# Function: assertParsableStrictIsoDateZ()

> **assertParsableStrictIsoDateZ**(`v`, `msgOrErrorFactory`?): `asserts v is ParsableStrictIsoDateZ`

Defined in: [string.asserts.ts:64](https://github.com/belgattitude/httpx/blob/68e7ebef40f7182365676b3a21f99e398b93dd78/packages/assert/src/string.asserts.ts#L64)

Ensure a string that contains an ISO-8601 date time in 'YYYY-MM-DDTHH:mm:ss.sssZ'
format (UTC+0 / time). This check allow the value to be safely passed to `new Date()`or `Date.parse()`
without parser or timezone mis-interpretations. 'T' and 'Z' checks are done in a case-insensitive way.

```typescript
assertParsableStrictIsoDateZ('2023-12-28T23:37:31.653Z'); // ✅ true
assertParsableStrictIsoDateZ('2023-12-29T23:37:31.653z'); // ✅ true  (case-insensitive works)
assertParsableStrictIsoDateZ('2023-12-28T23:37:31.653');  // 💥 false (missing 'Z')
assertParsableStrictIsoDateZ('2023-02-29T23:37:31.653Z'); // 💥 false (No 29th february in 2023)

const dateStr = '2023-12-29T23:37:31.653Z';
assertParsableStrictIsoDateZ(dateStr, `Wrong date: ${dateStr}`);
// 👉 assertion passed, safe to use
const date = new Date(dateStr);
const timestampNumber = Date.parse(dateStr);
```

## Parameters

### v

`unknown`

### msgOrErrorFactory?

`MsgOrErrorFactory`

## Returns

`asserts v is ParsableStrictIsoDateZ`

## Throws

TypeError
