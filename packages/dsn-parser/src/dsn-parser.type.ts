export type ParsedDsn = {
  db?: string | undefined;
  driver: string;
  host: string;
  /** Query params */
  params?: Record<string, boolean | number | string> | undefined;
  pass?: string | undefined;
  port?: number | undefined;
  user?: string | undefined;
};

export type ParseDsnOptions = {
  /** Whether to lowercase parsed driver name, default: false */
  lowercaseDriver?: boolean | undefined;
  /** Overrides parsed values by those one (except query params) */
  overrides?: Omit<Partial<ParsedDsn>, 'params'> | undefined;
};

export const errorReasons = {
  EMPTY_DSN: 'DSN cannot be empty',
  INVALID_ARGUMENT: 'DSN must be a string',
  INVALID_PORT: 'Invalid port',
  PARSE_ERROR: 'Cannot parse DSN',
} as const;

export type ErrorReasons = keyof typeof errorReasons;

type ParserSuccessResult = {
  success: true;
  value: ParsedDsn;
};

export type ParserErrorResult = {
  message: string;
  reason: ErrorReasons;
  success: false;
};

export type ParserResult = ParserErrorResult | ParserSuccessResult;

declare const tag: unique symbol;

export type WeakOpaqueContainer<Token> = {
  readonly [tag]: Token;
};

export type ParsableDsn = string & WeakOpaqueContainer<'ParsableDsn'>;
