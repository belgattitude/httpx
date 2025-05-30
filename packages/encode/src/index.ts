import type { Base64Encoder } from './base64/base64.types';

let b64: Base64Encoder = null as unknown as Base64Encoder;

try {
  if (globalThis.atob !== undefined) {
    b64 = await import('./base64/base64.browser.js').then(
      (mod) => mod.Base64Browser
    );
  } else if (globalThis.Buffer === undefined) {
    b64 = await import('./base64/base64.nodejs.js').then(
      (mod) => mod.Base64NodeJs
    );
  }
} catch {
  b64 = await import('./base64/base64.purejs.js').then(
    (mod) => mod.Base64Purejs
  );
}

export const Base64 = b64;
