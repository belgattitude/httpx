export type ParsedDsn = {
  db?: string;
  driver: string;
  host: string;
  /** Query params */
  params?: Record<string, boolean | number | string>;
  pass?: string;
  port?: number;
  user?: string;
};

export type ParseDsnOptions = {
  /** Whether to lowercase parsed driver name, default: false */
  lowercaseDriver?: boolean;
  /** Overrides parsed values by those one (except query params) */
  overrides?: Omit<Partial<ParsedDsn>, 'params'>;
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
