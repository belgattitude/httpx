export type SupportedStringEncodings = 'base64' | 'base64_urlsafe';
export const supportedStringEncodings = [
  'base64',
  'base64_urlsafe',
] as const satisfies SupportedStringEncodings[];

export type EncodeStringOptions = {
  encoding?: SupportedStringEncodings;
};
