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
  /**
   * Optional JSON detection: serialize the data and tell whether the result
   * is plain JSON (no extended types), so it can be stored as JSON and read
   * with JSON.parse. Supported by SuperjsonSerializer at no extra cost.
   * DevalueSerializer can't support it (its format is never plain JSON and
   * it doesn't tell whether extended types were found).
   */
  serializeWithJsonDetection?: <T>(data: T) => ICacheSerializerJsonDetection;
  /** Same as getIdentifier */
  toString: () => string;
}

/**
 * Result of ICacheSerializer.serializeWithJsonDetection.
 */
export type ICacheSerializerJsonDetection = {
  /** Serialized data: plain JSON when json is true */
  serialized: string;
  /** Whether serialized is plain JSON (readable with JSON.parse) */
  json: boolean;
};
