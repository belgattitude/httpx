import type {
  ParseDsnOptions,
  ParsedDsn,
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
  // eslint-disable-next-line regexp/no-unused-capturing-group,regexp/no-misleading-capturing-group
  /^(?<driver>([\w+-]{1,40})):\/\/((?<user>[^/:]{1,200})?(:(?<pass>.{0,200}))?@)?(?<host>[^/:]{1,200}?)(:(?<port>\d+)?)?(\/(?<db>([.#@$\w-])+))?(\?(?<params>.{1,1000}))?$/;

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
  const opts = { ...defaultOptions, ...(options ?? {}) };
  const { lowercaseDriver, overrides = {} } = opts;
  const matches = dsn.match(dsnRegexp);
  if (!matches?.groups) {
    return createErrorResult('PARSE_ERROR');
  }
  const parsed: Record<string, unknown> = {};
  Object.entries(matches.groups).forEach(([key, value]) => {
    if (typeof value === 'string') {
      switch (key) {
        case 'driver':
          parsed.driver = lowercaseDriver ? value.toLowerCase() : value;
          break;
        case 'port':
          parsed.port = Number.parseInt(value, 10);
          break;
        case 'params':
          parsed.params = parseQueryParams(value);
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
    return createErrorResult(
      'INVALID_PORT',
      `Invalid port: ${val.port as unknown as number}`
    );
  }
  return {
    success: true,
    value: val,
  };
};
