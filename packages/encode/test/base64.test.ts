import * as jsBase64 from "js-base64";
import prettyBytes from "pretty-bytes";

import type {
  Base64DecodeOptions,
  Base64EncodeOptions,
} from "../src/base64/base64.types";
import { isUint8ArrayBase64Supported, run, testRealms } from "./test-realms";

const textSamples = [
  ["ascii", "Hello, world!", "SGVsbG8sIHdvcmxkIQ=="],
  ["japanese", "こんにちは世界", "44GT44KT44Gr44Gh44Gv5LiW55WM"],
  [
    "french",
    "Bonjour le monde ! Éàèçêëîïôûù",
    "Qm9uam91ciBsZSBtb25kZSAhIMOJw6DDqMOnw6rDq8Ouw6/DtMO7w7k=",
  ],
  ["german", "Hallo Welt! ÄÖÜäöüß", "SGFsbG8gV2VsdCEgw4TDlsOcw6TDtsO8w58="],
  [
    "emoji",
    "🌸😊🚀🔥💧🌍🌟🎉🍕🎶❤️😂👍",
    "8J+MuPCfmIrwn5qA8J+UpfCfkqfwn4yN8J+Mn/Cfjonwn42V8J+OtuKdpO+4j/CfmILwn5GN",
  ],
  ["url unsafe", "?=:@&$+!#'()~*%/;:<>\\", "Pz06QCYkKyEjJygpfiolLzs6PD5c"],
] as const;

describe("Base64", () => {
  const string = textSamples
    .map(([, text]) => text)
    .join("")
    .repeat(1000);
  const size = prettyBytes(string.length);

  describe.each(testRealms)("Text samples (%s)", (realm, encoder) => {
    it.each(textSamples)("should encode and decode %s", (_, text, base64) => {
      expect(encoder.encode(text)).toBe(base64);
      expect(encoder.decode(base64)).toBe(text);
    });
  });

  describe.each(testRealms)("Base64.encode (%s)", (realm, encoder) => {
    it(`should encode a complex string and give expected base64`, () => {
      const encoded = encoder.encode("H🌸😊🚀🔥/ÄÖé?=:@&$+!#'()~*%/;:<>\\");
      expect(encoded).toBe(
        "SPCfjLjwn5iK8J+agPCflKUvw4TDlsOpPz06QCYkKyEjJygpfiolLzs6PD5c"
      );
    });
  });

  describe.each(testRealms)("Base64.encode (%s)", (realm, encoder) => {
    it(`should decode and encoded a string of ${size}`, () => {
      const decoded = encoder.decode(encoder.encode(string));
      expect(decoded).toStrictEqual(string);
    });
  });

  describe.each(testRealms)("Base64.decode (%s)", (realm, encoder) => {
    const text = "H🌸😊🚀🔥/ÄÖé?=:@&$+!#()~*%/;:<>\\";

    it("should decode standard base64", () => {
      expect(
        encoder.decode(
          "SPCfjLjwn5iK8J+agPCflKUvw4TDlsOpPz06QCYkKyEjKCl+KiUvOzo8Plw="
        )
      ).toBe(text);
    });

    it("should decode base64url input (RFC 4648 §5, '-', '_', no padding)", () => {
      expect(
        encoder.decode(
          "SPCfjLjwn5iK8J-agPCflKUvw4TDlsOpPz06QCYkKyEjKCl-KiUvOzo8Plw"
        )
      ).toBe(text);
    });

    it.each([
      "SGVsbG8*",
      "SGV$bG8=",
      "SGVs€bG8=",
      "SGVsbG8==", // extra padding
      "SGVsbG8=A", // padding in the middle
      "SGVsb", // dangling character (length % 4 === 1)
    ])("should throw on invalid base64 characters (%s)", (input) => {
      expect(() => encoder.decode(input)).toThrow(/Invalid Base64 input/);
    });
  });

  describe.each(testRealms)("Edge cases (%s)", (realm, encoder) => {
    // RFC 4648 §10 test vectors, covers every padding length
    it.each([
      ["", ""],
      ["f", "Zg=="],
      ["fo", "Zm8="],
      ["foo", "Zm9v"],
      ["foob", "Zm9vYg=="],
      ["fooba", "Zm9vYmE="],
      ["foobar", "Zm9vYmFy"],
    ])("should follow RFC 4648 test vector (%j -> %j)", (text, base64) => {
      expect(encoder.encode(text)).toBe(base64);
      expect(encoder.decode(base64)).toBe(text);
    });

    it("should preserve a leading BOM (U+FEFF)", () => {
      const text = "\uFEFFhello";
      expect(encoder.encode(text)).toBe("77u/aGVsbG8=");
      expect(encoder.decode("77u/aGVsbG8=")).toBe(text);
    });

    it("should preserve NUL and control characters", () => {
      const text = "a\u0000b\u0001\u001F\u007F";
      expect(encoder.encode(text)).toBe("YQBiAR9/");
      expect(encoder.decode("YQBiAR9/")).toBe(text);
    });

    it("should encode lone surrogates as U+FFFD (like TextEncoder)", () => {
      expect(encoder.encode("\uD800")).toBe("77+9");
      expect(encoder.decode(encoder.encode("a\uDC00b"))).toBe("a\uFFFDb");
    });

    it("should decode invalid utf-8 sequences as U+FFFD", () => {
      // 0xFF is never valid in utf-8
      expect(encoder.decode("/w==")).toBe("\uFFFD");
    });

    it("should ignore whitespace and line breaks (MIME, RFC 2045)", () => {
      expect(encoder.decode("Zm9v\nYmFy")).toBe("foobar");
      expect(encoder.decode("Zm9v\r\nYmFy\n")).toBe("foobar");
      expect(encoder.decode(" Zm9v YmFy ")).toBe("foobar");
    });

    it("should encode all 64 base64 characters", () => {
      // bytes 0x00..0xff are not valid utf-8, use chars whose utf-8 bytes
      // produce '+' (62) and '/' (63)
      expect(encoder.encode("\u00FB\u00EF")).toBe("w7vDrw==");
      expect(encoder.encode("?>?")).toBe("Pz4/");
      expect(encoder.decode("Pz4/")).toBe("?>?");
      expect(encoder.encode("\u00FF\u00FE")).toBe("w7/Dvg==");
    });
  });

  describe.each(testRealms)("Encode options (%s)", (realm, encoder) => {
    // "🌸" produces both '+' and padding
    it.each([
      [{}, "8J+MuA=="],
      [{ alphabet: "base64" }, "8J+MuA=="],
      [{ alphabet: "base64url" }, "8J-MuA=="],
      [{ omitPadding: true }, "8J+MuA"],
      [{ omitPadding: false }, "8J+MuA=="],
      [{ alphabet: "base64url", omitPadding: true }, "8J-MuA"],
    ] as const)("should encode with %j", (options, expected) => {
      expect(encoder.encode("🌸", options)).toBe(expected);
      expect(encoder.decode(expected)).toBe("🌸");
    });

    it("should encode '/' as '_' with base64url", () => {
      expect(encoder.encode("?>?", { alphabet: "base64url" })).toBe("Pz4_");
    });
  });

  describe.each(testRealms)("Decode options (%s)", (realm, encoder) => {
    describe("alphabet", () => {
      it("should accept both alphabets by default", () => {
        expect(encoder.decode("8J+MuA==")).toBe("🌸");
        expect(encoder.decode("8J-MuA==")).toBe("🌸");
      });

      it("should only accept the standard alphabet with 'base64'", () => {
        expect(encoder.decode("8J+MuA==", { alphabet: "base64" })).toBe("🌸");
        expect(() =>
          encoder.decode("8J-MuA==", { alphabet: "base64" })
        ).toThrow(/Invalid Base64 input/);
      });

      it("should only accept the url safe alphabet with 'base64url'", () => {
        expect(encoder.decode("8J-MuA==", { alphabet: "base64url" })).toBe(
          "🌸"
        );
        expect(encoder.decode("8J-MuA", { alphabet: "base64url" })).toBe("🌸");
        expect(() =>
          encoder.decode("8J+MuA==", { alphabet: "base64url" })
        ).toThrow(/Invalid Base64 input/);
      });
    });

    describe("fatal", () => {
      it("should replace invalid utf-8 with U+FFFD by default", () => {
        expect(encoder.decode("/w==")).toBe("\uFFFD");
        expect(encoder.decode("/w==", { fatal: false })).toBe("\uFFFD");
      });

      it.each([
        ["/w==", "0xff, never valid in utf-8"],
        ["8J+M", "truncated 4 bytes sequence (first 3 bytes of 🌸)"],
        ["wIA=", "overlong encoding of NUL (0xc0 0x80)"],
        ["7aCA", "utf-8 encoded surrogate (0xed 0xa0 0x80)"],
        ["gA==", "lone continuation byte (0x80)"],
      ])("should throw on %j (%s) when fatal", (input) => {
        expect(() => encoder.decode(input, { fatal: true })).toThrow(
          /Invalid UTF-8/
        );
      });

      it("should decode valid utf-8 when fatal", () => {
        expect(encoder.decode("8J+MuA==", { fatal: true })).toBe("🌸");
        expect(encoder.decode("77u/aGk=", { fatal: true })).toBe("\uFEFFhi");
        expect(encoder.decode("", { fatal: true })).toBe("");
      });

      it("should combine with the other decode options", () => {
        expect(
          encoder.decode("8J-MuA", { fatal: true, alphabet: "base64url" })
        ).toBe("🌸");
        expect(() =>
          encoder.decode("8J+MuA", { fatal: true, lastChunkHandling: "strict" })
        ).toThrow(/Invalid Base64 input/);
      });

      it("should report invalid base64 before invalid utf-8", () => {
        expect(() => encoder.decode("/w*=", { fatal: true })).toThrow(
          /Invalid Base64 input/
        );
      });
    });

    describe("lastChunkHandling", () => {
      // input, then the expected output with loose, strict and
      // stop-before-partial, undefined means it throws
      const table = [
        ["Zm9vYmFy", "foobar", "foobar", "foobar"],
        ["Zm9vYg==", "foob", "foob", "foob"],
        ["Zm9vYmE=", "fooba", "fooba", "fooba"],
        ["Zm9vYg", "foob", undefined, "foo"],
        ["Zm9vYmE", "fooba", undefined, "foo"],
        ["Zm9vYg=", undefined, undefined, "foo"],
        ["Zm9vY", undefined, undefined, "foo"],
        ["Zm9vY=", undefined, undefined, undefined],
        ["Zm9vYmF==", undefined, undefined, undefined],
        ["Zm9v=", undefined, undefined, undefined],
        // non-zero padding bits ('h' = 0b100001, '9' = 0b111101)
        ["Zh==", "f", undefined, "f"],
        ["Zm9=", "fo", undefined, "fo"],
        ["Zm9v Yg= =", "foob", "foob", "foob"],
      ] as const;
      const cases = table.flatMap(
        ([input, loose, strict, stopBeforePartial]) =>
          [
            [input, "loose", loose],
            [input, "strict", strict],
            [input, "stop-before-partial", stopBeforePartial],
          ] as const
      );

      it.each(cases)(
        "should decode %j with %s",
        (input, lastChunkHandling, expected) => {
          expect(
            run(() => encoder.decode(input, { lastChunkHandling }))
          ).toStrictEqual(
            expected === undefined ? { error: true } : { value: expected }
          );
        }
      );
    });

    // Compare with the native implementation when available
    describe.runIf(isUint8ArrayBase64Supported)(
      "Same as Uint8Array.fromBase64",
      () => {
        const inputs = [
          "",
          "Zg",
          "Zg=",
          "Zg==",
          "Zm8",
          "Zm8=",
          "Zm9v",
          "Z",
          "Z=",
          "==",
          "Zm9vYmFy",
          "Zm9vYg",
          "Zm9vY",
          "Zh",
          "Zh==",
          "Zm9=",
          "Zm9",
          "8J+MuA",
          "8J-MuA==",
          "8J_MuA",
          " Zm9v\nYg==\r\n",
          "Zm\t9v",
          "Zm9v=Yg",
          "Zm9vYg===",
          "Zm9v Yg= =",
          "Zm9vYg= ",
          "Zm\u00A09v",
          "Zm9v\u000BYg",
        ];
        const optionsList: Base64DecodeOptions[] = [
          undefined,
          "base64",
          "base64url",
        ].flatMap((alphabet) =>
          (["loose", "strict", "stop-before-partial"] as const).map(
            (lastChunkHandling) => {
              return {
                lastChunkHandling,
                ...(alphabet === undefined
                  ? {}
                  : { alphabet: alphabet as "base64" | "base64url" }),
              };
            }
          )
        );
        const nativeDecode = (input: string, options: Base64DecodeOptions) =>
          new TextDecoder("utf-8", { ignoreBOM: true }).decode(
            Uint8Array.fromBase64(
              options.alphabet === undefined
                ? input.replaceAll("-", "+").replaceAll("_", "/")
                : input,
              {
                alphabet: options.alphabet ?? "base64",
                lastChunkHandling: options.lastChunkHandling ?? "loose",
              }
            )
          );

        it.each(optionsList)("with %j", (options) => {
          expect(
            inputs.map((input) => {
              return {
                input,
                ...run(() => encoder.decode(input, options)),
              };
            })
          ).toStrictEqual(
            inputs.map((input) => {
              return {
                input,
                ...run(() => nativeDecode(input, options)),
              };
            })
          );
        });
      }
    );
  });

  describe.each(testRealms)("Uint8Array (%s)", (realm, encoder) => {
    const allBytes = Uint8Array.from({ length: 256 }, (_, i) => i);
    // pseudo random bytes, covers every remainder
    const largeBytes = Uint8Array.from(
      { length: 100_001 },
      (_, i) => (i * 7919 + 13) % 256
    );

    it("should encode bytes with options", () => {
      const bytes = new Uint8Array([0xfb, 0xff]);
      expect(encoder.fromUint8Array(bytes)).toBe("+/8=");
      expect(encoder.fromUint8Array(bytes, { alphabet: "base64url" })).toBe(
        "-_8="
      );
      expect(encoder.fromUint8Array(bytes, { omitPadding: true })).toBe("+/8");
    });

    it("should decode to a plain Uint8Array", () => {
      expect(encoder.toUint8Array("+/8=")).toStrictEqual(
        new Uint8Array([0xfb, 0xff])
      );
      expect(encoder.toUint8Array("-_8")).toStrictEqual(
        new Uint8Array([0xfb, 0xff])
      );
    });

    it("should be typed as an ArrayBuffer backed Uint8Array (BufferSource)", () => {
      // TS 5.7+: accepted by WebCrypto, Blob, fetch... without a cast
      expectTypeOf(encoder.toUint8Array("+/8=")).toEqualTypeOf<
        Uint8Array<ArrayBuffer>
      >();
      expectTypeOf(encoder.toUint8Array("+/8=")).toExtend<BufferSource>();
    });

    it("should not expose a shared (pooled) ArrayBuffer", () => {
      const bytes = encoder.toUint8Array("+/8=");
      expect(bytes.byteOffset).toBe(0);
      expect(bytes.buffer.byteLength).toBe(bytes.byteLength);
    });

    it("should handle empty input", () => {
      expect(encoder.fromUint8Array(new Uint8Array())).toBe("");
      expect(encoder.toUint8Array("")).toStrictEqual(new Uint8Array());
    });

    it("should encode a subarray (non zero byteOffset)", () => {
      expect(encoder.fromUint8Array(allBytes.subarray(0xfb, 0xfd))).toBe(
        "+/w="
      );
    });

    it("should round trip all byte values (0x00-0xff)", () => {
      const encoded = encoder.fromUint8Array(allBytes);
      expect(encoded).toBe(jsBase64.fromUint8Array(allBytes));
      expect(encoder.toUint8Array(encoded)).toStrictEqual(allBytes);
    });

    it("should round trip large binary data", () => {
      const encoded = encoder.fromUint8Array(largeBytes, {
        alphabet: "base64url",
        omitPadding: true,
      });
      expect(encoded).toBe(jsBase64.fromUint8Array(largeBytes, true));
      expect(
        encoder.toUint8Array(encoded, { alphabet: "base64url" })
      ).toStrictEqual(largeBytes);
    }, 15_000);

    it("should apply the decode options", () => {
      expect(() =>
        encoder.toUint8Array("-_8=", { alphabet: "base64" })
      ).toThrow(/Invalid Base64 input/);
      expect(() =>
        encoder.toUint8Array("+/8", { lastChunkHandling: "strict" })
      ).toThrow(/Invalid Base64 input/);
      expect(() => encoder.toUint8Array("+/8*")).toThrow(
        /Invalid Base64 input/
      );
    });
  });

  describe.each(testRealms)(
    "Alphabet interoperability (%s)",
    (realm, encoder) => {
      // 0xfb 0xff produces both '+' and '/' (or '-' and '_')
      const bytes = new Uint8Array([0xfb, 0xff]);
      const standard = "+/8=";
      const urlSafe = "-_8=";
      const urlSafeNoPadding = "-_8";

      it("should produce the same data with '+/' replaced by '-_'", () => {
        expect(encoder.fromUint8Array(bytes)).toBe(standard);
        expect(encoder.fromUint8Array(bytes, { alphabet: "base64url" })).toBe(
          urlSafe
        );
        expect(
          encoder.fromUint8Array(bytes, {
            alphabet: "base64url",
            omitPadding: true,
          })
        ).toBe(urlSafeNoPadding);
      });

      // input, default (both alphabets), alphabet: "base64", alphabet: "base64url"
      // undefined means it throws
      it.each([
        ["standard", standard, bytes, bytes, undefined],
        ["standard without padding", "+/8", bytes, bytes, undefined],
        ["url safe", urlSafe, bytes, undefined, bytes],
        ["url safe without padding", urlSafeNoPadding, bytes, undefined, bytes],
        ["mixed alphabets", "+_8=", bytes, undefined, undefined],
        [
          "no alphabet specific character",
          "Zm9vYmFy",
          new TextEncoder().encode("foobar"),
          new TextEncoder().encode("foobar"),
          new TextEncoder().encode("foobar"),
        ],
      ] as const)(
        "should decode %s base64 (%j) according to the alphabet option",
        (_, input, any, base64, base64url) => {
          expect({
            any: run(() => String(encoder.toUint8Array(input))),
            base64: run(() =>
              String(encoder.toUint8Array(input, { alphabet: "base64" }))
            ),
            base64url: run(() =>
              String(encoder.toUint8Array(input, { alphabet: "base64url" }))
            ),
          }).toStrictEqual({
            any: { value: String(any) },
            base64:
              base64 === undefined
                ? { error: true }
                : { value: String(base64) },
            base64url:
              base64url === undefined
                ? { error: true }
                : { value: String(base64url) },
          });
        }
      );

      it("should decode text encoded with one alphabet using the other one", () => {
        const text = "Hello 🌸 ?>?";
        const encodedStandard = encoder.encode(text);
        const encodedUrlSafe = encoder.encode(text, {
          alphabet: "base64url",
          omitPadding: true,
        });
        expect(encodedStandard).toBe("SGVsbG8g8J+MuCA/Pj8=");
        expect(encodedUrlSafe).toBe("SGVsbG8g8J-MuCA_Pj8");
        // default: both alphabets are accepted
        expect(encoder.decode(encodedStandard)).toBe(text);
        expect(encoder.decode(encodedUrlSafe)).toBe(text);
        // explicit alphabet: the other one is rejected
        expect(encoder.decode(encodedUrlSafe, { alphabet: "base64url" })).toBe(
          text
        );
        expect(() =>
          encoder.decode(encodedStandard, { alphabet: "base64url" })
        ).toThrow(/Invalid Base64 input/);
        expect(() =>
          encoder.decode(encodedUrlSafe, { alphabet: "base64" })
        ).toThrow(/Invalid Base64 input/);
      });

      it("should round trip any length with every alphabet / padding combination", () => {
        // pseudo random bytes, lengths 0 to 64 cover every padding case
        const samples = Array.from({ length: 65 }, (_, length) =>
          Uint8Array.from({ length }, (_, i) => (i * 7919 + length * 31) % 256)
        );
        const decodeAll = (options: Base64EncodeOptions) =>
          samples.map((sample) =>
            String(
              encoder.toUint8Array(encoder.fromUint8Array(sample, options))
            )
          );
        const expected = samples.map(String);
        expect(decodeAll({})).toStrictEqual(expected);
        expect(decodeAll({ omitPadding: true })).toStrictEqual(expected);
        expect(decodeAll({ alphabet: "base64url" })).toStrictEqual(expected);
        expect(
          decodeAll({ alphabet: "base64url", omitPadding: true })
        ).toStrictEqual(expected);
      });
    }
  );

  describe.each(testRealms)("Compatibility", (realm, encoder) => {
    describe(`With js-base64 (${realm})`, () => {
      const encoded = jsBase64.encode(string);

      it("encode", () => {
        expect(encoder.encode(string)).toBe(jsBase64.encode(string));
      });

      it("decode", () => {
        expect(encoder.decode(encoded)).toBe(jsBase64.decode(encoded));
      });
    });
  });
});
