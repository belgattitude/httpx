/* oxlint-disable unicorn/prefer-code-point -- charCodeAt always returns a number for in-range indexes (ASCII digits) */
import { describeValue } from "./assert-utils";
import type { BarcodeFormat, BarcodeType } from "./detect-barcode-type";
import {
  barcodeTypeLengths,
  getBarcodeTypeByLength,
} from "./detect-barcode-type";
import { hasValidGtinCheckDigit } from "./gtin-check-digit";
import type { GtinDigitsFailure } from "./gtin-digits";
import {
  DIGITS_INVALID_FORMAT,
  DIGITS_INVALID_LENGTH,
  getMinLength,
  isDigitsOnly,
  readGtinDigits,
  toLength,
  trimGtinString,
} from "./gtin-digits";
import { isRestrictedGtinDigits } from "./gtin-validate";
import type { NormalizeGtinOptions } from "./normalize-gtin";
import type { Ean8, Ean13, Gtin14, UpcA, UpcEOptions } from "./types";
import { expandUpcEDigits, isUpcECandidate } from "./upce-digits";

/** JavaScript types a GTIN can be given as */
export type GtinInputType = "string" | "number" | "bigint";

/**
 * GS1 classification of a GTIN, from its prefix (on the GTIN-13 form, after
 * the GTIN-14 indicator):
 *  - `trade_item`: regular product (any other prefix).
 *  - `isbn`: book, `978` and `979` (except `9790`).
 *  - `ismn`: sheet music, `9790`.
 *  - `issn`: periodical, `977`.
 *  - `coupon`: `981`-`984`, `99` and `05` (UPC-A number system 5, legacy
 *    coupons, reserved by GS1).
 *  - `refund_receipt`: `980`.
 *  - `in_store`: GS1 restricted circulation number, a code only meaningful
 *    within a company or a geographic region (ie: in-store labels, variable
 *    measure items with an embedded weight or price), not a globally unique
 *    product identifier. See `isInStoreGtin` for the ranges.
 */
export type GtinCategory =
  | "trade_item"
  | "isbn"
  | "ismn"
  | "issn"
  | "coupon"
  | "refund_receipt"
  | "in_store";

export type ParseGtinOptions = NormalizeGtinOptions &
  UpcEOptions & {
    /**
     * Accepted barcode types, matched on the `type` of the result (the GS1
     * type, from the significant digits), ie: `["ean13", "upca"]` refuses EAN-8
     * and GTIN-14 with a non-zero indicator.
     * @default ["ean8", "upca", "ean13", "gtin14"]
     */
    types?: readonly BarcodeType[];
    /**
     * Accepted formats as given, matched on the `format` of the result
     * (from the length of a string input, `"upce"` when read as a UPC-E), ie:
     * `["ean13", "upce"]` refuses a 12 digit UPC-A but accepts its 13 digit
     * form. Values whose format can't be known (numbers, bigints and strings
     * of other lengths: `format` would be `null`) are refused. Listing
     * `"upce"` reads UPC-E like `upce: "prefer-ean8"`, unless `upce` is set (`true`,
     * or `false`: 8 digits are then only read as EAN-8).
     * @default all formats, unknown ones included
     */
    formats?: readonly BarcodeFormat[];
    /**
     * Accepted JavaScript types of the value, ie: `["string"]` to refuse
     * numbers and bigints (leading zeros possibly lost).
     * @default ["string", "number", "bigint"]
     */
    inputTypes?: readonly GtinInputType[];
    /**
     * Accepted categories, ie: `["trade_item"]` to refuse books, coupons,
     * refund receipts and in-store codes (restricted circulation numbers,
     * accepted by default with the `in_store` category).
     * @default all categories
     */
    categories?: readonly GtinCategory[];
  };

/**
 * Why a value isn't a valid GTIN:
 *  - `invalid_type`: not a string, number or bigint (or not in `inputTypes`).
 *  - `invalid_format`: a string with a non digit character (whitespace
 *    included when `trim` is false), a UPC-E with a number system other than
 *    0 or 1 or expanding to the GTIN-8 range (with `upce: true`), a negative,
 *    unsafe or non integer number, a negative bigint.
 *  - `invalid_length`: less than `minLength` (default 8) or more than 14
 *    digits (a UPC-E counts as its expanded UPC-A: 12 digits).
 *  - `invalid_check_digit`: the GS1 mod-10 check digit doesn't match.
 *  - `invalid_barcode_type`: valid GTIN but its type isn't in `types`.
 *  - `format_not_accepted`: valid GTIN but its format as given
 *    (`format`) isn't in `formats` or can't be known (number, bigint,
 *    string of another length).
 *  - `invalid_category`: valid GTIN but its category isn't in `categories`.
 */
export type ParseGtinErrorReason =
  | "invalid_type"
  | "invalid_format"
  | "invalid_length"
  | "invalid_check_digit"
  | "invalid_barcode_type"
  | "format_not_accepted"
  | "invalid_category";

/** Branded value type for each barcode type */
type ValueByType = {
  ean8: Ean8;
  upca: UpcA;
  ean13: Ean13;
  gtin14: Gtin14;
};

/**
 * Successful parse, `value` is typed according to `type`. The type parameters
 * narrow the possible types, categories and input formats (see
 * `createGtinParser`).
 */
export type ParsedGtin<
  TType extends BarcodeType = BarcodeType,
  TCategory extends GtinCategory = GtinCategory,
  TFormat extends BarcodeFormat | null = BarcodeFormat | null,
> = {
  [T in TType]: {
    readonly success: true;
    /**
     * The barcode in the length of its `type` (8, 12, 13 or 14 digits),
     * leading zeros restored or removed, ie: "036000291452" for a "upca"
     * given as 36000291452 or "0036000291452". The value to display, print
     * or encode as a barcode.
     */
    readonly value: ValueByType[T];
    /**
     * GS1 type, from the significant digits (the shortest length the GTIN
     * fits in without dropping a non-zero digit): the same whatever the
     * leading zeros, ie: "0036000291452" and 36000291452 are both "upca".
     */
    readonly type: T;
    /**
     * Canonical GTIN-14 form (left-padded with zeros), as recommended by GS1
     * for storage and comparison (same as `normalizeGtin`)
     */
    readonly gtin: Gtin14;
    /**
     * Format as given, from the length of a string input (8, 12, 13 or 14),
     * `"upce"` when read as a UPC-E (see the `upce` option).
     * `null` for numbers, bigints and strings of other lengths (leading zeros
     * lost, can't be known).
     */
    readonly format: TFormat;
    /** GTIN-14 indicator digit (packaging level), 0 for trade items */
    readonly indicator: number;
    /**
     * GS1 classification from the prefix: `trade_item`, `isbn`, `ismn`,
     * `issn`, `coupon`, `refund_receipt` or `in_store` (restricted
     * circulation number)
     */
    readonly category: TCategory;
  };
}[TType];

export type ParseGtinFailure = {
  readonly success: false;
  readonly reason: ParseGtinErrorReason;
};

export type ParseGtinResult<
  TType extends BarcodeType = BarcodeType,
  TCategory extends GtinCategory = GtinCategory,
  TFormat extends BarcodeFormat | null = BarcodeFormat | null,
> = ParsedGtin<TType, TCategory, TFormat> | ParseGtinFailure;

/**
 * Custom message (thrown as a TypeError) or factory returning the error to
 * throw, receiving the invalid value and the reason.
 */
export type ParseGtinMsgOrErrorFactory =
  | string
  | ((v: unknown, reason: ParseGtinErrorReason) => Error);

const ZERO = 48;

// shared frozen failures: no allocation on the invalid path
const failure = /* @__NO_SIDE_EFFECTS__ */ (
  reason: ParseGtinErrorReason
): ParseGtinFailure => Object.freeze({ success: false, reason });

const failures = {
  invalid_type: failure("invalid_type"),
  invalid_format: failure("invalid_format"),
  invalid_length: failure("invalid_length"),
  invalid_check_digit: failure("invalid_check_digit"),
  invalid_barcode_type: failure("invalid_barcode_type"),
  format_not_accepted: failure("format_not_accepted"),
  invalid_category: failure("invalid_category"),
} satisfies Record<ParseGtinErrorReason, ParseGtinFailure>;

/** Reason of a readGtinDigits failure (a function: tree-shakable) */
const getDigitsFailure = (code: GtinDigitsFailure): ParseGtinFailure => {
  if (code === DIGITS_INVALID_LENGTH) {
    return failures.invalid_length;
  }
  return code === DIGITS_INVALID_FORMAT
    ? failures.invalid_format
    : failures.invalid_type;
};

/**
 * GS1 type from the leading zeros of the GTIN-14 form, computed on the digits
 * (reading the padded string would flatten it)
 */
const getGtinType = (digits: string): BarcodeType => {
  const offset = 14 - digits.length;
  let zeros = offset;
  while (zeros < 6 && digits.charCodeAt(zeros - offset) === ZERO) {
    zeros++;
  }
  if (zeros === 0) {
    return "gtin14";
  }
  if (zeros === 1) {
    return "ean13";
  }
  return zeros < 6 ? "upca" : "ean8";
};

/**
 * Category from the GS1 Prefix, on the GTIN-13 form (GTIN-14 index 1 to 4,
 * digits index minus `offset`, missing leading digits are zeros). Only
 * prefixes starting with 0 (`05`) and 9 aren't trade items: other codes exit
 * after one char. Restricted circulation numbers are handled by the caller.
 */
const getGtinCategory = (digits: string): GtinCategory => {
  const offset = 14 - digits.length;
  if (offset > 1) {
    // first digit of the GTIN-13 is a leading zero (UPC-A or EAN-8 form)
    return offset === 2 && digits.startsWith("5") ? "coupon" : "trade_item";
  }
  const first = digits.charAt(1 - offset);
  if (first === "0") {
    return digits.charAt(2 - offset) === "5" ? "coupon" : "trade_item";
  }
  if (first !== "9") {
    return "trade_item";
  }
  // GS1 Prefix after the 9 (rare: books, periodicals, coupons, receipts)
  const prefix = digits.slice(2 - offset, 5 - offset);
  if (prefix.startsWith("9")) {
    return "coupon";
  }
  if (prefix.startsWith("77")) {
    return "issn";
  }
  if (prefix.startsWith("790")) {
    return "ismn";
  }
  if (prefix.startsWith("78") || prefix.startsWith("79")) {
    return "isbn";
  }
  if (prefix.startsWith("80")) {
    return "refund_receipt";
  }
  return prefix >= "81" && prefix < "85" ? "coupon" : "trade_item";
};

/**
 * Parse a GTIN (string, number or bigint, leading zeros possibly lost)
 * without throwing. On success, returns the barcode `value` in the length of
 * its `type` (leading zeros restored), its canonical GTIN-14 form (`gtin`,
 * like `normalizeGtin`), input type, indicator digit and category. Otherwise
 * the `reason` it was refused.
 *
 * Reasons are checked in this order: `invalid_type`, `invalid_format` /
 * `invalid_length`, `invalid_check_digit`,
 * `invalid_barcode_type`, `format_not_accepted` and `invalid_category`.
 * Failures are shared frozen objects (no allocation on the invalid path).
 *
 * Perf notes (see bench/parse-gtin.bench.ts): on valid codes, ~45-50%
 * slower than `normalizeGtin` on node (result object, `value`, type and
 * category). Prefer
 * `normalizeGtin` when only the canonical form is needed.
 *
 * @example
 * ```typescript
 * parseGtin(36000291452);
 * // 👈 { success: true, value: "036000291452", type: "upca", gtin: "00036000291452", format: null, indicator: 0, category: "trade_item" }
 * parseGtin("0036000291452");
 * // 👈 { success: true, value: "036000291452", type: "upca", gtin: "00036000291452", format: "ean13", ... }
 * parseGtin(4006380000000); // 👈 { success: false, reason: "invalid_check_digit" }
 * parseGtin("96385074", { types: ["ean13", "upca"] }); // 👈 { success: false, reason: "invalid_barcode_type" }
 * parseGtin("036000291452", { formats: ["ean13"] }); // 👈 { success: false, reason: "format_not_accepted" }
 * parseGtin(36000291452, { inputTypes: ["string"] }); // 👈 { success: false, reason: "invalid_type" }
 * parseGtin(" 4006381333931\n"); // 👈 { success: true, value: "4006381333931", type: "ean13", ... } (trimmed)
 * parseGtin(" 4006381333931", { trim: false }); // 👈 { success: false, reason: "invalid_format" }
 * parseGtin("9781861972712"); // 👈 { success: true, value: "9781861972712", type: "ean13", ..., category: "isbn" }
 * parseGtin("9781861972712", { categories: ["trade_item"] }); // 👈 { success: false, reason: "invalid_category" }
 * parseGtin("04252614", { upce: true });
 * // 👈 { success: true, value: "042100005264", type: "upca", gtin: "00042100005264", format: "upce", ... }
 * parseGtin("04252614", { upce: "prefer-ean8" }); // 👈 same (starts with 0, valid UPC-E, can't be an EAN-8)
 * parseGtin("01234565", { upce: "prefer-ean8" }); // 👈 { success: true, value: "01234565", type: "ean8", format: "ean8", ..., category: "in_store" } (also an in-store EAN-8, kept)
 * parseGtin("01234565", { upce: "prefer-upce" }); // 👈 { success: true, value: "012345000065", type: "upca", format: "upce", ... }
 * ```
 *
 * @param value - GTIN as a string (digits only, see `trim`), a non-negative
 *   safe integer or a non-negative bigint
 * @param options.minLength - minimum number of digits of the input, as given
 *   (leading zeros of strings included, a UPC-E counts as its 12 digit
 *   UPC-A), between 1 and 14. Default `8`.
 * @param options.types - accepted barcode types, matched on `type`. Default
 *   all: `["ean8", "upca", "ean13", "gtin14"]`.
 * @param options.inputTypes - accepted JavaScript types of the value. Default
 *   all: `["string", "number", "bigint"]`.
 * @param options.trim - remove leading and trailing whitespace of strings.
 *   Default `true`.
 * @param options.upce - read 8 digit strings as UPC-E (expanded to their
 *   UPC-A) instead of EAN-8: `true` always, `"prefer-ean8"` (safest) and
 *   `"prefer-upce"` when they start with `0` and are a valid UPC-E, they
 *   differ on the ones that are also a restricted EAN-8. Default `false`
 *   (`"prefer-ean8"` when `formats` lists `"upce"`).
 * @param options.formats - accepted formats as given, matched on
 *   `format` (`ean8`, `upca`, `ean13`, `gtin14`, `upce`), unknown formats
 *   (numbers, bigints, other lengths) refused. Default all, unknown included.
 * @param options.categories - accepted categories (`trade_item`, `isbn`,
 *   `ismn`, `issn`, `coupon`, `refund_receipt`, `in_store`). Default all.
 * @throws RangeError when minLength is not an integer between 1 and 14
 */
export const parseGtin = (
  value: unknown,
  options?: ParseGtinOptions
): ParseGtinResult => {
  // validated first (throws a RangeError) whatever the value
  const minLength = getMinLength(options);
  const inputTypes = options?.inputTypes;
  if (
    inputTypes !== undefined &&
    !inputTypes.includes(typeof value as GtinInputType)
  ) {
    return failures.invalid_type;
  }
  const isString = typeof value === "string";
  const formats = options?.formats;
  // accepting the "upce" format reads UPC-E (safest mode), unless `upce` is
  // set
  const upceOption = isString
    ? (options?.upce ?? (formats?.includes("upce") === true && "prefer-ean8"))
    : false;
  const upce =
    upceOption === true ||
    upceOption === "prefer-ean8" ||
    upceOption === "prefer-upce";
  // with upce, an 8 digit string can be a UPC-E: its length is the one of
  // the expanded UPC-A, minLength is checked after the expansion
  const trim = options?.trim !== false;
  const read = readGtinDigits(
    value,
    upce ? Math.min(minLength, 8) : minLength,
    trim
  );
  if (typeof read !== "string") {
    // a non digit string is a format failure, whatever its length
    return isString && !isDigitsOnly(trim ? trimGtinString(value) : value)
      ? failures.invalid_format
      : getDigitsFailure(read);
  }
  let digits = read;
  let format: BarcodeFormat | null = isString
    ? getBarcodeTypeByLength(digits.length)
    : null;
  if (upce) {
    if (
      format === "ean8" &&
      (upceOption === true || isUpcECandidate(digits, upceOption))
    ) {
      // validated as the expanded UPC-A (check digit, restricted ranges)
      const upca = expandUpcEDigits(digits);
      if (upca === null) {
        if (upceOption === true) {
          return failures.invalid_format;
        }
      } else if (upceOption === true || hasValidGtinCheckDigit(upca)) {
        // detected: only a valid UPC-E, an EAN-8 (and its failure) otherwise
        digits = upca;
        format = "upce";
      }
    }
    if (digits.length < minLength) {
      return isDigitsOnly(digits)
        ? failures.invalid_length
        : failures.invalid_format;
    }
  }
  if (!hasValidGtinCheckDigit(digits)) {
    return isDigitsOnly(digits)
      ? failures.invalid_check_digit
      : failures.invalid_format;
  }
  const type = getGtinType(digits);
  if (options?.types !== undefined && !options.types.includes(type)) {
    return failures.invalid_barcode_type;
  }
  if (formats !== undefined && (format === null || !formats.includes(format))) {
    return failures.format_not_accepted;
  }
  // restricted circulation numbers are accepted, as in-store codes
  const category = isRestrictedGtinDigits(digits)
    ? "in_store"
    : getGtinCategory(digits);
  if (
    options?.categories !== undefined &&
    !options.categories.includes(category)
  ) {
    return failures.invalid_category;
  }
  return {
    success: true,
    value: toLength(digits, barcodeTypeLengths[type]),
    type,
    gtin: toLength(digits, 14),
    format,
    indicator: type === "gtin14" ? digits.charCodeAt(0) - ZERO : 0,
    category,
  } as ParsedGtin;
};

/**
 * Parse a GTIN like `parseGtin` and return the parsed result, or throw when
 * the value isn't a valid GTIN.
 *
 * Perf notes (see bench/parse-gtin.bench.ts): as fast as `parseGtin` on valid
 * codes, but throwing is costly (error and stack trace creation). With ~20%
 * invalid codes, a try/catch is ~25x slower than `parseGtin` on node and
 * ~3x on bun. Prefer `parseGtin` when invalid values are expected (ie: bulk
 * imports).
 *
 * @example
 * ```typescript
 * const { value, type, gtin } = parseGtinOrThrow(36000291452); // 👈 "036000291452", "upca", "00036000291452"
 * parseGtinOrThrow(4006380000000);
 * // 👈 throws TypeError('Value is expected to be a GTIN (invalid_check_digit), got: number')
 * parseGtinOrThrow(v, "Invalid barcode"); // 👈 throws TypeError('Invalid barcode')
 * parseGtinOrThrow(v, (v, reason) => new HttpBadRequest(reason)); // 👈 throws HttpBadRequest
 * parseGtinOrThrow(v, undefined, { types: ["ean13", "upca"] });
 * ```
 *
 * @param value - same as `parseGtin`
 * @param msgOrErrorFactory - custom message (thrown as a TypeError) or factory
 *   receiving the value and the reason. Default: TypeError with the reason and
 *   the value type (never its content).
 * @param options.minLength - minimum number of digits of the input, as given
 *   (leading zeros of strings included), between 1 and 14. Default `8`.
 * @param options.types - accepted barcode types, matched on `type`. Default
 *   all: `["ean8", "upca", "ean13", "gtin14"]`.
 * @param options.inputTypes - accepted JavaScript types of the value. Default
 *   all: `["string", "number", "bigint"]`.
 * @param options.trim - remove leading and trailing whitespace of strings.
 *   Default `true`.
 * @param options.upce - read 8 digit strings as UPC-E (expanded to their
 *   UPC-A) instead of EAN-8: `true` always, `"prefer-ean8"` (safest) and
 *   `"prefer-upce"` when they start with `0` and are a valid UPC-E, they
 *   differ on the ones that are also a restricted EAN-8. Default `false`
 *   (`"prefer-ean8"` when `formats` lists `"upce"`).
 * @param options.formats - accepted formats as given, matched on
 *   `format`, unknown formats refused. Default all, unknown included.
 * @param options.categories - accepted categories (`trade_item`, `isbn`,
 *   `ismn`, `issn`, `coupon`, `refund_receipt`, `in_store`). Default all.
 *
 * @throws TypeError (or the error returned by the factory) when invalid
 * @throws RangeError when minLength is not an integer between 1 and 14
 */
export const parseGtinOrThrow = (
  value: unknown,
  msgOrErrorFactory?: ParseGtinMsgOrErrorFactory,
  options?: ParseGtinOptions
): ParsedGtin => {
  const result = parseGtin(value, options);
  if (result.success) {
    return result;
  }
  if (typeof msgOrErrorFactory === "function") {
    throw msgOrErrorFactory(value, result.reason);
  }
  throw new TypeError(
    msgOrErrorFactory ??
      `Value is expected to be a GTIN (${result.reason}), got: ${describeValue(value)}`
  );
};
