import { HttpUnprocessableEntity } from '../../src/client';
import { HttpBadRequest } from '../../src/client';
import type { ValidationError } from '../../src/types/ValidationError';

describe('HttpUnprocessableEntity (422) with field validation errors', () => {
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
    const e422 = new HttpUnprocessableEntity({
      errors,
    });
    expect(e422.errors).toStrictEqual(errors);
    expect(e422).toMatchSnapshot();
  });
});

describe('HttpBadRequest (400) with deprecated field validation', () => {
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
    expect(e400).toMatchSnapshot();
  });
});
