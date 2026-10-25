import prettyBytes from "pretty-bytes";

/** Format milliseconds with a readable unit (ns, µs, ms) */
export const formatTime = (ms: number): string => {
  if (ms < 0.001) {
    return `${Math.round(ms * 1e6)} ns`;
  }
  if (ms < 1) {
    return `${(ms * 1000).toFixed(1)} µs`;
  }
  if (ms < 10) {
    return `${ms.toFixed(2)} ms`;
  }
  return ms < 100 ? `${ms.toFixed(1)} ms` : `${Math.round(ms)} ms`;
};

export const formatBytes = (bytes: number): string =>
  prettyBytes(bytes, { maximumFractionDigits: 1 });
