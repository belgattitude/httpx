type DrainOuterGeneric<T> = [T] extends [unknown] ? T : never;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ShallowRecord<K extends keyof any, T> = DrainOuterGeneric<Record<K, T>>;

function isObject(obj: unknown): obj is ShallowRecord<string, unknown> {
  return typeof obj === 'object' && obj !== null;
}

function getTag(value: unknown): string {
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]';
  }

  return Object.prototype.toString.call(value);
}

export function kyselyIsPlainObject(
  obj: unknown
): obj is Record<string, unknown> {
  if (!isObject(obj) || getTag(obj) !== '[object Object]') {
    return false;
  }

  if (Object.getPrototypeOf(obj) === null) {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  let proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
}
