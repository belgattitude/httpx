import {
  type ErrorReasons,
  errorReasons,
  type ParsedDsn,
  type ParseDsnOptions,
  type ParserErrorResult,
} from './dsn-parser.type';

export const createErrorResult = (
  reason: ErrorReasons,
  msg?: string
): ParserErrorResult => {
  return {
    message: msg ?? errorReasons[reason],
    reason: reason,
    success: false,
  };
};

export const isNonEmptyString = (
  value: unknown,
  trim = true
): value is string => {
  return typeof value === 'string' && (trim ? value.trim() : value).length > 0;
};

const parsableNumberRegexp = /^-?\d{1,16}$/;

export const isParsableNumber = (value: unknown): value is number => {
  return typeof value === 'string' && parsableNumberRegexp.test(value);
};

type ValidNetworkPort = number;

export const isValidNetworkPort = (port: number): port is ValidNetworkPort => {
  return !Number.isNaN(port) && port < 65_536 && port > 0;
};

export const removeUndefined = (
  obj: Record<string, unknown>
): Record<string, unknown> => {
  return Object.keys(obj).reduce<Record<string, unknown>>((acc, key) => {
    if (obj[key] !== undefined) acc[key] = obj[key];
    return acc;
  }, {});
};

export const mergeDsnOverrides = (
  parsedDsn: ParsedDsn,
  overrides: Exclude<ParseDsnOptions['overrides'], undefined>
): ParsedDsn => {
  const merged: Record<string, unknown> = {};
  const { params, ...restDsn } = parsedDsn;
  for (const [key, value] of Object.entries(restDsn)) {
    merged[key] =
      key in overrides ? (overrides as Record<string, unknown>)[key] : value;
  }
  merged.params = params;
  return merged as unknown as ParsedDsn;
};
