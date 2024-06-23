[**@httpx/memo-intl v1.1.0**](../README.md) • **Docs**

***

[@httpx/memo-intl v1.1.0](../README.md) / MIntl

# Variable: MIntl

> `const` **MIntl**: `object`

## Type declaration

### DateTimeFormat()

> **DateTimeFormat**: (`locale`, `options`?) => `DateTimeFormat`

Return a memoized Intl.DateTimeFormatter instance

<code>
```typescript
const formatter = MIntl.DateTimeFormat('fr-FR', {
  dateStyle: 'full',
  timeStyle: 'full',
  timeZone: 'UTC',
});
const value = formatter.format(new Date()); // 👈 'mercredi 29 mai 2024 à 07:42:43 temps universel coordonné'
```
</code>

#### See

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat

#### Parameters

• **locale**: `string`

• **options?**: `DateTimeFormatOptions`

#### Returns

`DateTimeFormat`

### NumberFormat()

> **NumberFormat**: (`locale`, `options`?) => `NumberFormat`

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

#### See

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat

#### Parameters

• **locale**: `string`

• **options?**: `NumberFormatOptions`

#### Returns

`NumberFormat`

### cache

> **cache**: `object`

### cache.clear()

> **clear**: () => `void`

#### Returns

`void`

### cache.stats()

> **stats**: () => `object`

#### Returns

`object`

##### cachedInstances

> **cachedInstances**: `number`
