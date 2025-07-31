export const generateArrayOfData = (
  rows: number,
  extendedTypeSupport: boolean
) => {
  return {
    success: true,
    rows: Array.from({ length: rows }, (_, i) => {
      return {
        id: 1000 + i,
        name: `Item ${1000 + i}`,
        description: `Long description ${1000 + i} 🦆`,
        testNull: null,
        ...(extendedTypeSupport
          ? {
              date: new Date(Date.now() - i * 1000),
              bigint: BigInt(1000 + i),
              testUndefined: undefined,
              notNumber: Number.NaN,
            }
          : {}),
      };
    }),
  };
};
