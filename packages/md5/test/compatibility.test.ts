import { default as nodeMd5 } from 'md5';
import { default as SparkMd5 } from 'spark-md5';

import { md5 } from '../src';

describe('compatibility with other libraries', () => {
  const words = ['hello', 'world', 'md5', 'test', 'compatibility'];

  /**
   * Unicode MD5 Test Data
   *
   * CONSENSUS: YES, there IS a consensus about MD5 with Unicode!
   *
   * Standard approach used by SparkMD5, node-md5, and most MD5 implementations:
   * 1. Convert the Unicode string to UTF-8 bytes
   * 2. Hash those UTF-8 bytes
   *
   * Example: 'é' (U+00E9)
   * - UTF-16 charCodeAt(): 233 (single value)
   * - UTF-8 encoding: [195, 169] (two bytes: 0xC3, 0xA9)
   *
   * The current implementation uses charCodeAt() which produces DIFFERENT hashes
   * because it treats characters as UTF-16 code units instead of UTF-8 bytes.
   *
   * These test values are the CORRECT MD5 hashes (using UTF-8 encoding).
   */
  const unicodeTestData = [
    { text: 'céool', md5: '46875bd80674b7c5ce65ebade6c8dd79' },
    { text: 'Hello 世界', md5: 'af91c2603879085df0cb545dd0366dcd' },
    { text: 'Привет мир', md5: '79d636ccef972a9d10db69750cd53e8b' },
    { text: '日本語テスト', md5: 'f95716c1bda20a02d24c31e402d795d2' },
    { text: 'Émojis: 🌍🚀✨', md5: '67e5460579ddb74dc0491d1b20fcaa61' },
    { text: 'café ☕', md5: '9543ec81d7c6c8256d750bfb6e7015ae' },
    { text: 'Ñoño español', md5: '3615e8a207b5efec4baf626da17b4258' },
    { text: 'Ελληνικά', md5: '7e662c88ec8adfe86de5dcfc728c4c2d' },
    { text: 'العربية', md5: '26b1b2b0a4193aabcc33455732de89ac' },
    { text: '한국어', md5: 'd6d014c612be422818ca8a960063d051' },
  ] as const;

  it('should match other libraries with unicode text', () => {
    for (const word of unicodeTestData) {
      expect(md5(word.text)).toBe(word.md5);
      expect(md5(word.text)).toBe(SparkMd5.hash(word.text));
      expect(md5(word.text)).toBe(nodeMd5(word.text));
    }
  });

  it('should match other libraries for simple unicode', () => {
    expect(md5('céool')).toBe(SparkMd5.hash('céool'));
    expect(md5('céool')).toBe(nodeMd5('céool'));
  });
});
