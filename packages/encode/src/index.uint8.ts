// For runtimes that always provide Uint8Array.fromBase64 / toBase64
// (bun, deno): no feature detection, the native implementation is the
// fastest (see bench/).
export { Base64Uint8Array as Base64 } from "./base64/base64.uint8array";
export type {
  Base64Alphabet,
  Base64DecodeOptions,
  Base64DecodeTextOptions,
  Base64EncodeOptions,
  Base64Encoder,
} from "./base64/base64.types";
