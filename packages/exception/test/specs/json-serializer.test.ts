import { describe, expect, it } from 'vitest';

import { HttpUnprocessableEntity } from '../../src';
import { fromJson, toJson } from '../../src/serializer';

describe('Json serialization', () => {
  describe('HttpUnprocessableEntity with issues', () => {
    const e422 = new HttpUnprocessableEntity({
      errorId: '12',
      issues: [
        {
          code: 'invalid_email',
          message: 'Invalid email',
          path: 'email',
        },
        {
          code: 'empty_string',
          message: 'Invalid address',
          path: ['addresses', 0, 'line1'],
        },
      ],
      message: 'Validation failed',
      method: 'POST',
      url: 'http://',
    });

    it('should return the same object', () => {
      const json = toJson(e422);
      const js = fromJson(json);
      expect((js as HttpUnprocessableEntity).issues).toStrictEqual(e422.issues);
      expect(js).toStrictEqual(e422);
    });
  });
});
