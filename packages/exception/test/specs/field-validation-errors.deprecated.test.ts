import type { ValidationError } from '../../src';
import { HttpBadRequest, HttpUnprocessableEntity } from '../../src/client';

describe('HttpBadRequest (400) with deprecated field validation', () => {
  const errors: ValidationError[] = [
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
  ];
  it('should return unmodified errors', () => {
    const e400 = new HttpBadRequest({
      errors,
    });
    expect(e400.errors).toStrictEqual(errors);
    expect(e400).toMatchSnapshot();
  });
});

describe('HttpUnprocessableEntity (422) with field validation errors', () => {
  const errors: ValidationError[] = [
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
  ];
  it('should return unmodified errors', () => {
    const e422 = new HttpUnprocessableEntity({
      errors,
    });
    expect(e422.errors).toStrictEqual(errors);
    expect(e422).toMatchSnapshot();
  });
});
