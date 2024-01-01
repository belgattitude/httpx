import { assertType } from 'vitest';

import { uuidsTestData } from '../../test/test.data';
import { assertUuidV4 } from '../uuid.asserts';
import type { UuidV4 } from '../uuid.types';

describe('uuid types tests', () => {
  describe('Uuid', () => {
    it('should return a type Uuid compatible with string', () => {
      const v4 = uuidsTestData.v4;
      assertUuidV4(v4);
      expectTypeOf(v4).toBeString();
      assertType<UuidV4>(v4);
    });
  });
});
