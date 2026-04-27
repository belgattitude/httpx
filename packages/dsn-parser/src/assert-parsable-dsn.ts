import type { ParsableDsn } from './dsn-parser.type';
import { parseDsn } from './parse-dsn';

/**
 * @throws Error when not parsable
 */
export const assertParsableDsn = (
  dsn: unknown,
  msg?: string
): asserts dsn is ParsableDsn => {
  if (typeof dsn !== 'string') {
    throw new TypeError('dsn: must be a string.');
  }
  const parsed = parseDsn(dsn);
  if (!parsed.success) {
    throw new Error(msg ?? `${parsed.message} (${parsed.reason})`);
  }
};
