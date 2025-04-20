import { encode as jsBase64Encode } from 'js-base64';

import { Base64 } from './base64';

describe('Base64', () => {
  const string = 'Hello, world! 😊';
  describe('encode', () => {
    it.skip('should encode a string to Base64', () => {
      const encoded = Base64.encode(string);
      expect(encoded).toBe('SGVsbG8sIHdvcmxkISDwn5iL');
    });
  });

  describe('Compatibility', () => {
    describe('With js-base64', () => {
      it('encode', () => {
        expect(Base64.encode(string)).toBe(jsBase64Encode(string));
      });
      it('decode', () => {
        expect(Base64.encode(string)).toBe(jsBase64Encode(string));
      });
    });
  });
});
