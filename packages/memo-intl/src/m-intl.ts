import QuickLRU from 'quick-lru';

type CacheKey = string;

type IntlLocale = string; // `${string}-${string}`;

const maxSize = 50;

const _cacheIntl = new QuickLRU<
  CacheKey,
  Intl.NumberFormat | Intl.DateTimeFormat
>({
  maxSize,
});

export const MIntl = {
  /**
   * Return a memoized Intl.NumberFormatter instance
   *
   * <code>
   * ```typescript
   * const formatter = MIntl.NumberFormat('fr-FR', {
   *   style: 'currency',
   *   currency: 'EUR',
   *   notation: 'compact',
   *   minimumFractionDigits: 2,
   * });
   * const value = formatter.format(10.1345); // 👈 '10,13 €'
   * ```
   * </code>
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
   */
  NumberFormat: (
    locale: IntlLocale,
    options?: Intl.NumberFormatOptions
  ): Intl.NumberFormat => {
    const key = `NumberFormat:${locale}${options === undefined ? '' : JSON.stringify(options)}`;
    if (_cacheIntl.has(key) === false) {
      _cacheIntl.set(key, new Intl.NumberFormat(locale, options));
    }
    return _cacheIntl.get(key)! as Intl.NumberFormat;
  },
  /**
   * Return a memoized Intl.DateTimeFormatter instance
   *
   * <code>
   * ```typescript
   * const formatter = MIntl.DateTimeFormat('fr-FR', {
   *   dateStyle: 'full',
   *   timeStyle: 'full',
   * });
   * const value = formatter.format(new Date()); // 👈 '10,13 €'
   * ```
   * </code>
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
   */
  DateTimeFormat: (
    locale: IntlLocale,
    options?: Intl.DateTimeFormatOptions
  ): Intl.DateTimeFormat => {
    const key = `DateTimeFormat:${locale}${options === undefined ? '' : JSON.stringify(options)}`;
    if (_cacheIntl.has(key) === false) {
      _cacheIntl.set(key, new Intl.DateTimeFormat(locale, options));
    }
    return _cacheIntl.get(key)! as Intl.DateTimeFormat;
  },
  clearCache: (): void => {
    _cacheIntl.clear();
  },
};
