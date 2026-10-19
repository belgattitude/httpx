/**
 * Serializer interface used by CacheCompress to convert the data into a
 * string before compression (JsonSerializer, SuperjsonSerializer,
 * DevalueSerializer or a custom implementation).
 */
export interface ICacheSerializer {
  /** Serialize the data into a string */
  serialize: <T>(data: T) => string;
  /** Deserialize a string created by serialize */
  deserialize: <T = unknown>(serializedData: string) => T;
  /**
   * Identifier of the serializer (ie: "superjson"), used in the generated
   * cache keys and stored in the compression meta.
   */
  getIdentifier: () => string;
  toString: () => string;
}
