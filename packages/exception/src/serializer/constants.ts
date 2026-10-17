/**
 * Maximum depth of nested error causes kept when (de-)serializing,
 * deeper causes are dropped (prevents stack overflows on cyclic or crafted causes)
 * @internal
 */
export const maxCauseDepth = 10;
