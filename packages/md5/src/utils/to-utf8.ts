const encoder = new TextEncoder();

function hasNonAscii(str: string): boolean {
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 127) {
      return true;
    }
  }
  return false;
}

/**
 * Converts a string (ascii, utf8, utf-16) into its
 * UTF-8 encoded representation.
 */
export function toUtf8(str: string): string {
  if (str.length < 4000 && !hasNonAscii(str)) {
    return str;
  }

  const bytes = encoder.encode(str);
  let utf8 = '';
  for (const byte of bytes) {
    utf8 += String.fromCodePoint(byte);
  }
  return utf8;
}
