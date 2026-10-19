// cause in peerDependencies
import { parse, stringify } from "superjson";

import type { ICacheSerializer } from "./types";

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
  /** Deserialize a string created by serialize */
  deserialize = <T = unknown>(serializedData: string): T =>
    parse<T>(serializedData);
  /** Same as getIdentifier */
  toString = (): string => this.getIdentifier();
}
