import { vitestBenchOptionsConfig } from "@httpx/devtools-vitest";

const { isCiOrCodSpeed } = vitestBenchOptionsConfig;
export const benchConfig = {
  longString: `😊-abcdef-éàù-012345a Ā 文 🦄`.repeat(isCiOrCodSpeed ? 50 : 400),
  benchOptions: {
    iterations: isCiOrCodSpeed ? 2 : 10,
  },
} as const;
