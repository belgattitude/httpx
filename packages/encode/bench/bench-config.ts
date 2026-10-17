import { vitestBenchOptionsConfig } from "@httpx/devtools-vitest";

const { isCiOrCodSpeed } = vitestBenchOptionsConfig;

const longString = `😊-abcdef-éàù-012345a Ā 文 🦄`.repeat(
  isCiOrCodSpeed ? 30 : 100
);

export const benchConfig = {
  longString,
  // pseudo random bytes, same byte length as the utf-8 encoded longString
  longBytes: Uint8Array.from(
    { length: new TextEncoder().encode(longString).length },
    (_, i) => (i * 7919 + 13) % 256
  ),
  benchOptions: {
    iterations: isCiOrCodSpeed ? 2 : 4,
  },
} as const;
