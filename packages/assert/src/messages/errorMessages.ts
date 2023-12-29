export const errPfx = 'Value is expected to be';
export const getType = (v: unknown): string => {
  let type: string = typeof v;
  switch (true) {
    case v instanceof Date: {
      type = 'Date';
      break;
    }
    case v instanceof Error: {
      type = 'Error';
      break;
    }
    case typeof v === 'function': {
      type = 'function';
      break;
    }
    case v === null: {
      type = 'null';
      break;
    }
    case v === undefined: {
      type = 'undefined';
      break;
    }
    case Number.isNaN(v): {
      type = `NaN`;
      break;
    }
    case v === false || v === true: {
      type = `boolean(${v})`;
      break;
    }
    case typeof v === 'string': {
      type = `string(${v.length})`;
      break;
    }

    default:
      v = typeof v;
  }
  return type;
};
const vowels = new Set(['a', 'e', 'i', 'o', 'u', 'y']);
export const formatErrMsg = (
  msg: string,
  v: unknown,
  options?: {
    pfx: boolean;
  }
): string => {
  const { pfx = true } = options ?? {};
  return `${
    pfx
      ? `${errPfx} ${vowels.has((msg?.[0] ?? '').toLowerCase()) ? 'an' : 'a'} `
      : ''
  }${msg}, got: ${getType(v)}`;
};
