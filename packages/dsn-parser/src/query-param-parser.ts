import { isParsableNumber } from './dsn-parser.util';

type ParseQueryParamsOptions = {
  setTrueForUndefinedValues?: boolean;
  parseBooleans?: boolean;
  parseNumbers?: boolean;
};

const defaultOptions = {
  setTrueForUndefinedValues: true,
  parseBooleans: true,
  parseNumbers: true,
};

export const parseQueryParams = (
  queryParams: string,
  options?: ParseQueryParamsOptions
): Record<string, string | boolean | number | null> => {
  const { parseBooleans, setTrueForUndefinedValues, parseNumbers } = {
    ...defaultOptions,
    ...(options || {}),
  };
  const defaultValue = setTrueForUndefinedValues ? true : null;
  const parts = queryParams.split('&').filter((v) => v.trim().length > 0);
  return parts.reduce((acc, keyValuePair) => {
    const [key, value = null] = keyValuePair.split('=');
    let val;
    if (typeof value === 'string') {
      if (parseNumbers && isParsableNumber(value)) {
        val = Number.parseInt(value, 10);
      } else {
        val =
          parseBooleans && ['true', 'false'].includes(value)
            ? value === 'true'
            : decodeURIComponent(value);
      }
    } else {
      val = defaultValue;
    }
    return { ...acc, ...{ [key]: val } };
  }, {});
};
