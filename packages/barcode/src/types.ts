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
