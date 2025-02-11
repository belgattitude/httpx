const supportedTypes = new Set(['string', 'number', 'bigint']);

const collator = new Intl.Collator('en', {
  numeric: false,
  sensitivity: 'base',
});

/**
 * Will sort an array if its values are sortable and of the same type,
 * otherwise will return the original array untouched
 */
export const sortArr = <T>(arr: T[]): T[] => {
  if (arr.length <= 1) {
    return arr;
  }
  const sortable = [...arr];

  let uniqueType: null | string = null;

  // sort in ascending order
  try {
    sortable.sort((a, b) => {
      const t1 = typeof a;
      const t2 = typeof b;
      if (
        t1 !== t2 ||
        !supportedTypes.has(t1) ||
        (uniqueType !== null && uniqueType !== t1)
      ) {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw 0;
      }
      uniqueType = t1 === 'bigint' ? 'number' : t1;
      if (t1 === 'string') {
        return collator.compare(a as string, b as string);
      } else if (t1 === 'number' || t1 === 'bigint') {
        return a < b ? -1 : a > b ? 1 : 0;
      }
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw 0;
    });
  } catch {
    // ignore sorting
    return arr;
  }
  return sortable;
};
