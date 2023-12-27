import { errorMessages } from '../../messages/errorMessages';
import { assertPlainObject } from '../object.asserts';

describe('object assertions tests', () => {
  it('should not throw when value is valid', () => {
    expect(() => assertPlainObject({})).not.toThrow();
  });
  it('should throw when value is invalid', () => {
    expect(() => assertPlainObject(new Date())).toThrow(
      errorMessages.plainObject
    );
  });
  it('should throw custom error when value is invalid', () => {
    const e = new Error('cool');
    expect(() => assertPlainObject('123', () => e)).toThrow(e);
  });
});
