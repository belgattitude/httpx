// eslint-disable-next-line import-x/no-nodejs-modules,no-restricted-imports

import { globalCache } from '../cache/global-cache';
import type { Base64Encoder } from './base64.types';

// https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings/77383580#77383580

const cb = (m: string): number => m.codePointAt(0)!;
function base64ToBytes(base64: string) {
  try {
    const binString = globalThis.atob(base64);
    return Uint8Array.from(binString, cb);
  } catch (error) {
    throw new Error(
      `Invalid Base64 input: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

function bytesToBase64(bytes: Uint8Array) {
  const binString = Array.from(bytes, (byte) =>
    String.fromCodePoint(byte)
  ).join('');
  return globalThis.btoa(binString);
}

export const Base64Browser = {
  encode: (input: string): string => {
    return bytesToBase64(globalCache.utf8TextEncoder.encode(input));
  },
  decode: (input: string): string => {
    return globalCache.utf8TextDecoder.decode(base64ToBytes(input));
  },
} as const satisfies Base64Encoder;
