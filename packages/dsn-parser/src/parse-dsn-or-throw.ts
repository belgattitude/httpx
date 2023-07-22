import type { ParsedDsn, ParseDsnOptions } from './dsn-parser.type';
import { parseDsn } from './parse-dsn';

export const parseDsnOrThrow = (
  dsn: unknown,
  options?: ParseDsnOptions & {
    errorMsgPrefix?: string;
  }
): ParsedDsn => {
  const parsedOrError = parseDsn(dsn, options);
  if (parsedOrError.success) {
    return parsedOrError.value;
  }
  const pfx = options?.errorMsgPrefix ?? `Can't parse dsn`;
  throw new Error(`${pfx}: ${parsedOrError.message} (${parsedOrError.reason})`);
};
