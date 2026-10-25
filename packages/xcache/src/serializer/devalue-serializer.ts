// cause in peerDependencies
import { parse, stringify } from "devalue";

import type { ICacheSerializer } from "./types";

/**
 * Devalue serializer (requires the "devalue" peer dependency).
 * Supports Date, BigInt, Map, Set, undefined, NaN, repeated and cyclic
 * references... Fastest with extended types, but compresses less well.
 * Does not support JSON detection (CacheCompress detectJson option).
 */
export class DevalueSerializer implements ICacheSerializer {
  /** Identifier of the serializer, stored in the compression meta */
  getIdentifier = (): string => "devalue";
  /** Serialize the data into a string */
  serialize = <T>(data: T): string => stringify(data);
  /** Deserialize a string created by serialize */
  deserialize = <T = unknown>(serializedData: string): T =>
    parse(serializedData) as T;
  /** Same as getIdentifier */
  toString = (): string => this.getIdentifier();
}
