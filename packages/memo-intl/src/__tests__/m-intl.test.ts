import { expectTypeOf } from 'vitest';

import { MIntl } from '../index';

describe('MIntl tests', () => {
  it('should return a number formatter', () => {
    const formatter = MIntl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      notation: 'compact',
      minimumFractionDigits: 2,
    });
    expect(formatter.format(10.1345)).toBe('10,13 €');
    expectTypeOf(formatter).toEqualTypeOf<Intl.NumberFormat>();
  });
});
