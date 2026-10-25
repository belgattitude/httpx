/**
 * High resolution time in milliseconds (Date.now() fallback).
 */
export const now = (): number =>
  typeof performance === "undefined" ? Date.now() : performance.now();

/**
 * Round milliseconds to 2 decimals (max).
 */
export const roundMs = (ms: number): number => Math.round(ms * 100) / 100;

/**
 * Milliseconds elapsed since start (a now() value), rounded to 2 decimals.
 */
export const elapsedSince = (start: number): number => roundMs(now() - start);
