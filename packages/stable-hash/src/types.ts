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
  algorithm?: 'SHA-256';
};
