import { default as SparkMd5 } from 'spark-md5';

import { md5Ecmascript } from '../src/ecmascript/md5-ecmascript.ts';
import { md5Nodejs } from '../src/nodejs/md5-nodejs.ts';

describe('compatibility with other libraries', () => {
  // Some cases, ascii, utf-8, utf-16, emojis
  const md5Seeds = [
    '', // empty string
    '123456', // number only
    '1. hello', // ascii
    '2. Hello 世界',
    '3. Привет мир',
    '4. Émojis: 🌍🚀✨',
    '5. 한국어',
  ].map((text) => {
    return {
      text: text,
      md5_rfc1321: md5Nodejs(text),
    };
  });

  describe('npm:spark-md5', () => {
    it.each(md5Seeds)(
      'sparkM5 md5 hash with %s',
      ({ text, md5_rfc1321: md5 }) => {
        // const sparkMd5 = new SparkMd5();
        expect(SparkMd5.hash(text)).toBe(md5);
      }
    );
  });

  describe('httpx/md5 - rfc1321 pure js', () => {
    it.each(md5Seeds)(
      'ecmascript md5 hash with %s',
      ({ text, md5_rfc1321: md5 }) => {
        expect(md5Ecmascript(text)).toBe(md5);
      }
    );
  });

  describe('httpx/md5 - rfc1321 native nodejs', () => {
    it.each(md5Seeds)(
      'native nodejs md5 hash with %s',
      ({ text, md5_rfc1321: md5 }) => {
        expect(md5Nodejs(text)).toBe(md5);
      }
    );
  });
});
