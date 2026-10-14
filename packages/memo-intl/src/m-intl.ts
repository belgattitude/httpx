import { LruCache } from "@httpx/lru";

type IntlLocale = string; // `${string}-${string}`;

const maxSize = 100;

const _cacheIntl = new LruCache<
  | Intl.NumberFormat
  | Intl.DateTimeFormat
  | Intl.RelativeTimeFormat
  | Intl.Collator
  | Intl.ListFormat
  | Intl.PluralRules
  | Intl.Segmenter
  | Intl.Locale
>({
  maxSize,
});

export const MIntl = {
  /**
   * Return a memoized Intl.NumberFormatter instance
   *
   * @example
   * ```typescript
   * const formatter = MIntl.NumberFormat('fr-FR', {
   *   style: 'currency',
   *   currency: 'EUR',
   *   notation: 'compact',
   *   minimumFractionDigits: 2,
   * });
   * const value = formatter.format(10.1345); // 👈 '10,13 €'
   * ```
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
   */
  NumberFormat: (
    locale: IntlLocale,
    options?: Intl.NumberFormatOptions
  ): Intl.NumberFormat => {
    const key = `NumberFormat:${locale}${options === undefined ? "" : JSON.stringify(options)}`;
    return _cacheIntl.getOrSet(
      key,
      () => new Intl.NumberFormat(locale, options)
    );
  },
  /**
   * Return a memoized Intl.DateTimeFormatter instance
   *
   * @example
   * <code>
   * ```typescript
   * const formatter = MIntl.DateTimeFormat('fr-FR', {
   *   dateStyle: 'full',
   *   timeStyle: 'full',
   *   timeZone: 'UTC',
   * });
   * const value = formatter.format(new Date()); // 👈 'mercredi 29 mai 2024 à 07:42:43 temps universel coordonné'
   * ```
   * </code>
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
   */
  DateTimeFormat: (
    locale: IntlLocale,
    options?: Intl.DateTimeFormatOptions
  ): Intl.DateTimeFormat => {
    const key = `DateTimeFormat:${locale}${options === undefined ? "" : JSON.stringify(options)}`;
    return _cacheIntl.getOrSet(
      key,
      () => new Intl.DateTimeFormat(locale, options)
    );
  },

  /**
   * Return a memoized Intl.Locale instance
   *
   * @example
   * ```typescript
   * const enLocale = MIntl.Locale('en');
   * const koLocale = new Intl.Locale("ko", {
   *   script: "Kore",
   *   region: "KR",
   *   hourCycle: "h23",
   *   calendar: "gregory",
   * });
   * ```
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale
   */
  Locale: (locale: string, options?: Intl.LocaleOptions): Intl.Locale => {
    const key = `Locale:${locale}${options === undefined ? "" : JSON.stringify(options)}`;
    return _cacheIntl.getOrSet(key, () => new Intl.Locale(locale, options));
  },

  /**
   * Return a memoized Intl.Collator instance
   *
   * @example
   * ```typescript
   * const collator = MIntl.Collator('de', {
   *   sensitivity: "base",
   *   caseFirst: "upper",
   * });
   *
   * const sorted = ["Z", "a", "z", "ä"].sort(collator.compare);
   * ```
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator
   */
  Collator: (
    locale: IntlLocale,
    options?: Intl.CollatorOptions
  ): Intl.Collator => {
    const key = `Collator:${locale}${options === undefined ? "" : JSON.stringify(options)}`;
    return _cacheIntl.getOrSet(key, () => new Intl.Collator(locale, options));
  },
  /**
   * Return a memoized Intl.RelativeTimeFormat instance
   *
   * @example
   * ```typescript
   * const rtf1 = MIntl.RelativeTimeFormat("en", { style: "short" });
   * const value = rtf1.format(3, "quarter") // // 👈 'in 3 qtrs.'
   * ```
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat
   */
  RelativeTimeFormat: (
    locale: IntlLocale,
    options?: Intl.RelativeTimeFormatOptions
  ): Intl.RelativeTimeFormat => {
    const key = `RelativeTimeFormat:${locale}${options === undefined ? "" : JSON.stringify(options)}`;
    return _cacheIntl.getOrSet(
      key,
      () => new Intl.RelativeTimeFormat(locale, options)
    );
  },
  /**
   * Return a memoized Intl.ListFormat instance
   *
   * @example
   * ```typescript
   * const vehicles = ["Motorcycle", "Bus", "Car"];
   * const formatter = new Intl.ListFormat("en", {
   *   style: "long",
   *   type: "conjunction",
   * });
   * const value = formatter.format(vehicles) // 👈 'Motorcycle, Bus, and Car'
   * ```
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/ListFormat
   */
  ListFormat: (
    locale: IntlLocale,
    options?: Intl.ListFormatOptions
  ): Intl.ListFormat => {
    const key = `ListFormat:${locale}${options === undefined ? "" : JSON.stringify(options)}`;
    return _cacheIntl.getOrSet(key, () => new Intl.ListFormat(locale, options));
  },

  /**
   * Return a memoized Intl.PluralRules instance
   *
   * @example
   * ```typescript
   * const pluralRules = MIntl.PluralRules('en-US', { type: 'ordinal' });
   * const num = pluralRules.select(2); // 👈 'two'
   * ```
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules
   */
  PluralRules: (
    locale: IntlLocale,
    options?: Intl.PluralRulesOptions
  ): Intl.PluralRules => {
    const key = `PluralRules:${locale}${options === undefined ? "" : JSON.stringify(options)}`;
    return _cacheIntl.getOrSet(
      key,
      () => new Intl.PluralRules(locale, options)
    );
  },

  /**
   * Return a memoized Intl.Segmenter instance
   *
   * @example
   * ```typescript
   * const segmenter = MIntl.Segmenter('fr', { granularity: 'word' });
   * const string = 'Que ma joie demeure';
   * const iterator = segmenter.segment(string)[Symbol.iterator]();
   * iterator1.next().value!.segment // 👈 'Que'
   * ```
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter
   */
  Segmenter: (
    locale: IntlLocale,
    options?: Intl.SegmenterOptions
  ): Intl.Segmenter => {
    const key = `Segmenter:${locale}${options === undefined ? "" : JSON.stringify(options)}`;
    return _cacheIntl.getOrSet(key, () => new Intl.Segmenter(locale, options));
  },

  cache: {
    clear: (): void => {
      _cacheIntl.clear();
    },
    stats: (): { cachedInstances: number } => {
      return { cachedInstances: _cacheIntl.size };
    },
  },
};
