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

/**
 * Generate rows referencing a small pool of shared objects (referentially
 * equal), the case where superjson `dedupe` option can make a difference.
 */
export const generateArrayOfDataWithSharedRefs = (
  rows: number,
  sharedPoolSize = 10
) => {
  const sharedPool = Array.from({ length: sharedPoolSize }, (_, i) => {
    return {
      id: i,
      name: `Category ${i}`,
      description: `Shared category description ${i} 🦆`,
      createdAt: new Date(Date.UTC(2026, 0, 1 + i)),
      tags: ["shared", `tag-${i}`, `group-${i % 3}`],
    };
  });
  return {
    success: true,
    rows: Array.from({ length: rows }, (_, i) => {
      return {
        id: 1000 + i,
        name: `Item ${1000 + i}`,
        category: sharedPool[i % sharedPoolSize],
      };
    }),
  };
};
