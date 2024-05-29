import { expectTypeOf } from 'vitest';

import { MIntl } from '../index';

describe('MIntl tests', () => {
  it('should return a Intl.NumberFormatter', () => {
    const formatter = MIntl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      notation: 'compact',
      minimumFractionDigits: 2,
    });
    expect(formatter.format(10.1345)).toBe('10,13 €');
    expectTypeOf(formatter).toEqualTypeOf<Intl.NumberFormat>();
  });
  it('should return a Intl.DateTimeFormatter', () => {
    const formatter = MIntl.DateTimeFormat('fr-FR', {
      dateStyle: 'full',
      timeStyle: 'full',
    });
    const date = Date.parse('2024-05-29T07:42:43.230Z');
    expect(formatter.format(date)).toBe(
      'mercredi 29 mai 2024 à 09:42:43 heure d’été d’Europe centrale'
    );
    expectTypeOf(formatter).toEqualTypeOf<Intl.DateTimeFormat>();
  });
});
