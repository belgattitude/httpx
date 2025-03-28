export const globalCache = {
  utf8TextDecoder: new globalThis.TextDecoder('utf8'),
  utf8TextEncoder: new globalThis.TextEncoder('utf8'),
} as const;
