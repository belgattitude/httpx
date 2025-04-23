import isCI from 'is-ci';
export const benchConfig = {
  longString: `😊-abcdef-éàù-012345a Ā 文 🦄`.repeat(500),
  benchOptions: {
    iterations: isCI ? 3 : 10,
  },
} as const;
