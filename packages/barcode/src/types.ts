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

/** Validation options shared by the guards, assertions and detection */
export type GtinValidationOptions = {
  /**
   * Accept GS1 Restricted Circulation Numbers (RCN), see
   * `isRestrictedCirculation`: EAN-8 starting with 0 or 2, EAN-13 starting
   * with 02, 04 or 20-29, UPC-A starting with 2 or 4 (and GTIN-14 containing
   * them). Those codes are only meaningful within a company or a geographic
   * region (ie: in-store labels, variable measure items with an embedded
   * weight or price).
   * @default false
   */
  acceptRestricted?: boolean;
};

/** Trim option of the functions returning a value (not the type guards) */
export type GtinTrimOptions = {
  /**
   * Remove leading and trailing whitespace of strings (spaces, tabs, line
   * breaks, non-breaking spaces, BOM: `String.prototype.trim`), ie: values
   * from CSV or spreadsheets. Lengths (ie: `minLength`) apply to the trimmed
   * string. Type guards, assertions and `detectBarcodeType` never trim
   * (they validate the value as is, it can't be narrowed to a trimmed one),
   * `isRestrictedCirculation` only with `trim: true`.
   * @default true
   */
  trim?: boolean;
};

/** UPC-E option of `parseGtin` (and `createGtinParser`) */
export type UpcEOptions = {
  /**
   * Read 8 digit strings as UPC-E (zero-suppressed UPC-A) instead of EAN-8.
   * Both have 8 digits and can't be told apart from their digits: only set it
   * when the source is known to be UPC-E (ie: the scanner symbology). Numbers
   * and bigints are never read as UPC-E (leading zero lost), pass a string.
   * `minLength` counts a UPC-E as its expanded UPC-A (12 digits).
   * @default false
   */
  upce?: boolean;
};
