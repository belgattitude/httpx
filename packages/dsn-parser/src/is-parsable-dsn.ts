import type { ParsableDsn } from './dsn-parser.type';
import { parseDsn } from './parse-dsn';

export const isParsableDsn = (dsn: unknown): dsn is ParsableDsn => {
  const parsed = parseDsn(dsn as string);
  return parsed.success;
};
