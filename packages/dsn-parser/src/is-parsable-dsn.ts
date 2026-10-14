import type { ParsableDsn } from "./dsn-parser.type";
import { parseDsn } from "./parse-dsn";

export const isParsableDsn = (dsn: unknown): dsn is ParsableDsn =>
  parseDsn(dsn).success;
