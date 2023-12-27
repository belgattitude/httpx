import { uuidsTestData } from '../../../test/test.data';
import { errorMessages } from '../../messages/errorMessages';
import {
  assertUuid,
  assertUuidV1,
  assertUuidV3,
  assertUuidV4,
  assertUuidV5,
} from '../uuid.asserts';

describe('uuid assertions tests', () => {
  it('should not throw when uuid is valid', () => {
    expect(() => assertUuid(uuidsTestData.v1)).not.toThrow();
    expect(() => assertUuid(uuidsTestData.v1, undefined, 1)).not.toThrow();
    expect(() => assertUuidV1(uuidsTestData.v1)).not.toThrow();
    expect(() => assertUuidV3(uuidsTestData.v3)).not.toThrow();
    expect(() => assertUuidV4(uuidsTestData.v4)).not.toThrow();
    expect(() => assertUuidV5(uuidsTestData.v5)).not.toThrow();
  });
  it('should throw when uuid is invalid', () => {
    expect(() => assertUuid('123')).toThrow(errorMessages.uuid());
    expect(() => assertUuid('123', undefined, 1)).toThrow(
      errorMessages.uuid(1)
    );
    expect(() => assertUuidV1('123')).toThrow(errorMessages.uuid(1));
    expect(() => assertUuidV3('123')).toThrow(errorMessages.uuid(3));
    expect(() => assertUuidV4('123')).toThrow(errorMessages.uuid(4));
    expect(() => assertUuidV5('123')).toThrow(errorMessages.uuid(5));
  });
  it('should throw custom error when uuid is invalid', () => {
    const e = new Error('cool');
    expect(() => assertUuid('123', () => e, 1)).toThrow(e);
  });
});
