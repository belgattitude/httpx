---
"@httpx/memo-intl": minor
---

Support more Intl constructors

### Locale

[MDN: Intl.Locale](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)

```typescript
import { MIntl } from '@httpx/memo-intl';

const locale = MIntl.Locale('fr-FR', { caseFirst: 'lower' });
console.log(locale.language); // "fr"
```

### Collator

[MDN: Intl.Collator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator)

```typescript
import { MIntl } from '@httpx/memo-intl';

const collator = MIntl.Collator('de', { sensitivity: 'base' });
console.log(['Z', 'a', 'z', 'ä'].sort(collator.compare));
```

### RelativeTimeFormat

[MDN: Intl.RelativeTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat)

```typescript
import { MIntl } from '@httpx/memo-intl';

const rtf = MIntl.RelativeTimeFormat('en', { style: 'short' });
console.log(rtf.format(3, 'month')); // e.g. "in 3 mos."
```

### ListFormat

[MDN: Intl.ListFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/ListFormat)

```typescript
import { MIntl } from '@httpx/memo-intl';

const listFormatter = MIntl.ListFormat('en', {
  style: 'long',
  type: 'conjunction',
});
console.log(listFormatter.format(['Red', 'Green', 'Blue']));
```

### PluralRules

[MDN: Intl.PluralRules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules)

```typescript
import { MIntl } from '@httpx/memo-intl';

const pr = MIntl.PluralRules('en-US', { type: 'cardinal' });
console.log(pr.select(1)); // "one"
```

### Segmenter

[MDN: Intl.Segmenter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)

```typescript
import { MIntl } from '@httpx/memo-intl';

const segmenter = MIntl.Segmenter('fr', { granularity: 'word' });
const result = segmenter.segment('Bonjour le monde');
console.log([...result].map(({ segment }) => segment));
```
