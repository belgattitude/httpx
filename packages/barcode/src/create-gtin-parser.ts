import type { BarcodeFormat, BarcodeType } from "./detect-barcode-type";
import { getMinLength } from "./gtin-digits";
import type {
  GtinCategory,
  ParsedGtin,
  ParseGtinMsgOrErrorFactory,
  ParseGtinOptions,
  ParseGtinResult,
} from "./parse-gtin";
import { parseGtin, parseGtinOrThrow } from "./parse-gtin";

export type GtinParserOptions = ParseGtinOptions & {
  /**
   * Default error of `parseOrThrow`: a message (thrown as a TypeError) or a
   * factory receiving the value and the reason.
   * @default TypeError with the reason and the value type
   */
  errorFactory?: ParseGtinMsgOrErrorFactory;
};

/** Barcode types a parser can return, from its `types` option */
export type GtinParserTypes<TOptions> = "types" extends keyof TOptions
  ? Extract<
      NonNullable<TOptions["types" & keyof TOptions]>,
      readonly unknown[]
    >[number] &
      BarcodeType
  : BarcodeType;

/**
 * Input formats a parser can return, from its `formats` option (never `null`
 * when given: unknown formats are refused)
 */
export type GtinParserFormats<TOptions> = "formats" extends keyof TOptions
  ? undefined extends TOptions["formats" & keyof TOptions]
    ? BarcodeFormat | null
    : Extract<
        TOptions["formats" & keyof TOptions],
        readonly unknown[]
      >[number] &
        BarcodeFormat
  : BarcodeFormat | null;

/** Categories a parser can return, from its `categories` option */
export type GtinParserCategories<TOptions> = "categories" extends keyof TOptions
  ? undefined extends TOptions["categories" & keyof TOptions]
    ? GtinCategory
    : Extract<
        TOptions["categories" & keyof TOptions],
        readonly unknown[]
      >[number] &
        GtinCategory
  : GtinCategory;

/** Options narrowing the result types, inferred from the given options */
export type GtinParserNarrowingOptions = Pick<
  ParseGtinOptions,
  "types" | "formats" | "categories"
>;

/**
 * Other options: typed directly (not inferred), so callbacks like
 * `errorFactory` get their parameter types
 */
type GtinParserOtherOptions = Omit<
  GtinParserOptions,
  keyof GtinParserNarrowingOptions
>;

/** Options of `extend`, merged over the parser ones */
type MergeOptions<TBase, TOverrides> = Omit<TBase, keyof TOverrides> &
  TOverrides;

const arrayOptions = ["types", "formats", "categories", "inputTypes"] as const;

export type GtinParser<
  TOptions extends GtinParserNarrowingOptions = GtinParserNarrowingOptions,
> = {
  /** Resolved options (frozen copy) */
  readonly options: Readonly<GtinParserOptions>;
  /**
   * Parse a GTIN with the parser options, see `parseGtin`. Takes a single
   * argument: safe to pass as a callback (`codes.map(parser.parse)`).
   */
  readonly parse: (
    value: unknown
  ) => ParseGtinResult<
    GtinParserTypes<TOptions>,
    GtinParserCategories<TOptions>,
    GtinParserFormats<TOptions>
  >;
  /**
   * Parse a GTIN with the parser options or throw (the `errorFactory` error,
   * a TypeError by default), see `parseGtinOrThrow`.
   *
   * @throws TypeError (or the errorFactory error) when invalid
   */
  readonly parseOrThrow: (
    value: unknown
  ) => ParsedGtin<
    GtinParserTypes<TOptions>,
    GtinParserCategories<TOptions>,
    GtinParserFormats<TOptions>
  >;
  /**
   * Create a new parser with these options merged over the current ones (the
   * current parser is unchanged).
   *
   * @throws RangeError when minLength is not an integer between 1 and 14
   */
  readonly extend: <
    const TOverrides extends GtinParserNarrowingOptions = object,
  >(
    overrides: TOverrides & GtinParserOtherOptions
  ) => GtinParser<MergeOptions<TOptions, TOverrides>>;
};

/**
 * Create a GTIN parser with default options, reused by `parse` and
 * `parseOrThrow`. Options are copied and validated once (a bad `minLength`
 * throws at creation), and the result types are narrowed from `types`,
 * `formats` and `categories` (when given as literals).
 *
 * `parse` and `parseOrThrow` take a single argument and don't depend on
 * `this`: safe to pass as callbacks (`codes.map(parser.parse)`).
 *
 * @example
 * ```typescript
 * const gtinParser = createGtinParser({
 *   types: ["ean13", "upca"],
 *   categories: ["trade_item"],
 *   errorFactory: (v, reason) => new HttpBadRequest(`Invalid barcode: ${reason}`),
 * });
 *
 * const result = gtinParser.parse(input);
 * if (result.success) {
 *   result.value; // 👈 Ean13 | UpcA
 * }
 * const { gtin } = gtinParser.parseOrThrow(input); // 👈 throws HttpBadRequest
 * const results = codes.map(gtinParser.parse);
 * const withInStoreParser = gtinParser.extend({
 *   categories: ["trade_item", "in_store"],
 * });
 * ```
 *
 * @throws RangeError when minLength is not an integer between 1 and 14
 */
export const createGtinParser = <
  const TOptions extends GtinParserNarrowingOptions = object,
>(
  options?: TOptions & GtinParserOtherOptions
): GtinParser<TOptions> => {
  const { errorFactory, ...rest }: GtinParserOptions = options ?? {};
  // copy (arrays included): later changes of the given options don't apply
  const parseOptions: ParseGtinOptions = { ...rest };
  for (const key of arrayOptions) {
    const values = rest[key];
    if (values !== undefined) {
      Object.assign(parseOptions, { [key]: Object.freeze([...values]) });
    }
  }
  // validates minLength (throws a RangeError) at creation
  getMinLength(parseOptions);
  Object.freeze(parseOptions);
  const resolved: GtinParserOptions = Object.freeze(
    errorFactory === undefined
      ? parseOptions
      : { ...parseOptions, errorFactory }
  );
  type Parser = GtinParser<TOptions>;
  return Object.freeze({
    options: resolved,
    parse: ((value: unknown) =>
      parseGtin(value, parseOptions)) as Parser["parse"],
    parseOrThrow: ((value: unknown) =>
      parseGtinOrThrow(
        value,
        errorFactory,
        parseOptions
      )) as Parser["parseOrThrow"],
    extend: ((overrides: GtinParserOptions) =>
      createGtinParser({ ...resolved, ...overrides })) as Parser["extend"],
  });
};
