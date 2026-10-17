export const __httpx_encode_base64_cache = {
  // Keep a leading BOM (U+FEFF), the default would silently strip it
  utf8TextDecoder: new globalThis.TextDecoder("utf-8", { ignoreBOM: true }),
  utf8TextEncoder: new globalThis.TextEncoder(),
} as const;
