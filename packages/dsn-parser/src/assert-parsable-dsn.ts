import type { ParsableDsn } from './dsn-parser.type';
import { parseDsn } from './parse-dsn';

/**
 * @throws Error when not parsable
 */
export const assertParsableDsn = (
  dsn: unknown,
  msg?: string
): asserts dsn is ParsableDsn => {
  const parsed = parseDsn(dsn as string);
  if (!parsed.success) {
    throw new Error(msg || `${parsed.message} (${parsed.reason})`);
  }
};
