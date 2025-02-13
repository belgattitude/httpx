import type { HashStrOptions } from './hash-str';

export type SupportedDataTypes =
  | Record<string, unknown>
  | unknown[]
  | Date
  | string
  | number
  | boolean
  | bigint
  | null
  | undefined;

export type SupportedDataTypesRW =
  | SupportedDataTypes
  | Readonly<SupportedDataTypes>;

export type CreateStableKeyOptions = {
  sortArrayValues?: boolean;
};

export type CreateStableHashOptions = CreateStableKeyOptions & {
  /**
   * Hashing algorithm to use
   * @default 'SHA-256'
   */
  algorithm?: HashStrOptions['algorithm'];
  /**
   * Encode the hash in hexadecimal or base64
   * @default 'base64'
   */
  encoding?: HashStrOptions['encoding'];
};
