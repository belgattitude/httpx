export const globalCache = {
  utf8TextDecoder: new globalThis.TextDecoder(),
  utf8TextEncoder: new globalThis.TextEncoder(),
} as const;
