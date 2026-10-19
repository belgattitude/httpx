import type { ICacheSerializer } from "./types";

/**
 * Native JSON serializer. Fastest and smallest, but does not support
 * extended types (Date are converted to strings, BigInt throws...).
 */
export class JsonSerializer implements ICacheSerializer {
  /** Identifier of the serializer, stored in the compression meta */
  getIdentifier = (): string => "json";
  /** Serialize the data into a string */
  serialize = <T>(data: T): string => JSON.stringify(data);
  /** Deserialize a string created by serialize */
  deserialize = <T = unknown>(serializedData: string): T =>
    JSON.parse(serializedData) as T;
  /** Same as getIdentifier */
  toString = (): string => this.getIdentifier();
}
