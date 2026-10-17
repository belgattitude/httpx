import { run, testRealms } from "./test-realms";

/**
 * JWT segments are base64url encoded without padding (RFC 7515 §2). These
 * tests cover issues commonly reported when encoding / decoding tokens.
 */

// RFC 7515 Appendix A.1 (JWS using HMAC SHA-256)
const rfc7515 = {
  header: '{"typ":"JWT",\r\n "alg":"HS256"}',
  payload:
    '{"iss":"joe",\r\n "exp":1300819380,\r\n "http://example.com/is_root":true}',
  encodedHeader: "eyJ0eXAiOiJKV1QiLA0KICJhbGciOiJIUzI1NiJ9",
  encodedPayload:
    "eyJpc3MiOiJqb2UiLA0KICJleHAiOjEzMDA4MTkzODAsDQogImh0dHA6Ly9leGFtcGxlLmNvbS9pc19yb290Ijp0cnVlfQ",
  signature: "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk",
  // symmetric key (jwk "k" parameter, base64url)
  key: "AyM1SysPpbyDfgZld3umj1qzKObwVMkoqQ-EstJQLr_T-1qS0gZH75aKtMN3Yj0iPS4hcgUuTwjAzZr1Z9CAow",
} as const;

const token = `${rfc7515.encodedHeader}.${rfc7515.encodedPayload}.${rfc7515.signature}`;

const jwtOptions = { alphabet: "base64url", omitPadding: true } as const;

describe.each(testRealms)("JWT (%s)", (realm, encoder) => {
  describe("RFC 7515 example", () => {
    it("should encode the header and payload (base64url, no padding)", () => {
      expect(encoder.encode(rfc7515.header, jwtOptions)).toBe(
        rfc7515.encodedHeader
      );
      expect(encoder.encode(rfc7515.payload, jwtOptions)).toBe(
        rfc7515.encodedPayload
      );
    });

    it("should decode the segments of a token (CRLF in the json preserved)", () => {
      const [header = "", payload = ""] = token.split(".");
      expect(encoder.decode(header)).toBe(rfc7515.header);
      expect(encoder.decode(payload, { alphabet: "base64url" })).toBe(
        rfc7515.payload
      );
      expect(JSON.parse(encoder.decode(payload))).toStrictEqual({
        iss: "joe",
        exp: 1_300_819_380,
        "http://example.com/is_root": true,
      });
    });

    it("should verify the HS256 signature (binary key and signature)", async () => {
      const key = await crypto.subtle.importKey(
        "raw",
        encoder.toUint8Array(rfc7515.key),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["verify"]
      );
      const isValid = await crypto.subtle.verify(
        "HMAC",
        key,
        encoder.toUint8Array(rfc7515.signature),
        new TextEncoder().encode(
          `${rfc7515.encodedHeader}.${rfc7515.encodedPayload}`
        )
      );
      expect(isValid).toBe(true);
    });
  });

  describe("reported issues", () => {
    it("should throw when decoding the whole token instead of a segment", () => {
      // '.' is not a base64 character, split the token first
      expect(() => encoder.decode(token)).toThrow(/Invalid Base64 input/);
    });

    it("should decode utf-8 claims without mojibake", () => {
      // JSON.parse(atob(payload)) returns {"name":"JosÃ© ð\u009f\u008c¸"}
      const payload = "eyJuYW1lIjoiSm9zw6kg8J-MuCIsInEiOiJhPz5iIn0";
      expect(JSON.parse(encoder.decode(payload))).toStrictEqual({
        name: "José 🌸",
        q: "a?>b",
      });
    });

    it("should convert every '-' and '_', not only the first one", () => {
      // a common bug: payload.replace("-", "+").replace("_", "/")
      const payload = "eyJxIjoiPz8_Pj4-Pz8_IiwiYSI6In5-fj8_Pz4-PiJ9";
      expect(JSON.parse(encoder.decode(payload))).toStrictEqual({
        q: "???>>>???",
        a: "~~~???>>>",
      });
    });

    it("should not need the padding to be restored", () => {
      // payload length % 4 === 2, header length % 4 === 0
      expect(encoder.decode(rfc7515.encodedPayload)).toBe(rfc7515.payload);
      expect(encoder.decode(`${rfc7515.encodedPayload}==`)).toBe(
        rfc7515.payload
      );
    });

    it("should reject the padding added by a naive '4 - length % 4' fix", () => {
      // header length % 4 === 0: '='.repeat(4 - 0) appends "===="
      expect(() => encoder.decode(`${rfc7515.encodedHeader}====`)).toThrow(
        /Invalid Base64 input/
      );
    });

    it("should reject a truncated segment (length % 4 === 1)", () => {
      expect(() => encoder.decode(rfc7515.encodedPayload.slice(0, -1))).toThrow(
        /Invalid Base64 input/
      );
    });

    it("should ignore a trailing line break (ie: token copied from a file)", () => {
      expect(encoder.decode(`${rfc7515.encodedHeader}\n`)).toBe(rfc7515.header);
    });

    it("should only decode the signature as bytes, decode() is lossy", () => {
      const bytes = encoder.toUint8Array(rfc7515.signature);
      expect(bytes).toHaveLength(32);
      expect(encoder.fromUint8Array(bytes, jwtOptions)).toBe(rfc7515.signature);
      // the signature bytes are not valid utf-8
      expect(
        encoder.encode(encoder.decode(rfc7515.signature), jwtOptions)
      ).not.toBe(rfc7515.signature);
      expect(() => encoder.decode(rfc7515.signature, { fatal: true })).toThrow(
        /Invalid UTF-8/
      );
    });

    it("should detect a non canonical signature by re-encoding it (malleability)", () => {
      // 43 chars: the 2 low bits of the last char are not part of the
      // output, 'k' (0b100100) and 'l' (0b100101) decode to the same bytes
      const altered = `${rfc7515.signature.slice(0, -1)}l`;
      expect(encoder.toUint8Array(altered)).toStrictEqual(
        encoder.toUint8Array(rfc7515.signature)
      );
      expect(
        encoder.fromUint8Array(encoder.toUint8Array(altered), jwtOptions)
      ).not.toBe(altered);
    });

    it("should decode the empty signature of an unsecured token (alg: none)", () => {
      const [header = "", , signature = ""] = "eyJhbGciOiJub25lIn0.e30.".split(
        "."
      );
      expect(encoder.decode(header)).toBe('{"alg":"none"}');
      expect(encoder.toUint8Array(signature)).toStrictEqual(new Uint8Array());
    });

    it("should reject standard base64 when the url safe alphabet is required", () => {
      const standard = "eyJuYW1lIjoiSm9zw6kg8J+MuCIsInEiOiJhPz5iIn0=";
      expect(run(() => encoder.decode(standard))).toStrictEqual({
        value: '{"name":"José 🌸","q":"a?>b"}',
      });
      expect(() => encoder.decode(standard, { alphabet: "base64url" })).toThrow(
        /Invalid Base64 input/
      );
    });
  });
});
