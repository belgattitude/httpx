import { Base64Purejs } from "../src/base64/base64.purejs";
import type { Base64Encoder } from "../src/base64/base64.types";

// Every implementation available in the current runtime

const isNodeLike = !("window" in globalThis);
const hasAtob = typeof globalThis.atob === "function";

const base64Node = isNodeLike
  ? await import("../src/base64/base64.node20").then((mod) => mod.Base64Node20)
  : null;

const base64Atob = hasAtob
  ? await import("../src/base64/base64.atob").then((mod) => mod.Base64Atob)
  : null;

export const isUint8ArrayBase64Supported =
  typeof Uint8Array.fromBase64 === "function";

const base64Uint8Array = isUint8ArrayBase64Supported
  ? await import("../src/base64/base64.uint8array").then(
      (mod) => mod.Base64Uint8Array
    )
  : null;

export const testRealms = [
  ["pure-js", Base64Purejs],
  base64Node ? ["node20", base64Node] : undefined,
  base64Atob ? ["atob", base64Atob] : undefined,
  base64Uint8Array ? ["uint8array", base64Uint8Array] : undefined,
].filter(Boolean) as [string, Base64Encoder][];

// Captures the outcome of a decode/encode call, errors included
export const run = (fn: () => string): { value: string } | { error: true } => {
  try {
    return { value: fn() };
  } catch {
    return { error: true };
  }
};
