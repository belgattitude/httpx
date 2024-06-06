import { expectTypeOf } from 'vitest';

import { MIntl } from '../index';

describe('MIntl tests', () => {
  describe('Intl methods', () => {
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
        timeZone: 'UTC',
      });
      const date = Date.parse('2024-05-29T07:42:43.230Z');
      expect(formatter.format(date)).toBe(
        'mercredi 29 mai 2024 à 07:42:43 temps universel coordonné'
      );
      expectTypeOf(formatter).toEqualTypeOf<Intl.DateTimeFormat>();
    });
  });
  describe('Cache access', () => {
    it('should return a Intl.NumberFormatter', () => {
      MIntl.cache.clear();
      const _nf1 = MIntl.NumberFormat('fr-FR');
      const _nf2 = MIntl.NumberFormat('fr-FR');
      const _df2 = MIntl.DateTimeFormat('fr-FR');
      const _df3 = MIntl.DateTimeFormat('fr-FR');
      const _df4 = MIntl.DateTimeFormat('fr-FR', {
        dateStyle: 'full',
      });
      expect(MIntl.cache.stats()).toStrictEqual({ cachedInstances: 3 });
      MIntl.cache.clear();
      expect(MIntl.cache.stats()).toStrictEqual({ cachedInstances: 0 });
    });
  });
});
