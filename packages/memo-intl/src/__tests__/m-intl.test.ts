import { expectTypeOf } from 'vitest';

import { MIntl } from '../index';

describe('MIntl tests', () => {
  describe('Intl methods', () => {
    it('Intl.NumberFormatter', () => {
      const formatter = MIntl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        notation: 'compact',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      expect(formatter.format(10.1345)).toBe('10,13 €');
      expectTypeOf(formatter).toEqualTypeOf<Intl.NumberFormat>();
    });
    it('Intl.DateTimeFormatter', () => {
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
    it('Intl.Locale', () => {
      const locale = MIntl.Locale('fr-FR', {
        caseFirst: 'lower',
      });
      expect(locale.language).toBe('fr');
      expectTypeOf(locale).toEqualTypeOf<Intl.Locale>();
    });

    it('Intl.Collator', () => {
      const collator = MIntl.Collator('de', { caseFirst: 'upper' });
      const sorted = ['Z', 'a', 'z', 'ä'].sort(collator.compare);
      expect(sorted).toStrictEqual(['a', 'ä', 'Z', 'z']);
      expectTypeOf(collator).toEqualTypeOf<Intl.Collator>();
    });

    it('Intl.ListFormat', () => {
      const listFormat = MIntl.ListFormat('en', {
        style: 'long',
        type: 'conjunction',
      });
      const joined = listFormat.format(['Motorcycle', 'Bus', 'Car']);
      expect(joined).toStrictEqual('Motorcycle, Bus, and Car');
      expectTypeOf(listFormat).toEqualTypeOf<Intl.ListFormat>();
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
