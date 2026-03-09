/*
 * Implementation adapted from the fastest md5 implementation around (JKM md5).
 * Original author: Joseph Myers
 *
 * @see http://www.myersdaily.org/joseph/javascript/md5-text.html
 */

import { toUtf8 } from '../utils/to-utf8.ts';

const hex_chr = '0123456789abcdef'.split('');
type NumberQuadlets = [number, number, number, number];
type SixteenNumberArray = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

function md5cycle(x: NumberQuadlets, k: SixteenNumberArray): void {
  let a = x[0],
    b = x[1],
    c = x[2],
    d = x[3];

  a += (((b & c) | (~b & d)) + k[0] - 680_876_936) | 0;
  a = (((a << 7) | (a >>> 25)) + b) | 0;
  d += (((a & b) | (~a & c)) + k[1] - 389_564_586) | 0;
  d = (((d << 12) | (d >>> 20)) + a) | 0;
  c += (((d & a) | (~d & b)) + k[2] + 606_105_819) | 0;
  c = (((c << 17) | (c >>> 15)) + d) | 0;
  b += (((c & d) | (~c & a)) + k[3] - 1_044_525_330) | 0;
  b = (((b << 22) | (b >>> 10)) + c) | 0;
  a += (((b & c) | (~b & d)) + k[4] - 176_418_897) | 0;
  a = (((a << 7) | (a >>> 25)) + b) | 0;
  d += (((a & b) | (~a & c)) + k[5] + 1_200_080_426) | 0;
  d = (((d << 12) | (d >>> 20)) + a) | 0;
  c += (((d & a) | (~d & b)) + k[6] - 1_473_231_341) | 0;
  c = (((c << 17) | (c >>> 15)) + d) | 0;
  b += (((c & d) | (~c & a)) + k[7] - 45_705_983) | 0;
  b = (((b << 22) | (b >>> 10)) + c) | 0;
  a += (((b & c) | (~b & d)) + k[8] + 1_770_035_416) | 0;
  a = (((a << 7) | (a >>> 25)) + b) | 0;
  d += (((a & b) | (~a & c)) + k[9] - 1_958_414_417) | 0;
  d = (((d << 12) | (d >>> 20)) + a) | 0;
  c += (((d & a) | (~d & b)) + k[10] - 42_063) | 0;
  c = (((c << 17) | (c >>> 15)) + d) | 0;
  b += (((c & d) | (~c & a)) + k[11] - 1_990_404_162) | 0;
  b = (((b << 22) | (b >>> 10)) + c) | 0;
  a += (((b & c) | (~b & d)) + k[12] + 1_804_603_682) | 0;
  a = (((a << 7) | (a >>> 25)) + b) | 0;
  d += (((a & b) | (~a & c)) + k[13] - 40_341_101) | 0;
  d = (((d << 12) | (d >>> 20)) + a) | 0;
  c += (((d & a) | (~d & b)) + k[14] - 1_502_002_290) | 0;
  c = (((c << 17) | (c >>> 15)) + d) | 0;
  b += (((c & d) | (~c & a)) + k[15] + 1_236_535_329) | 0;
  b = (((b << 22) | (b >>> 10)) + c) | 0;

  a += (((b & d) | (c & ~d)) + k[1] - 165_796_510) | 0;
  a = (((a << 5) | (a >>> 27)) + b) | 0;
  d += (((a & c) | (b & ~c)) + k[6] - 1_069_501_632) | 0;
  d = (((d << 9) | (d >>> 23)) + a) | 0;
  c += (((d & b) | (a & ~b)) + k[11] + 643_717_713) | 0;
  c = (((c << 14) | (c >>> 18)) + d) | 0;
  b += (((c & a) | (d & ~a)) + k[0] - 373_897_302) | 0;
  b = (((b << 20) | (b >>> 12)) + c) | 0;
  a += (((b & d) | (c & ~d)) + k[5] - 701_558_691) | 0;
  a = (((a << 5) | (a >>> 27)) + b) | 0;
  d += (((a & c) | (b & ~c)) + k[10] + 38_016_083) | 0;
  d = (((d << 9) | (d >>> 23)) + a) | 0;
  c += (((d & b) | (a & ~b)) + k[15] - 660_478_335) | 0;
  c = (((c << 14) | (c >>> 18)) + d) | 0;
  b += (((c & a) | (d & ~a)) + k[4] - 405_537_848) | 0;
  b = (((b << 20) | (b >>> 12)) + c) | 0;
  a += (((b & d) | (c & ~d)) + k[9] + 568_446_438) | 0;
  a = (((a << 5) | (a >>> 27)) + b) | 0;
  d += (((a & c) | (b & ~c)) + k[14] - 1_019_803_690) | 0;
  d = (((d << 9) | (d >>> 23)) + a) | 0;
  c += (((d & b) | (a & ~b)) + k[3] - 187_363_961) | 0;
  c = (((c << 14) | (c >>> 18)) + d) | 0;
  b += (((c & a) | (d & ~a)) + k[8] + 1_163_531_501) | 0;
  b = (((b << 20) | (b >>> 12)) + c) | 0;
  a += (((b & d) | (c & ~d)) + k[13] - 1_444_681_467) | 0;
  a = (((a << 5) | (a >>> 27)) + b) | 0;
  d += (((a & c) | (b & ~c)) + k[2] - 51_403_784) | 0;
  d = (((d << 9) | (d >>> 23)) + a) | 0;
  c += (((d & b) | (a & ~b)) + k[7] + 1_735_328_473) | 0;
  c = (((c << 14) | (c >>> 18)) + d) | 0;
  b += (((c & a) | (d & ~a)) + k[12] - 1_926_607_734) | 0;
  b = (((b << 20) | (b >>> 12)) + c) | 0;

  a += ((b ^ c ^ d) + k[5] - 378_558) | 0;
  a = (((a << 4) | (a >>> 28)) + b) | 0;
  d += ((a ^ b ^ c) + k[8] - 2_022_574_463) | 0;
  d = (((d << 11) | (d >>> 21)) + a) | 0;
  c += ((d ^ a ^ b) + k[11] + 1_839_030_562) | 0;
  c = (((c << 16) | (c >>> 16)) + d) | 0;
  b += ((c ^ d ^ a) + k[14] - 35_309_556) | 0;
  b = (((b << 23) | (b >>> 9)) + c) | 0;
  a += ((b ^ c ^ d) + k[1] - 1_530_992_060) | 0;
  a = (((a << 4) | (a >>> 28)) + b) | 0;
  d += ((a ^ b ^ c) + k[4] + 1_272_893_353) | 0;
  d = (((d << 11) | (d >>> 21)) + a) | 0;
  c += ((d ^ a ^ b) + k[7] - 155_497_632) | 0;
  c = (((c << 16) | (c >>> 16)) + d) | 0;
  b += ((c ^ d ^ a) + k[10] - 1_094_730_640) | 0;
  b = (((b << 23) | (b >>> 9)) + c) | 0;
  a += ((b ^ c ^ d) + k[13] + 681_279_174) | 0;
  a = (((a << 4) | (a >>> 28)) + b) | 0;
  d += ((a ^ b ^ c) + k[0] - 358_537_222) | 0;
  d = (((d << 11) | (d >>> 21)) + a) | 0;
  c += ((d ^ a ^ b) + k[3] - 722_521_979) | 0;
  c = (((c << 16) | (c >>> 16)) + d) | 0;
  b += ((c ^ d ^ a) + k[6] + 76_029_189) | 0;
  b = (((b << 23) | (b >>> 9)) + c) | 0;
  a += ((b ^ c ^ d) + k[9] - 640_364_487) | 0;
  a = (((a << 4) | (a >>> 28)) + b) | 0;
  d += ((a ^ b ^ c) + k[12] - 421_815_835) | 0;
  d = (((d << 11) | (d >>> 21)) + a) | 0;
  c += ((d ^ a ^ b) + k[15] + 530_742_520) | 0;
  c = (((c << 16) | (c >>> 16)) + d) | 0;
  b += ((c ^ d ^ a) + k[2] - 995_338_651) | 0;
  b = (((b << 23) | (b >>> 9)) + c) | 0;

  a += ((c ^ (b | ~d)) + k[0] - 198_630_844) | 0;
  a = (((a << 6) | (a >>> 26)) + b) | 0;
  d += ((b ^ (a | ~c)) + k[7] + 1_126_891_415) | 0;
  d = (((d << 10) | (d >>> 22)) + a) | 0;
  c += ((a ^ (d | ~b)) + k[14] - 1_416_354_905) | 0;
  c = (((c << 15) | (c >>> 17)) + d) | 0;
  b += ((d ^ (c | ~a)) + k[5] - 57_434_055) | 0;
  b = (((b << 21) | (b >>> 11)) + c) | 0;
  a += ((c ^ (b | ~d)) + k[12] + 1_700_485_571) | 0;
  a = (((a << 6) | (a >>> 26)) + b) | 0;
  d += ((b ^ (a | ~c)) + k[3] - 1_894_986_606) | 0;
  d = (((d << 10) | (d >>> 22)) + a) | 0;
  c += ((a ^ (d | ~b)) + k[10] - 1_051_523) | 0;
  c = (((c << 15) | (c >>> 17)) + d) | 0;
  b += ((d ^ (c | ~a)) + k[1] - 2_054_922_799) | 0;
  b = (((b << 21) | (b >>> 11)) + c) | 0;
  a += ((c ^ (b | ~d)) + k[8] + 1_873_313_359) | 0;
  a = (((a << 6) | (a >>> 26)) + b) | 0;
  d += ((b ^ (a | ~c)) + k[15] - 30_611_744) | 0;
  d = (((d << 10) | (d >>> 22)) + a) | 0;
  c += ((a ^ (d | ~b)) + k[6] - 1_560_198_380) | 0;
  c = (((c << 15) | (c >>> 17)) + d) | 0;
  b += ((d ^ (c | ~a)) + k[13] + 1_309_151_649) | 0;
  b = (((b << 21) | (b >>> 11)) + c) | 0;
  a += ((c ^ (b | ~d)) + k[4] - 145_523_070) | 0;
  a = (((a << 6) | (a >>> 26)) + b) | 0;
  d += ((b ^ (a | ~c)) + k[11] - 1_120_210_379) | 0;
  d = (((d << 10) | (d >>> 22)) + a) | 0;
  c += ((a ^ (d | ~b)) + k[2] + 718_787_259) | 0;
  c = (((c << 15) | (c >>> 17)) + d) | 0;
  b += ((d ^ (c | ~a)) + k[9] - 343_485_551) | 0;
  b = (((b << 21) | (b >>> 11)) + c) | 0;

  x[0] = (a + x[0]) | 0;
  x[1] = (b + x[1]) | 0;
  x[2] = (c + x[2]) | 0;
  x[3] = (d + x[3]) | 0;
}

function md5blk(s: string): SixteenNumberArray {
  const md5blks = [];
  let i; /* Andy King said do it this way. */

  for (i = 0; i < 64; i += 4) {
    md5blks[i >> 2] =
      s.charCodeAt(i) +
      (s.charCodeAt(i + 1) << 8) +
      (s.charCodeAt(i + 2) << 16) +
      (s.charCodeAt(i + 3) << 24);
  }
  return md5blks as unknown as SixteenNumberArray;
}

function md51(s: string): NumberQuadlets {
  const n = s.length;
  const state = [
    1_732_584_193, -271_733_879, -1_732_584_194, 271_733_878,
  ] as NumberQuadlets;
  let i: number;

  for (i = 64; i <= n; i += 64) {
    md5cycle(state, md5blk(s.slice(i - 64, i)));
  }
  s = s.slice(Math.max(0, i - 64));
  const length = s.length;
  const tail: SixteenNumberArray = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];
  for (i = 0; i < length; i += 1) {
    tail[i >> 2]! |= s.charCodeAt(i) << ((i % 4) << 3);
  }
  tail[i >> 2]! |= 0x80 << ((i % 4) << 3);
  if (i > 55) {
    md5cycle(state, tail);
    for (i = 0; i < 16; i += 1) {
      tail[i] = 0;
    }
  }

  // Beware that the final length might not fit in 32 bits so we take care of that
  // Split the 64-bit length (n * 8) into low and high 32-bit words
  const bitLength = n * 8;
  // For the low 32 bits, we can use bitwise OR to ensure it's a 32-bit integer
  const lo = bitLength | 0;
  // For the high 32 bits, divide by 2^32 and truncate
  const hi = Math.floor(bitLength / 4_294_967_296);

  tail[14] = lo;
  tail[15] = hi;

  md5cycle(state, tail);
  return state;
}

function rhex(n: number): string {
  let s = '';
  let j = 0;
  for (; j < 4; j++)
    s += hex_chr[(n >> (j * 8 + 4)) & 0x0f]! + hex_chr[(n >> (j * 8)) & 0x0f]!;
  return s;
}

function hex(x: number[]): string {
  const result: string[] = [];
  for (const element of x) {
    result.push(rhex(element));
  }
  return result.join('');
}

/**
 * Create a MD5 hash of a string.
 *
 * @example
 * ```typescript
 * import { md5 } from '@httpx/md5';
 *
 * const hash = md5('Hello: 🌍🚀✨🦄');
 *
 * // Hexadecimal RFC1321 / NodeJs string
 * // '8f11a08695d43b4f737a9706dffbf208'
 * ```
 *
 * @returns The MD5 hash of the input string as a hexadecimal string.
 * @throws TypeError if the input is not a string
 */
export function md5(text: string): string {
  if (typeof text != 'string') {
    throw new TypeError('Expected a string');
  }
  const hash = md51(toUtf8(text));
  return hex(hash);
}
