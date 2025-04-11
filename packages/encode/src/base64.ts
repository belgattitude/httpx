// https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings/77383580#77383580
import { base64Alphabet } from './base64-alphabet';
export class Base64 {
  static encodeNodeJs(input: string): string {
    return Buffer.from(input, 'utf8').toString('base64');
  }

  static decodeNodeJs(input: string): string {
    return Buffer.from(input, 'base64').toString('utf-8');
  }

  static encode(input: string): string {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(input);
    const length = bytes.length;
    let result = '';

    for (let i = 0; i < length; i += 3) {
      const chunk =
        (bytes[i] << 16) | ((bytes[i + 1] ?? 0) << 8) | (bytes[i + 2] ?? 0);

      result += base64Alphabet[(chunk >> 18) & 0x3f];
      result += base64Alphabet[(chunk >> 12) & 0x3f];
      result += i + 1 < length ? base64Alphabet[(chunk >> 6) & 0x3f] : '=';
      result += i + 2 < length ? base64Alphabet[chunk & 0x3f] : '=';
    }

    return result;
  }

  static decode(input: string): string {
    return globalThis.atob(input);
  }
}
