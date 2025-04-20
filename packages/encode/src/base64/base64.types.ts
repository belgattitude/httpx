export interface Base64Encoder {
  encode: (input: string) => string;
  decode: (input: string) => string;
}
