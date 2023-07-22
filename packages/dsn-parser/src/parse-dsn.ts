import type {
  ParsedDsn,
  ParseDsnOptions,
  ParserResult,
} from './dsn-parser.type';
import {
  createErrorResult,
  isNonEmptyString,
  isValidNetworkPort,
  mergeDsnOverrides,
  removeUndefined,
} from './dsn-parser.util';
import { parseQueryParams } from './query-param-parser';

const dsnRegexp =
  /^(?<driver>([\w-]+)):\/\/((?<user>[^/:]{1,200})?(:(?<pass>.{0,250}))?@)?(?<host>[^/:]{1,400}?)(:(?<port>\d+)?)?(\/(?<db>([.#@$\w-])+))?(\?(?<params>.+))?$/;

const defaultOptions = {
  lowercaseDriver: false,
  overrides: {},
};

export const parseDsn = (
  dsn: unknown,
  options?: ParseDsnOptions
): ParserResult => {
  if (!isNonEmptyString(dsn)) {
    return createErrorResult(
      typeof dsn !== 'string' ? 'INVALID_ARGUMENT' : 'EMPTY_DSN'
    );
  }
  const opts = { ...defaultOptions, ...(options || {}) };
  const { overrides = {}, lowercaseDriver } = opts;
  const matches = dsn.match(dsnRegexp);
  if (matches === null || !matches.groups) {
    return createErrorResult('PARSE_ERROR');
  }
  const parsed: Record<string, unknown> = {};
  Object.entries(matches.groups).forEach(([key, value]) => {
    if (typeof value === 'string') {
      switch (key) {
        case 'driver':
          parsed['driver'] = lowercaseDriver ? value.toLowerCase() : value;
          break;
        case 'port':
          parsed['port'] = Number.parseInt(value, 10);
          break;
        case 'params':
          parsed['params'] = parseQueryParams(value);
          break;
        default:
          parsed[key] = value;
      }
    }
  });
  const val = removeUndefined(
    mergeDsnOverrides(parsed as ParsedDsn, overrides)
  ) as ParsedDsn;
  if (val?.port && !isValidNetworkPort(val.port)) {
    return createErrorResult('INVALID_PORT', `Invalid port: ${val.port}`);
  }
  return {
    success: true,
    value: val,
  };
};
