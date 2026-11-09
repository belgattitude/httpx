const computeCheckDigit = (payload: string): number => {
  let sum = 0;
  for (let i = payload.length - 1, w = 3; i >= 0; i--, w = 4 - w) {
    sum += (Number(payload[i]) || 0) * w;
  }
  return (10 - (sum % 10)) % 10;
};

/**
 * Deterministic (seeded) list of codes close to real life usage: mostly
 * ean13, then upca, ean8 and gtin14. ~20% are invalid (wrong check digit,
 * unsupported length or non digit character).
 */
/**
 * Deterministic (seeded) list of 8 digit codes, as scanned from small
 * packages: half valid EAN-8 (not restricted), half valid UPC-E (number
 * system 0, the common one, every zero-suppression pattern). ~10% have a
 * wrong check digit.
 */
export const getEightDigitSeeds = (count = 1000): string[] => {
  let seed = 3;
  const random = () => (seed = (seed * 16_807) % 2_147_483_647) / 2_147_483_647;
  const digit = () => String(Math.floor(random() * 10));
  return Array.from({ length: count }, (_, n) => {
    // first digit 1-9: not restricted (EAN-8), not the GTIN-8 range (UPC-E)
    let data = String(1 + Math.floor(random() * 9));
    for (let i = 0; i < 5; i++) {
      data += digit();
    }
    let payload: string;
    let checkDigit: number;
    if (n % 2 === 0) {
      payload = `${data}${digit()}`;
      if (payload.startsWith("2")) {
        payload = `3${payload.slice(1)}`;
      }
      checkDigit = computeCheckDigit(payload);
    } else {
      // check digit of the expanded UPC-A (GS1 zero-suppression table)
      const last = data.charAt(5);
      let body: string;
      if (last <= "2") {
        body = `${data.slice(0, 2)}${last}0000${data.slice(2, 5)}`;
      } else if (last === "3") {
        body = `${data.slice(0, 3)}00000${data.slice(3, 5)}`;
      } else if (last === "4") {
        body = `${data.slice(0, 4)}00000${data.charAt(4)}`;
      } else {
        body = `${data.slice(0, 5)}0000${last}`;
      }
      payload = `0${data}`;
      checkDigit = computeCheckDigit(`0${body}`);
    }
    return `${payload}${random() < 0.1 ? (checkDigit + 1) % 10 : checkDigit}`;
  });
};

export const getBarcodeSeeds = (count = 1000): string[] => {
  let seed = 1;
  const random = () => (seed = (seed * 16_807) % 2_147_483_647) / 2_147_483_647;
  const lengths = [13, 13, 13, 13, 12, 12, 8, 14] as const;
  return Array.from({ length: count }, (_, n) => {
    const length = lengths[n % lengths.length] ?? 13;
    let payload = "";
    for (let i = 0; i < length - 1; i++) {
      payload += String(Math.floor(random() * 10));
    }
    const checkDigit = computeCheckDigit(payload);
    const code = `${payload}${checkDigit}`;
    const r = random();
    if (r < 0.1) {
      return `${payload}${(checkDigit + 1) % 10}`;
    }
    if (r < 0.15) {
      return code.slice(1);
    }
    if (r < 0.2) {
      return `${code.slice(0, 3)}a${code.slice(4)}`;
    }
    return code;
  });
};
