import type { ICacheSerializer } from "./types";

/**
 * Native JSON serializer. Does not support BigInt, ... serialization.
 */
export class JsonSerializer implements ICacheSerializer {
  getIdentifier = (): string => "json";
  serialize = <T>(data: T): string => JSON.stringify(data);
  deserialize = <T = unknown>(serializedData: string): T =>
    JSON.parse(serializedData) as T;
  toString = (): string => this.getIdentifier();
}
