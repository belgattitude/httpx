import { LruCache } from '@httpx/lru';
type CacheKey = string;

type IntlLocale = string; // `${string}-${string}`;

const maxSize = 50;

const _cacheIntl = new LruCache<
  Intl.NumberFormat | Intl.DateTimeFormat,
  CacheKey
>({
  maxSize,
});

export const MIntl = {
  /**
   * Return a memoized Intl.NumberFormatter instance
   *
   * @example Usage
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
    const key = `NumberFormat:${locale}${options === undefined ? '' : JSON.stringify(options)}`;
    if (!_cacheIntl.has(key)) {
      _cacheIntl.set(key, new Intl.NumberFormat(locale, options));
    }
    return _cacheIntl.get(key)! as Intl.NumberFormat;
  },
  /**
   * Return a memoized Intl.DateTimeFormatter instance
   *
   * @example Usage
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
    const key = `DateTimeFormat:${locale}${options === undefined ? '' : JSON.stringify(options)}`;
    if (!_cacheIntl.has(key)) {
      _cacheIntl.set(key, new Intl.DateTimeFormat(locale, options));
    }
    return _cacheIntl.get(key)! as Intl.DateTimeFormat;
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
