import { isParsableNumber } from './dsn-parser.util';

type ParseQueryParamsOptions = {
  parseBooleans?: boolean;
  parseNumbers?: boolean;
  setTrueForUndefinedValues?: boolean;
};

const defaultOptions = {
  parseBooleans: true,
  parseNumbers: true,
  setTrueForUndefinedValues: true,
};

export const parseQueryParams = (
  queryParams: string,
  options?: ParseQueryParamsOptions
): Record<string, boolean | null | number | string> => {
  const { parseBooleans, parseNumbers, setTrueForUndefinedValues } = {
    ...defaultOptions,
    ...(options ?? {}),
  };
  const defaultValue = setTrueForUndefinedValues ? true : null;
  const parts = queryParams.split('&').filter((v) => v.trim().length > 0);
  return parts.reduce((acc, keyValuePair) => {
    const [key, value = null] = keyValuePair.split('=') as [
      string,
      string | undefined,
    ];
    let val;
    if (typeof value === 'string') {
      if (parseNumbers && isParsableNumber(value)) {
        val = Number.parseInt(value, 10);
      } else {
        val =
          parseBooleans && ['false', 'true'].includes(value)
            ? value === 'true'
            : decodeURIComponent(value);
      }
    } else {
      val = defaultValue;
    }
    return { ...acc, ...{ [key]: val } };
  }, {});
};
