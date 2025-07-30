export interface ICacheSerializer {
  serialize: <T>(data: T) => string;
  deserialize: <T = unknown>(serializedData: string) => T;
}
