type CacheKey = string;

type IntlLocale = string; // `${string}-${string}`;

export class MIntl {
  private static _cache: Map<CacheKey, Intl.NumberFormat>;
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
  static NumberFormat = (
    locale: IntlLocale,
    options?: Intl.NumberFormatOptions
  ): Intl.NumberFormat => {
    const key = JSON.stringify({ locale, options: options ?? null });
    if (!MIntl._cache) {
      MIntl._cache = new Map<CacheKey, Intl.NumberFormat>();
    }
    if (!MIntl._cache.has(key)) {
      MIntl._cache.set(key, new Intl.NumberFormat(locale, options));
    }
    return MIntl._cache.get(key)!;
  };
  static resetCache = (): void => {
    MIntl._cache = new Map();
  };
}
