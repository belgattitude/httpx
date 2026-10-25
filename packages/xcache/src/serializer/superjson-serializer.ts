// cause in peerDependencies
import { parse, serialize, stringify } from "superjson";

import type { ICacheSerializer, ICacheSerializerJsonDetection } from "./types";

/**
 * Superjson serializer (requires the "superjson" peer dependency).
 * Supports Date, BigInt, Map, Set, undefined, NaN... Fast deserialization
 * and compresses well, but slower serialization.
 */
export class SuperjsonSerializer implements ICacheSerializer {
  /** Identifier of the serializer, stored in the compression meta */
  getIdentifier = (): string => "superjson";
  /** Serialize the data into a string */
  serialize = <T>(data: T): string => stringify(data);
  /**
   * Serialize the data and detect plain JSON at no extra cost: superjson
   * only adds a meta when extended types (Date, Map, undefined...) or
   * shared references were found.
   */
  serializeWithJsonDetection = <T>(data: T): ICacheSerializerJsonDetection => {
    const result = serialize(data);
    return result.meta === undefined
      ? { serialized: JSON.stringify(result.json), json: true }
      : { serialized: JSON.stringify(result), json: false };
  };
  /** Deserialize a string created by serialize */
  deserialize = <T = unknown>(serializedData: string): T =>
    parse<T>(serializedData);
  /** Same as getIdentifier */
  toString = (): string => this.getIdentifier();
}
