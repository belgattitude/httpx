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

    it('Intl.PluralRules', () => {
      const pluralRules = MIntl.PluralRules('en-US', { type: 'ordinal' });
      const num = pluralRules.select(2);
      expect(num).toStrictEqual('two');
      expectTypeOf(pluralRules).toEqualTypeOf<Intl.PluralRules>();
    });

    it('Intl.Segmenter', () => {
      const segmenter = MIntl.Segmenter('fr', { granularity: 'word' });
      const string = 'Que ma joie demeure';
      const iterator = segmenter.segment(string)[Symbol.iterator]();
      expect(iterator.next().value!.segment).toStrictEqual('Que');
      expectTypeOf(segmenter).toEqualTypeOf<Intl.Segmenter>();
    });

    it('Intl.RelativeTimeFormat', () => {
      const rtf = MIntl.RelativeTimeFormat('es', { numeric: 'auto' });
      expect(rtf.format(2, 'day')).toStrictEqual('pasado mañana');
      expectTypeOf(rtf).toEqualTypeOf<Intl.RelativeTimeFormat>();
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
