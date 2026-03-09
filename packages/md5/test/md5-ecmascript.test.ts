import { describe, expect, it } from 'vitest';

import { md5 } from '../src/ecmascript/md5-ecmascript';

describe('md5Ecmascript - UTF-8 compatible implementation', () => {
  it('should hash ASCII strings correctly', () => {
    expect(md5('hello')).toBe('5d41402abc4b2a76b9719d911017c592');
    expect(md5('')).toBe('d41d8cd98f00b204e9800998ecf8427e');
    expect(md5('The quick brown fox jumps over the lazy dog')).toBe(
      '9e107d9d372bb6826bd81d3542a419d6'
    );
  });

  it('should hash Unicode strings with proper UTF-8 encoding', () => {
    // Latin-1 supplement
    expect(md5('céool')).toBe('46875bd80674b7c5ce65ebade6c8dd79');
    expect(md5('café ☕')).toBe('9543ec81d7c6c8256d750bfb6e7015ae');

    // Chinese
    expect(md5('Hello 世界')).toBe('af91c2603879085df0cb545dd0366dcd');
    expect(md5('日本語テスト')).toBe('f95716c1bda20a02d24c31e402d795d2');

    // Cyrillic
    expect(md5('Привет мир')).toBe('79d636ccef972a9d10db69750cd53e8b');

    // Emojis (4-byte UTF-8 sequences)
    expect(md5('Émojis: 🌍🚀✨')).toBe('67e5460579ddb74dc0491d1b20fcaa61');

    // Korean
    expect(md5('한국어')).toBe('d6d014c612be422818ca8a960063d051');

    // Greek
    expect(md5('Ελληνικά')).toBe('7e662c88ec8adfe86de5dcfc728c4c2d');

    // Arabic
    expect(md5('العربية')).toBe('26b1b2b0a4193aabcc33455732de89ac');

    // Spanish
    expect(md5('Ñoño español')).toBe('3615e8a207b5efec4baf626da17b4258');
  });

  it('should match md5 md5_rfc1321', () => {
    // These are the exact same hashes that Node.js crypto produces
    const testCases = [
      { text: 'hello', hash: '5d41402abc4b2a76b9719d911017c592' },
      { text: 'Hello 世界', hash: 'af91c2603879085df0cb545dd0366dcd' },
      { text: 'céool', hash: '46875bd80674b7c5ce65ebade6c8dd79' },
      { text: 'Привет мир', hash: '79d636ccef972a9d10db69750cd53e8b' },
      { text: '日本語テスト', hash: 'f95716c1bda20a02d24c31e402d795d2' },
      { text: 'Émojis: 🌍🚀✨', hash: '67e5460579ddb74dc0491d1b20fcaa61' },
      { text: 'café ☕', hash: '9543ec81d7c6c8256d750bfb6e7015ae' },
      { text: '', hash: 'd41d8cd98f00b204e9800998ecf8427e' },
    ];

    for (const { text, hash } of testCases) {
      expect(md5(text)).toBe(hash);
    }
  });
});
