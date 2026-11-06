/**
 * Whether a 12 digit UPC-A starts with `0000`: its GTIN-14 form has 6 leading
 * zeros, it's an EAN-8 (GS1-8 range), not a UPC-A.
 *
 * @internal
 */
export const isUpcAInGtin8Range = (upca: string): boolean =>
  upca.startsWith("0000");

/**
 * Expand a UPC-E (8 chars) to its UPC-A (12 chars, check digit kept as is).
 * Returns `null` when the number system isn't 0 or 1, or when the UPC-A would
 * start with `0000`: the GTIN-8 range (same GTIN-14 as an EAN-8, ie:
 * "000010000007" is the EAN-8 "10000007"), no UPC-A is issued there. Digits
 * and check digit are NOT validated (see isValidGtinDigits on the result).
 *
 * Expansion, from the last data digit (d6) of `S d1 d2 d3 d4 d5 d6 C`:
 *  - 0, 1, 2: `S d1 d2 d6 0000 d3 d4 d5 C`
 *  - 3:       `S d1 d2 d3 00000 d4 d5 C`
 *  - 4:       `S d1 d2 d3 d4 00000 d5 C`
 *  - 5 to 9:  `S d1 d2 d3 d4 d5 0000 d6 C`
 *
 * @internal
 */
export const expandUpcEDigits = (upce: string): string | null => {
  const system = upce.charAt(0);
  if (upce.length !== 8 || (system !== "0" && system !== "1")) {
    return null;
  }
  const d = upce.slice(1, 7);
  const last = upce.charAt(6);
  let body: string;
  if (last === "0" || last === "1" || last === "2") {
    body = `${d.slice(0, 2)}${last}0000${d.slice(2, 5)}`;
  } else if (last === "3") {
    body = `${d.slice(0, 3)}00000${d.slice(3, 5)}`;
  } else if (last === "4") {
    body = `${d.slice(0, 4)}00000${d.charAt(4)}`;
  } else {
    body = `${d.slice(0, 5)}0000${last}`;
  }
  const upca = `${system}${body}${upce.charAt(7)}`;
  return isUpcAInGtin8Range(upca) ? null : upca;
};
