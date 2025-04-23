import type { Base64Encoder } from './base64/base64.types';

const isNodeJs = globalThis.process !== undefined;
const isBrowser = globalThis.window !== undefined;

let b64: Base64Encoder;

if (isBrowser) {
  b64 = require('./base64/base64.browser');
} else if (isNodeJs) {
  b64 = require('./base64/base64.nodejs');
} else {
  b64 = require('./base64/base64.purejs');
}

export const Base64 = b64;
