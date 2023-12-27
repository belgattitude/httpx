import { errorMessages } from '../../messages/errorMessages';
import { assertStrNotEmpty } from '../string.asserts';

describe('string assertions tests', () => {
  it('should not throw when value is valid', () => {
    expect(() => assertStrNotEmpty('sdf')).not.toThrow();
  });
  it('should throw when value is invalid', () => {
    expect(() => assertStrNotEmpty(new Date())).toThrow(
      errorMessages.strNotEmpty
    );
  });
  it('should throw custom error when value is invalid', () => {
    const e = new Error('cool');
    expect(() => assertStrNotEmpty('', () => e)).toThrow(e);
  });
});
