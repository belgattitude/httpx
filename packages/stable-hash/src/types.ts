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

export type Options = {
  sortArrayValues?: boolean;
};
