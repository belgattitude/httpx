import * as jsBase64 from 'js-base64';
import prettyBytes from 'pretty-bytes';

import { Base64Purejs } from '../src/base64/base64.purejs.js';
import type { Base64Encoder } from '../src/base64/base64.types';
import { getEncodingTestData } from './data/encoding-test.data';

const isNodeLike = !('window' in globalThis);
const isBrowserLike = 'window' in globalThis;

const base64Node = isNodeLike
  ? await import('../src/base64/base64.nodejs').then((mod) => mod.Base64NodeJs)
  : null;

const base64Browser = isBrowserLike
  ? await import('../src/base64/base64.browser').then(
      (mod) => mod.Base64Browser
    )
  : null;

const testRealms = [
  ['pure-js', Base64Purejs],
  base64Node ? ['node-js', base64Node] : undefined,
  base64Browser ? ['browser', base64Browser] : undefined,
].filter(Boolean) as [string, Base64Encoder][];

describe('Base64', () => {
  const string = getEncodingTestData().repeat(1000);
  const size = prettyBytes(string.length);
  describe.each(testRealms)('Base64.encode (%s)', (realm, encoder) => {
    it(`should encode a complex string and give expected base64`, () => {
      const encoded = encoder.encode("H🌸😊🚀🔥/ÄÖé?=:@&$+!#'()~*%/;:<>\\");
      expect(encoded).toStrictEqual(
        'SPCfjLjwn5iK8J+agPCflKUvw4TDlsOpPz06QCYkKyEjJygpfiolLzs6PD5c'
      );
    });
  });

  describe.each(testRealms)('Base64.encode (%s)', (realm, encoder) => {
    it(`should decode and encoded a string of ${size}`, () => {
      const decoded = encoder.decode(encoder.encode(string));
      expect(decoded).toStrictEqual(string);
    });
  });

  describe.each(testRealms)('Compatibility', (realm, encoder) => {
    describe(`With js-base64 (${realm})`, () => {
      const encoded = jsBase64.encode(string);
      it('encode', () => {
        expect(encoder.encode(string)).toBe(jsBase64.encode(string));
      });
      it('decode', () => {
        expect(encoder.decode(encoded)).toBe(jsBase64.decode(encoded));
      });
    });
  });
});
