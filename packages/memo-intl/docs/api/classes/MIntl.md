[**@httpx/memo-intl v0.0.1**](../README.md) • **Docs**

***

[@httpx/memo-intl v0.0.1](../README.md) / MIntl

# Class: MIntl

## Constructors

### new MIntl()

> **new MIntl**(): [`MIntl`](MIntl.md)

#### Returns

[`MIntl`](MIntl.md)

## Methods

### NumberFormat()

> `static` **NumberFormat**(`locale`, `options`?): `NumberFormat`

Return a memoized Intl.NumberFormatter instance

<code>
```typescript
const formatter = MIntl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  notation: 'compact',
  minimumFractionDigits: 2,
});
const value = formatter.format(10.1345); // 👈 '10,13 €'
```
</code>

#### Parameters

• **locale**: `string`

• **options?**: `NumberFormatOptions`

#### Returns

`NumberFormat`

#### See

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat

***

### resetCache()

> `static` **resetCache**(): `void`

#### Returns

`void`
