import type { ValidationError } from '../../src';
import { HttpBadRequest } from '../../src/client';

describe('HttpBadRequest with extra errors', () => {
  const errors: ValidationError[] = [
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
  ];
  it('should return unmodified errors', () => {
    const e400 = new HttpBadRequest({
      errors,
    });
    expect(e400.errors).toStrictEqual(errors);
  });
});
