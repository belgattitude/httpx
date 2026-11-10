import { expectTypeOf } from "vitest";

import { createMIntl, getOrCreateMIntl, MIntl } from "../index";

describe("MIntl tests", () => {
  describe("Intl methods", () => {
    it("Intl.NumberFormatter", () => {
      const formatter = MIntl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        notation: "compact",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      expect(formatter.format(10.1345)).toBe("10,13 €");
      expectTypeOf(formatter).toEqualTypeOf<Intl.NumberFormat>();
    });

    it("Intl.DateTimeFormatter", () => {
      const formatter = MIntl.DateTimeFormat("fr-FR", {
        dateStyle: "full",
        timeStyle: "full",
        timeZone: "UTC",
      });
      const date = Date.parse("2024-05-29T07:42:43.230Z");
      expect(formatter.format(date)).toBe(
        "mercredi 29 mai 2024 à 07:42:43 temps universel coordonné"
      );
      expectTypeOf(formatter).toEqualTypeOf<Intl.DateTimeFormat>();
    });

    it("Intl.Locale", () => {
      const locale = MIntl.Locale("fr-FR", {
        caseFirst: "lower",
      });
      expect(locale.language).toBe("fr");
      expectTypeOf(locale).toEqualTypeOf<Intl.Locale>();
    });

    it("Intl.Collator", () => {
      const collator = MIntl.Collator("de", { caseFirst: "upper" });
      const sorted = ["Z", "a", "z", "ä"].toSorted(collator.compare);
      expect(sorted).toStrictEqual(["a", "ä", "Z", "z"]);
      expectTypeOf(collator).toEqualTypeOf<Intl.Collator>();
    });

    it("Intl.ListFormat", () => {
      const listFormat = MIntl.ListFormat("en", {
        style: "long",
        type: "conjunction",
      });
      const joined = listFormat.format(["Motorcycle", "Bus", "Car"]);
      expect(joined).toBe("Motorcycle, Bus, and Car");
      expectTypeOf(listFormat).toEqualTypeOf<Intl.ListFormat>();
    });

    it("Intl.PluralRules", () => {
      const pluralRules = MIntl.PluralRules("en-US", { type: "ordinal" });
      const num = pluralRules.select(2);
      expect(num).toBe("two");
      expectTypeOf(pluralRules).toEqualTypeOf<Intl.PluralRules>();
    });

    it("Intl.Segmenter", () => {
      const segmenter = MIntl.Segmenter("fr", { granularity: "word" });
      const string = "Que ma joie demeure";
      const iterator = segmenter.segment(string)[Symbol.iterator]();
      expect(iterator.next().value!.segment).toBe("Que");
      expectTypeOf(segmenter).toEqualTypeOf<Intl.Segmenter>();
    });

    it("Intl.DisplayNames", () => {
      const regionNames = MIntl.DisplayNames("en", { type: "region" });
      expect(regionNames.of("BE")).toBe("Belgium");
      expect(MIntl.DisplayNames("en", { type: "region" })).toBe(regionNames);
      expectTypeOf(regionNames).toEqualTypeOf<Intl.DisplayNames>();
    });

    it.skipIf(Intl.DurationFormat === undefined)("Intl.DurationFormat", () => {
      const formatter = MIntl.DurationFormat("en", { style: "short" });
      expect(formatter.format({ hours: 1, minutes: 46 })).toBe("1 hr, 46 min");
      expect(MIntl.DurationFormat("en", { style: "short" })).toBe(formatter);
      expectTypeOf(formatter).toEqualTypeOf<Intl.DurationFormat>();
    });

    it("Intl.RelativeTimeFormat", () => {
      const rtf = MIntl.RelativeTimeFormat("es", { numeric: "auto" });
      expect(rtf.format(2, "day")).toBe("pasado mañana");
      expectTypeOf(rtf).toEqualTypeOf<Intl.RelativeTimeFormat>();
    });
  });

  describe("Cache access", () => {
    it("should return a Intl.NumberFormatter", () => {
      MIntl.cache.clear();
      const _nf1 = MIntl.NumberFormat("fr-FR");
      const _nf2 = MIntl.NumberFormat("fr-FR");
      const _df2 = MIntl.DateTimeFormat("fr-FR");
      const _df3 = MIntl.DateTimeFormat("fr-FR");
      const _df4 = MIntl.DateTimeFormat("fr-FR", {
        dateStyle: "full",
      });
      expect(MIntl.cache.stats()).toStrictEqual({ cachedInstances: 3 });
      MIntl.cache.clear();
      expect(MIntl.cache.stats()).toStrictEqual({ cachedInstances: 0 });
    });
  });

  describe("Instance creation", () => {
    it("creates an independent instance with custom LRU defaults", () => {
      MIntl.cache.clear();
      const intl = createMIntl({ lru: { maxSize: 1 } });

      intl.NumberFormat("en");
      intl.NumberFormat("fr");

      expect(intl.cache.stats()).toStrictEqual({ cachedInstances: 1 });
      expect(MIntl.cache.stats()).toStrictEqual({ cachedInstances: 0 });
    });

    it("returns a named global instance and keeps its first options", () => {
      const name = "m-intl-test-singleton";
      globalThis.__httpx_memo_intl_instances?.delete(name);

      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      const first = getOrCreateMIntl(name, { lru: { maxSize: 1 } });
      const second = getOrCreateMIntl(name, { lru: { maxSize: 10 } });

      expect(second).toBe(first);
      expect(warn).toHaveBeenCalledOnce();
      expect(warn.mock.calls[0]?.[0]).toContain(
        `getOrCreateMIntl("${name}") already exists`
      );
      warn.mockRestore();
      first.NumberFormat("en");
      first.NumberFormat("fr");
      expect(first.cache.stats()).toStrictEqual({ cachedInstances: 1 });
    });

    it("does not warn when options are omitted or identical", () => {
      const name = "m-intl-test-no-warn";
      globalThis.__httpx_memo_intl_instances?.delete(name);
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

      const first = getOrCreateMIntl(name, { lru: { maxSize: 5 } });
      expect(getOrCreateMIntl(name)).toBe(first);
      expect(getOrCreateMIntl(name, { lru: { maxSize: 5 } })).toBe(first);

      expect(warn).not.toHaveBeenCalled();
      warn.mockRestore();
    });

    it("does not warn in production", () => {
      const name = "m-intl-test-prod";
      globalThis.__httpx_memo_intl_instances?.delete(name);
      // Browsers have no `globalThis.process`: vi.stubEnv alone wouldn't be
      // visible to the runtime check, so provide a minimal one there.
      if ((globalThis as { process?: unknown }).process === undefined) {
        vi.stubGlobal("process", { env: { NODE_ENV: "production" } });
      } else {
        vi.stubEnv("NODE_ENV", "production");
      }
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

      try {
        getOrCreateMIntl(name, { lru: { maxSize: 1 } });
        getOrCreateMIntl(name, { lru: { maxSize: 10 } });

        expect(warn).not.toHaveBeenCalled();
      } finally {
        warn.mockRestore();
        vi.unstubAllEnvs();
        vi.unstubAllGlobals();
      }
    });

    it("uses the global default instance for MIntl", () => {
      expect(getOrCreateMIntl()).toBe(MIntl);
      expect(getOrCreateMIntl("default")).toBe(MIntl);
    });
  });
});
