import { LruCache, type LruCacheParams } from "@httpx/lru";

type IntlLocale = string; // `${string}-${string}`;

type IntlInstance =
  | Intl.NumberFormat
  | Intl.DateTimeFormat
  | Intl.RelativeTimeFormat
  | Intl.Collator
  | Intl.ListFormat
  | Intl.PluralRules
  | Intl.Segmenter
  | Intl.DisplayNames
  | Intl.DurationFormat
  | Intl.Locale;

export type MIntlOptions = {
  lru?: Partial<LruCacheParams<IntlInstance>>;
};

/**
 * Creates an independent MIntl instance with configurable LRU cache options.
 *
 * @example
 * ```typescript
 * import { createMIntl } from "@httpx/memo-intl";
 *
 * const intl = createMIntl({ lru: { maxSize: 200 } });
 * const formatter = intl.NumberFormat("fr-FR", {
 *   style: "currency",
 *   currency: "EUR",
 * });
 * ```
 */
export const createMIntl = (options: MIntlOptions = {}) => {
  const _cacheIntl = new LruCache<IntlInstance>({
    maxSize: 50,
    ...options.lru,
  });

  /**
   * Return the cached instance for the type, locale and options or create it.
   */
  const memo = <T extends IntlInstance>(
    type: string,
    locale: string,
    options: object | undefined,
    create: () => T
  ): T =>
    _cacheIntl.getOrSet(
      `${type}:${locale}${options === undefined ? "" : JSON.stringify(options)}`,
      create
    );

  return {
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
    ): Intl.NumberFormat =>
      memo(
        "NumberFormat",
        locale,
        options,
        () => new Intl.NumberFormat(locale, options)
      ),
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
    ): Intl.DateTimeFormat =>
      memo(
        "DateTimeFormat",
        locale,
        options,
        () => new Intl.DateTimeFormat(locale, options)
      ),

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
    Locale: (locale: string, options?: Intl.LocaleOptions): Intl.Locale =>
      memo("Locale", locale, options, () => new Intl.Locale(locale, options)),

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
    ): Intl.Collator =>
      memo(
        "Collator",
        locale,
        options,
        () => new Intl.Collator(locale, options)
      ),
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
    ): Intl.RelativeTimeFormat =>
      memo(
        "RelativeTimeFormat",
        locale,
        options,
        () => new Intl.RelativeTimeFormat(locale, options)
      ),
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
    ): Intl.ListFormat =>
      memo(
        "ListFormat",
        locale,
        options,
        () => new Intl.ListFormat(locale, options)
      ),

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
    ): Intl.PluralRules =>
      memo(
        "PluralRules",
        locale,
        options,
        () => new Intl.PluralRules(locale, options)
      ),

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
    ): Intl.Segmenter =>
      memo(
        "Segmenter",
        locale,
        options,
        () => new Intl.Segmenter(locale, options)
      ),

    /**
     * Return a memoized Intl.DisplayNames instance
     *
     * @example
     * ```typescript
     * const regionNames = intl.DisplayNames('en', { type: 'region' });
     * const value = regionNames.of('BE'); // 👈 'Belgium'
     * ```
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DisplayNames
     */
    DisplayNames: (
      locale: IntlLocale,
      options: Intl.DisplayNamesOptions
    ): Intl.DisplayNames =>
      memo(
        "DisplayNames",
        locale,
        options,
        () => new Intl.DisplayNames(locale, options)
      ),

    /**
     * Return a memoized Intl.DurationFormat instance
     *
     * Requires a runtime supporting Intl.DurationFormat (ie: node >= 23).
     *
     * @example
     * ```typescript
     * const formatter = intl.DurationFormat('en', { style: 'short' });
     * const value = formatter.format({ hours: 1, minutes: 46 }); // 👈 '1 hr, 46 min'
     * ```
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DurationFormat
     */
    DurationFormat: (
      locale: IntlLocale,
      options?: Intl.DurationFormatOptions
    ): Intl.DurationFormat =>
      memo(
        "DurationFormat",
        locale,
        options,
        () => new Intl.DurationFormat(locale, options)
      ),

    cache: {
      clear: (): void => {
        _cacheIntl.clear();
      },
      stats: (): { cachedInstances: number } => {
        return { cachedInstances: _cacheIntl.size };
      },
    },
  };
};

export type MIntlInstance = ReturnType<typeof createMIntl>;

type MIntlGlobalEntry = {
  instance: MIntlInstance;
  /** JSON of the options used on creation, to detect conflicting calls */
  optionsKey: string;
};

declare global {
  var __httpx_memo_intl_instances: Map<string, MIntlGlobalEntry> | undefined;
}

const isProduction = (): boolean =>
  (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env
    ?.NODE_ENV === "production";

/**
 * Returns an MIntl singleton shared through globalThis. Defaults to the
 * `"default"` name and an LRU max size of 50. The first call for a name
 * determines its LRU options: later calls with different options get the
 * existing instance and a console warning (unless NODE_ENV is "production").
 *
 * @example
 * ```typescript
 * import { getOrCreateMIntl } from "@httpx/memo-intl";
 *
 * const defaultIntl = getOrCreateMIntl();
 * const appIntl = getOrCreateMIntl("my-app", { lru: { maxSize: 200 } });
 * ```
 */
export const getOrCreateMIntl = (
  name = "default",
  options?: MIntlOptions
): MIntlInstance => {
  globalThis.__httpx_memo_intl_instances ??= new Map();
  const optionsKey = JSON.stringify(options ?? {});
  const entry = globalThis.__httpx_memo_intl_instances.get(name);
  if (entry === undefined) {
    const instance = createMIntl(options);
    globalThis.__httpx_memo_intl_instances.set(name, { instance, optionsKey });
    return instance;
  }
  if (
    options !== undefined &&
    optionsKey !== entry.optionsKey &&
    !isProduction()
  ) {
    console.warn(
      `[@httpx/memo-intl] getOrCreateMIntl("${name}") already exists, options ignored: ${optionsKey}`
    );
  }
  return entry.instance;
};

export const MIntl = getOrCreateMIntl("default");
