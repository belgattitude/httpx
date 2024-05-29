import QuickLRU from 'quick-lru';

type CacheKey = string;

type IntlLocale = string; // `${string}-${string}`;

const maxSize = 50;

const _cacheNumberFormat = new QuickLRU<CacheKey, Intl.NumberFormat>({
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
    const key = `${locale}${options === undefined ? '' : JSON.stringify(options)}`;
    if (_cacheNumberFormat.has(key) === false) {
      _cacheNumberFormat.set(key, new Intl.NumberFormat(locale, options));
    }
    return _cacheNumberFormat.get(key)!;
  },
  clearCache: (): void => {
    _cacheNumberFormat.clear();
  },
};
