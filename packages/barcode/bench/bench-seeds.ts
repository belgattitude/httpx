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
