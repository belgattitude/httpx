declare const tag: unique symbol;

/**
 * Compile-time only brand (no runtime cost), a plain string remains assignable
 * from a branded one but not the other way around.
 */
export type WeakOpaqueContainer<Token> = {
  readonly [tag]: Token;
};

/** EAN-13 (GTIN-13): 13 digits with a valid check digit */
export type Ean13 = string & WeakOpaqueContainer<"Ean13">;
/** EAN-8 (GTIN-8): 8 digits with a valid check digit */
export type Ean8 = string & WeakOpaqueContainer<"Ean8">;
/** UPC-A (GTIN-12): 12 digits with a valid check digit */
export type UpcA = string & WeakOpaqueContainer<"UpcA">;
/** GTIN-14: 14 digits with a valid check digit */
export type Gtin14 = string & WeakOpaqueContainer<"Gtin14">;
/**
 * UPC-E: 8 digits, zero-suppressed form of a UPC-A (number system 0 or 1, 6
 * digits, check digit of the expanded UPC-A). Not a GTIN by itself, see
 * `expandUpcE`.
 */
export type UpcE = string & WeakOpaqueContainer<"UpcE">;
/** Any valid GTIN (GTIN-8, GTIN-12, GTIN-13 or GTIN-14) */
export type Gtin = Ean13 | Ean8 | UpcA | Gtin14;

/** Supported GTIN lengths */
export type GtinLength = 8 | 12 | 13 | 14;

/** Branded GTIN type for each length */
export type GtinByLength = {
  8: Ean8;
  12: UpcA;
  13: Ean13;
  14: Gtin14;
};

/** Trim option of the functions returning a value (not the type guards) */
export type GtinTrimOptions = {
  /**
   * Remove leading and trailing whitespace of strings (spaces, tabs, line
   * breaks, non-breaking spaces, BOM: `String.prototype.trim`), ie: values
   * from CSV or spreadsheets. Lengths (ie: `minLength`) apply to the trimmed
   * string. Type guards, assertions and `detectBarcodeType` never trim
   * (they validate the value as is, it can't be narrowed to a trimmed one),
   * `isInStoreGtin` only with `trim: true`.
   * @default true
   */
  trim?: boolean;
};

/**
 * How 8 digit strings starting with `0` that are both a valid UPC-E and a
 * (restricted) EAN-8 with a valid check digit are read, see the `upce` option
 */
export type UpcEDetectionMode = "prefer-ean8" | "prefer-upce";

/**
 * UPC-E option of `parseGtin` (and `createGtinParser`) and
 * `detectBarcodeType`
 */
export type UpcEOptions = {
  /**
   * How 8 digit strings are read:
   *  - `false`: as EAN-8.
   *  - `true`: as UPC-E (zero-suppressed UPC-A). Set it when the source is
   *    known to be UPC-E (ie: the scanner symbology).
   *  - `"prefer-ean8"` and `"prefer-upce"`: detected. As UPC-E when it
   *    starts with `0` (the UPC-E number system of the GS1 General
   *    Specifications) and is a valid UPC-E, as EAN-8 otherwise. An EAN-8
   *    starting with `0` is restricted circulation (ie: an in-store code): a
   *    regular EAN-8 is never read as UPC-E. But the same 8 digits can be
   *    both a valid UPC-E and a restricted EAN-8 with a valid check digit
   *    (more than half of the UPC-E), the modes differ on those:
   *      - `"prefer-ean8"` (safest): kept as EAN-8 (`parseGtin` category
   *        `in_store`). An in-store code is never expanded to a UPC-A, but
   *        only the UPC-E that can't be an EAN-8 are detected.
   *      - `"prefer-upce"`: read as UPC-E, every UPC-E is detected but an
   *        in-store EAN-8 starting with `0` can be expanded to the UPC-A of
   *        another product. Only when the source has no in-store codes.
   *    UPC-E with the number system `1` (ie: `10000168`, a scanner
   *    extension) are only read with `true`.
   *
   * Numbers and bigints are never read as UPC-E (leading zero lost), pass a
   * string. `minLength` counts a UPC-E as its expanded UPC-A (12 digits).
   * @default false (`"prefer-ean8"` with `parseGtin` when `formats` lists
   *   `"upce"`)
   */
  upce?: boolean | UpcEDetectionMode;
};
