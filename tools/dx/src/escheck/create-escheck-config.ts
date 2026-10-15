/**
 * es-check configuration, as read from `.escheckrc` (es-check doesn't ship types).
 *
 * @see https://github.com/yowainwright/es-check#configuration
 */
export type EscheckConfig = {
  ecmaVersion?: string;
  files: string | string[];
  not?: string[];
  module?: boolean;
  allowHashBang?: boolean;
  checkFeatures?: boolean;
  checkBrowser?: boolean;
  browserslistQuery?: string;
  browserslistPath?: string;
  browserslistEnv?: string;
  ignore?: string;
  allowList?: string;
  looseGlobMatching?: boolean;
};

export type CreateEscheckConfigOptions = {
  /**
   * Check the files against the ES version supported by the browsers of the package
   * `.browserslistrc` (resolved from the current working directory) instead of es2022.
   * @default false
   */
  browserslist?: boolean;
};

/**
 * es-check base for the publishable packages: the esm files in `dist`.
 */
export const createEscheckConfig = (
  options: CreateEscheckConfigOptions = {}
): EscheckConfig => {
  const { browserslist = false } = options;
  return {
    ...(browserslist ? { checkBrowser: true } : { ecmaVersion: "es2022" }),
    module: true,
    files: ["./dist/**/*.{js,mjs}"],
    not: ["./dist/**/*.map.js"],
    allowHashBang: false,
  };
};
