import type { ParsableDsn } from './dsn-parser.type';
import { parseDsn } from './parse-dsn';

export const isParsableDsn = (dsn: unknown): dsn is ParsableDsn => {
  return parseDsn(dsn as string).success;
};
