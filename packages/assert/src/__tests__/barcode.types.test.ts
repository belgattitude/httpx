import { assertType } from 'vitest';

import { eansTestData } from '../../test/test.data';
import { assertEan13 } from '../barcode.asserts';
import type { Ean13 } from '../barcode.types';

describe('barcode types tests', () => {
  describe('Ean13', () => {
    it('should return a type Ean13 compatible with string', () => {
      const ean13 = eansTestData.ean13;
      assertEan13(ean13);
      expectTypeOf(ean13).toBeString();
      assertType<Ean13>(ean13);
    });
  });
});
