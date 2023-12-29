import { uuidsTestData } from '../../test/test.data';
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
    expect(() =>
      assertUuid(uuidsTestData.v1, undefined, {
        version: 1,
      })
    ).not.toThrow();
    expect(() => assertUuidV1(uuidsTestData.v1)).not.toThrow();
    expect(() => assertUuidV3(uuidsTestData.v3)).not.toThrow();
    expect(() => assertUuidV4(uuidsTestData.v4)).not.toThrow();
    expect(() => assertUuidV5(uuidsTestData.v5)).not.toThrow();
  });
  it('should throw when uuid is invalid', () => {
    expect(() => assertUuid('123')).toThrow(
      new TypeError('Value is expected to be an uuid, got: string(length:3)')
    );
    expect(() => assertUuid(false, undefined, { version: 1 })).toThrow(
      new TypeError('Value is expected to be an uuid v1, got: boolean(false)')
    );
    expect(() => assertUuidV1(Number.NaN)).toThrow(
      new TypeError('Value is expected to be an uuid v1, got: NaN')
    );
    expect(() => assertUuidV3(new Error())).toThrow(
      new TypeError('Value is expected to be an uuid v3, got: Error')
    );
    expect(() => assertUuidV4(new Date())).toThrow(
      new TypeError('Value is expected to be an uuid v4, got: Date')
    );
    expect(() => assertUuidV5(() => {})).toThrow(
      new TypeError('Value is expected to be an uuid v5, got: function')
    );
  });
  it('should throw custom error when uuid is invalid', () => {
    const e = new Error('cool');
    expect(() =>
      assertUuid('123', () => e, {
        version: 1,
      })
    ).toThrow(e);
  });
});
