/* oxlint-disable unicorn/prefer-code-point -- charCodeAt always returns a number for in-range indexes (ASCII digits) */
import { describeValue } from "./assert-utils";
import type { BarcodeFormat, BarcodeType } from "./detect-barcode-type";
import { hasValidGtinCheckDigit } from "./gtin-check-digit";
import { toGtinDigits } from "./gtin-digits";
import { isRestrictedGtinDigits } from "./gtin-validate";
import type { NormalizeGtinOptions } from "./normalize-gtin";
import type { Ean8, Ean13, Gtin14, UpcA, UpcEOptions } from "./types";
import { expandUpcEDigits } from "./upce-digits";

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
 *  - `restricted`: restricted circulation number (only with
 *    `acceptRestricted`), see `isRestrictedCirculation`.
 */
export type GtinCategory =
  | "trade_item"
  | "isbn"
  | "ismn"
  | "issn"
  | "coupon"
  | "refund_receipt"
  | "restricted";

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
     * Accepted JavaScript types of the value, ie: `["string"]` to refuse
     * numbers and bigints (leading zeros possibly lost).
     * @default ["string", "number", "bigint"]
     */
    inputTypes?: readonly GtinInputType[];
    /**
     * Accepted categories, ie: `["trade_item"]` to refuse books, coupons and
     * refund receipts. Restricted circulation numbers also require
     * `acceptRestricted`.
     * @default all categories
     */
    categories?: readonly GtinCategory[];
  };

/**
 * Why a value isn't a valid GTIN:
 *  - `invalid_type`: not a string, number or bigint (or not in `inputTypes`).
 *  - `invalid_format`: a string with a non digit character (whitespace
 *    included when `trim` is false), a UPC-E with a number system other than
 *    0 or 1 (with `upce`), a negative,
 *    unsafe or non integer number, a negative bigint.
 *  - `invalid_length`: less than `minLength` (default 8) or more than 14
 *    digits.
 *  - `invalid_check_digit`: the GS1 mod-10 check digit doesn't match.
 *  - `restricted`: restricted circulation number (unless `acceptRestricted`).
 *  - `invalid_barcode_type`: valid GTIN but its type isn't in `types`.
 *  - `invalid_category`: valid GTIN but its category isn't in `categories`.
 */
export type ParseGtinErrorReason =
  | "invalid_type"
  | "invalid_format"
  | "invalid_length"
  | "invalid_check_digit"
  | "restricted"
  | "invalid_barcode_type"
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
 * narrow the possible types and categories (see `createGtinParser`).
 */
export type ParsedGtin<
  TType extends BarcodeType = BarcodeType,
  TCategory extends GtinCategory = GtinCategory,
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
     * `"upce"` for a UPC-E (with the `upce` option). `null` for numbers,
     * bigints and strings of other lengths (leading zeros lost, can't be
     * known).
     */
    readonly inputType: BarcodeFormat | null;
    /** GTIN-14 indicator digit (packaging level), 0 for trade items */
    readonly indicator: number;
    /**
     * GS1 classification from the prefix: `trade_item`, `isbn`, `ismn`,
     * `issn`, `coupon`, `refund_receipt` or `restricted` (only possible with
     * `acceptRestricted`)
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
> = ParsedGtin<TType, TCategory> | ParseGtinFailure;

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
  restricted: failure("restricted"),
  invalid_barcode_type: failure("invalid_barcode_type"),
  invalid_category: failure("invalid_category"),
} satisfies Record<ParseGtinErrorReason, ParseGtinFailure>;

/** Type as given, from the length of a string input */
const getInputType = (length: number): BarcodeType | null => {
  switch (length) {
    case 13: {
      return "ean13";
    }
    case 12: {
      return "upca";
    }
    case 8: {
      return "ean8";
    }
    case 14: {
      return "gtin14";
    }
    default: {
      return null;
    }
  }
};

/** Reason toGtinDigits returned null (invalid path only) */
const getDigitsFailure = (value: unknown): ParseGtinFailure => {
  if (typeof value === "number") {
    return Number.isSafeInteger(value) && value >= 0
      ? failures.invalid_length
      : failures.invalid_format;
  }
  if (typeof value === "bigint") {
    return value < 0n ? failures.invalid_format : failures.invalid_length;
  }
  return typeof value === "string"
    ? failures.invalid_length
    : failures.invalid_type;
};

const isDigitsOnly = (code: string): boolean => {
  for (let i = 0; i < code.length; i++) {
    const c = code.charCodeAt(i);
    if (c < ZERO || c > ZERO + 9) {
      return false;
    }
  }
  return true;
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

/** Length of the value for a barcode type */
const getValueLength = (type: BarcodeType): number => {
  if (type === "ean13") {
    return 13;
  }
  if (type === "upca") {
    return 12;
  }
  return type === "ean8" ? 8 : 14;
};

/**
 * Digits to the given length: as is when already there (no allocation),
 * left-padded or without their extra leading zeros (the type being the
 * shortest length, only zeros are dropped)
 */
const toLength = <T extends string>(digits: string, length: number): T => {
  const extra = digits.length - length;
  if (extra === 0) {
    return digits as T;
  }
  return (extra > 0 ? digits.slice(extra) : digits.padStart(length, "0")) as T;
};

/**
 * Parse a GTIN (string, number or bigint, leading zeros possibly lost)
 * without throwing. On success, returns the barcode `value` in the length of
 * its `type` (leading zeros restored), its canonical GTIN-14 form (`gtin`,
 * like `normalizeGtin`), input type, indicator digit and category
 * circulation flag. Otherwise the `reason` it was refused.
 *
 * Reasons are checked in this order: `invalid_type`, `invalid_format` /
 * `invalid_length`, `invalid_check_digit`, `restricted`,
 * `invalid_barcode_type` and `invalid_category`. Failures are shared frozen objects (no allocation on
 * the invalid path).
 *
 * Perf notes (see bench/parse-gtin.bench.ts): on valid codes, ~30-35%
 * slower than `normalizeGtin` on node and bun (result object, `value` and
 * trimming, ~5% that `trim: false` saves). Prefer
 * `normalizeGtin` when only the canonical form is needed.
 *
 * @example
 * ```typescript
 * parseGtin(36000291452);
 * // 👈 { success: true, value: "036000291452", type: "upca", gtin: "00036000291452", inputType: null, indicator: 0, category: "trade_item" }
 * parseGtin("0036000291452");
 * // 👈 { success: true, value: "036000291452", type: "upca", gtin: "00036000291452", inputType: "ean13", ... }
 * parseGtin(4006380000000); // 👈 { success: false, reason: "invalid_check_digit" }
 * parseGtin("96385074", { types: ["ean13", "upca"] }); // 👈 { success: false, reason: "invalid_barcode_type" }
 * parseGtin(36000291452, { inputTypes: ["string"] }); // 👈 { success: false, reason: "invalid_type" }
 * parseGtin(" 4006381333931\n"); // 👈 { success: true, value: "4006381333931", type: "ean13", ... } (trimmed)
 * parseGtin(" 4006381333931", { trim: false }); // 👈 { success: false, reason: "invalid_format" }
 * parseGtin("9781861972712"); // 👈 { success: true, value: "9781861972712", type: "ean13", ..., category: "isbn" }
 * parseGtin("9781861972712", { categories: ["trade_item"] }); // 👈 { success: false, reason: "invalid_category" }
 * parseGtin("04252614", { upce: true });
 * // 👈 { success: true, value: "042100005264", type: "upca", gtin: "00042100005264", inputType: "upce", ... }
 * ```
 *
 * @param value - GTIN as a string (digits only, see `trim`), a non-negative
 *   safe integer or a non-negative bigint
 * @param options.minLength - minimum number of digits of the input, as given
 *   (leading zeros of strings included), between 1 and 14. Default `8`.
 * @param options.acceptRestricted - accept restricted circulation numbers
 *   (with `category: "restricted"`). Default `false`.
 * @param options.types - accepted barcode types, matched on `type`. Default
 *   all: `["ean8", "upca", "ean13", "gtin14"]`.
 * @param options.inputTypes - accepted JavaScript types of the value. Default
 *   all: `["string", "number", "bigint"]`.
 * @param options.trim - remove leading and trailing whitespace of strings.
 *   Default `true`.
 * @param options.upce - read 8 digit strings as UPC-E (expanded to their
 *   UPC-A) instead of EAN-8. Default `false`.
 * @param options.categories - accepted categories (`trade_item`, `isbn`,
 *   `ismn`, `issn`, `coupon`, `refund_receipt`, `restricted`). Default all.
 * @throws RangeError when minLength is not an integer between 1 and 14
 */
export const parseGtin = (
  value: unknown,
  options?: ParseGtinOptions
): ParseGtinResult => {
  const inputTypes = options?.inputTypes;
  if (
    inputTypes !== undefined &&
    !inputTypes.includes(typeof value as GtinInputType)
  ) {
    // validates minLength (throws a RangeError) like for any other value
    toGtinDigits(null, options);
    return failures.invalid_type;
  }
  let digits = toGtinDigits(value, options);
  if (digits === null) {
    return getDigitsFailure(value);
  }
  let inputType: BarcodeFormat | null =
    typeof value === "string" ? getInputType(digits.length) : null;
  if (inputType === "ean8" && options?.upce === true) {
    // validated as the expanded UPC-A (check digit, restricted ranges)
    digits = expandUpcEDigits(digits);
    if (digits === null) {
      return failures.invalid_format;
    }
    inputType = "upce";
  }
  if (!hasValidGtinCheckDigit(digits)) {
    return isDigitsOnly(digits)
      ? failures.invalid_check_digit
      : failures.invalid_format;
  }
  const restricted = isRestrictedGtinDigits(digits);
  if (restricted && options?.acceptRestricted !== true) {
    return failures.restricted;
  }
  const type = getGtinType(digits);
  if (options?.types !== undefined && !options.types.includes(type)) {
    return failures.invalid_barcode_type;
  }
  const category = restricted ? "restricted" : getGtinCategory(digits);
  if (
    options?.categories !== undefined &&
    !options.categories.includes(category)
  ) {
    return failures.invalid_category;
  }
  return {
    success: true,
    value: toLength(digits, getValueLength(type)),
    type,
    gtin: toLength(digits, 14),
    inputType,
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
 * @param options.acceptRestricted - accept restricted circulation numbers
 *   (with `category: "restricted"`). Default `false`.
 * @param options.types - accepted barcode types, matched on `type`. Default
 *   all: `["ean8", "upca", "ean13", "gtin14"]`.
 * @param options.inputTypes - accepted JavaScript types of the value. Default
 *   all: `["string", "number", "bigint"]`.
 * @param options.trim - remove leading and trailing whitespace of strings.
 *   Default `true`.
 * @param options.upce - read 8 digit strings as UPC-E (expanded to their
 *   UPC-A) instead of EAN-8. Default `false`.
 * @param options.categories - accepted categories (`trade_item`, `isbn`,
 *   `ismn`, `issn`, `coupon`, `refund_receipt`, `restricted`). Default all.
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
