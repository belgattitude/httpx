// eslint-disable-next-line import-x/no-nodejs-modules,no-restricted-imports

import { globalCache } from '../global-cache';
import type { Base64Encoder } from './base64.types';

// https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings/77383580#77383580

const cb = (m: string): number => m.codePointAt(0)!;
function base64ToBytes(base64: string) {
  const binString = globalThis.atob(base64);

  return Uint8Array.from(binString, cb);
}

function bytesToBase64(bytes: Uint8Array) {
  const binString = Array.from(bytes, (byte) =>
    String.fromCodePoint(byte)
  ).join('');
  return globalThis.btoa(binString);
}

export const Base64Browser = {
  /*
  encode: (input: string): string =>
    Array.from(globalCache.utf8TextEncoder.encode(input), (byte) =>
      String.fromCodePoint(byte)
    ).join(''),
  */
  encode: (input: string): string => {
    return bytesToBase64(globalCache.utf8TextEncoder.encode(input));
  },

  decode: (input: string): string => {
    return new TextDecoder().decode(base64ToBytes(input));
  },
} as const satisfies Base64Encoder;
