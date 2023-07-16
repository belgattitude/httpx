import type {
  ParsedDsn,
  ParseDsnOptions,
  ErrorReasons,
  ParserErrorResult,
} from './dsn-parser.type';
import { errorReasons } from './dsn-parser.type';

export const createErrorResult = (
  reason: ErrorReasons,
  msg?: string
): ParserErrorResult => {
  return {
    success: false,
    reason: reason,
    message: msg || errorReasons[reason],
  };
};

export const isNonEmptyString = (
  value: unknown,
  trim = true
): value is string => {
  return typeof value === 'string' && (trim ? value.trim() : value).length > 0;
};

export const isParsableNumber = (value: unknown): value is number => {
  return typeof value === 'string' && /^-?\d{1,16}$/.test(value);
};

export const isValidNetworkPort = (port: number): port is number => {
  return port < 65536 && port > 0;
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
  Object.entries(restDsn).forEach(([key, value]) => {
    merged[key] =
      key in overrides ? (overrides as Record<string, unknown>)[key] : value;
  });
  merged['params'] = params;
  return merged as unknown as ParsedDsn;
};
