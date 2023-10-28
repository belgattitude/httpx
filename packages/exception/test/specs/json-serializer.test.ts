import { HttpUnprocessableEntity } from '../../src';
import { fromJson, toJson } from '../../src/serializer';

describe('Json serialization', () => {
  describe('HttpUnprocessableEntity with issues', () => {
    const e422 = new HttpUnprocessableEntity({
      message: 'Validation failed',
      url: 'http://',
      method: 'POST',
      errorId: '12',
      issues: [
        {
          message: 'Invalid email',
          path: 'email',
          code: 'invalid_email',
        },
        {
          message: 'Invalid address',
          path: ['addresses', 0, 'line1'],
          code: 'empty_string',
        },
      ],
    });

    it('should return the same object', () => {
      const json = toJson(e422);
      const js = fromJson(json);
      expect((js as HttpUnprocessableEntity).issues).toStrictEqual(e422.issues);
      expect(js).toStrictEqual(e422);
    });
  });
});
