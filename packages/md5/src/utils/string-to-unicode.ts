const encoder = new TextEncoder();

export function stringToUnicode(str: string): string {
  const bytes = encoder.encode(str);
  let result = '';
  for (const byte of bytes) {
    result += String.fromCodePoint(byte);
  }
  return result;
}
