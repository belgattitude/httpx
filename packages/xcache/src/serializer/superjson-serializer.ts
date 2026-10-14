// cause in peerDependencies
import { parse, stringify } from "superjson";

import type { ICacheSerializer } from "./types";

export class SuperjsonSerializer implements ICacheSerializer {
  getIdentifier = (): string => "superjson";
  serialize = <T>(data: T): string => stringify(data);
  deserialize = <T = unknown>(serializedData: string): T =>
    parse<T>(serializedData);
  toString = (): string => this.getIdentifier();
}
