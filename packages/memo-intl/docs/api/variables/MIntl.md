[**@httpx/memo-intl v1.4.9**](../README.md)

---

[@httpx/memo-intl](../README.md) / MIntl

# Variable: MIntl

> `const` **MIntl**: `object`

## Type Declaration

### cache

> **cache**: `object`

#### cache.clear()

> **clear**: () => `void`

##### Returns

`void`

#### cache.stats()

> **stats**: () => `object`

##### Returns

`object`

###### cachedInstances

> **cachedInstances**: `number`

### Collator()

> **Collator**: (`locale`, `options?`) => `Collator`

Return a memoized Intl.Collator instance

#### Parameters

##### locale

`string`

##### options?

`CollatorOptions`

#### Returns

`Collator`

#### Example

```typescript
const collator = MIntl.Collator("de", {
  sensitivity: "base",
  caseFirst: "upper",
});

const sorted = ["Z", "a", "z", "ä"].sort(collator.compare);
```

#### See

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator

### DateTimeFormat()

> **DateTimeFormat**: (`locale`, `options?`) => `DateTimeFormat`

Return a memoized Intl.DateTimeFormatter instance

#### Parameters

##### locale

`string`

##### options?

`DateTimeFormatOptions`

#### Returns

`DateTimeFormat`

#### Example

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

### ListFormat()

> **ListFormat**: (`locale`, `options?`) => `ListFormat`

Return a memoized Intl.ListFormat instance

#### Parameters

##### locale

`string`

##### options?

`ListFormatOptions`

#### Returns

`ListFormat`

#### Example

```typescript
const vehicles = ["Motorcycle", "Bus", "Car"];
const formatter = new Intl.ListFormat("en", {
  style: "long",
  type: "conjunction",
});
const value = formatter.format(vehicles); // 👈 'Motorcycle, Bus, and Car'
```

#### See

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/ListFormat

### Locale()

> **Locale**: (`locale`, `options?`) => `Locale`

Return a memoized Intl.Locale instance

#### Parameters

##### locale

`string`

##### options?

`LocaleOptions`

#### Returns

`Locale`

#### Example

```typescript
const enLocale = MIntl.Locale("en");
const koLocale = new Intl.Locale("ko", {
  script: "Kore",
  region: "KR",
  hourCycle: "h23",
  calendar: "gregory",
});
```

#### See

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale

### NumberFormat()

> **NumberFormat**: (`locale`, `options?`) => `NumberFormat`

Return a memoized Intl.NumberFormatter instance

#### Parameters

##### locale

`string`

##### options?

`NumberFormatOptions`

#### Returns

`NumberFormat`

#### Example

```typescript
const formatter = MIntl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  notation: "compact",
  minimumFractionDigits: 2,
});
const value = formatter.format(10.1345); // 👈 '10,13 €'
```

#### See

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat

### PluralRules()

> **PluralRules**: (`locale`, `options?`) => `PluralRules`

Return a memoized Intl.PluralRules instance

#### Parameters

##### locale

`string`

##### options?

`PluralRulesOptions`

#### Returns

`PluralRules`

#### Example

```typescript
const pluralRules = MIntl.PluralRules("en-US", { type: "ordinal" });
const num = pluralRules.select(2); // 👈 'two'
```

#### See

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules

### RelativeTimeFormat()

> **RelativeTimeFormat**: (`locale`, `options?`) => `RelativeTimeFormat`

Return a memoized Intl.RelativeTimeFormat instance

#### Parameters

##### locale

`string`

##### options?

`RelativeTimeFormatOptions`

#### Returns

`RelativeTimeFormat`

#### Example

```typescript
const rtf1 = MIntl.RelativeTimeFormat("en", { style: "short" });
const value = rtf1.format(3, "quarter"); // // 👈 'in 3 qtrs.'
```

#### See

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat

### Segmenter()

> **Segmenter**: (`locale`, `options?`) => `Segmenter`

Return a memoized Intl.Segmenter instance

#### Parameters

##### locale

`string`

##### options?

`SegmenterOptions`

#### Returns

`Segmenter`

#### Example

```typescript
const segmenter = MIntl.Segmenter("fr", { granularity: "word" });
const string = "Que ma joie demeure";
const iterator = segmenter.segment(string)[Symbol.iterator]();
iterator1.next().value!.segment; // 👈 'Que'
```

#### See

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter
