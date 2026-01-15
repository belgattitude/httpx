export type OptionalKeysOf<T extends object> = {
  [K in keyof T]-?: object extends Pick<T, K> ? K : never;
}[keyof T];

export type RequiredOptionals<T extends object> = {
  [K in OptionalKeysOf<T>]-?: T[K];
};
