export const errPfx = 'Value is expected to be';
export const getTypeInfo = (v: unknown): string => {
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
    case typeof v === 'bigint': {
      type = `bigint(length:${v.toString().length})`;
      break;
    }
    case Array.isArray(v): {
      type = `array(size:${v.length})`;
      break;
    }
    case Number.isNaN(v): {
      type = `NaN`;
      break;
    }
    case typeof v === 'number': {
      type = `number(length:${v.toString().length})`;
      break;
    }
    case v === false || v === true: {
      type = `boolean(${v})`;
      break;
    }
    case typeof v === 'string': {
      type = `string(length:${v.length})`;
      break;
    }
    default:
  }
  return type;
};
