// cause in peerDependencies
import { parse, stringify } from "devalue";

import type { ICacheSerializer } from "./types";

export class DevalueSerializer implements ICacheSerializer {
  getIdentifier = (): string => "devalue";
  serialize = <T>(data: T): string => stringify(data);
  deserialize = <T = unknown>(serializedData: string): T =>
    parse(serializedData) as T;
  toString = (): string => this.getIdentifier();
}
