type Serializables =
  | Record<string, unknown>
  | unknown[]
  | Date
  | Map<string, unknown>
  | string
  | number
  | boolean
  | bigint
  | null;

export const createStableStr = <T extends Serializables>(value: T): string => {
  return JSON.stringify(value, (_, val) => {
    if (val === undefined) {
      return '[undefined]';
    }
    if (val === null) {
      return null;
    }
    if (val instanceof Map) {
      return val;
    }
    return val;
  });
};
