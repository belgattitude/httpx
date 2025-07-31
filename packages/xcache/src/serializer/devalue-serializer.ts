// cause in peerDependencies
// eslint-disable-next-line import-x/no-extraneous-dependencies
import { parse, stringify } from 'devalue';

import type { ICacheSerializer } from './types';

export class DevalueSerializer implements ICacheSerializer {
  getIdentifier = (): string => {
    return 'devalue';
  };
  serialize = <T>(data: T): string => {
    return stringify(data);
  };
  deserialize = <T = unknown>(serializedData: string): T => {
    return parse(serializedData) as T;
  };
  toString = (): string => {
    return this.getIdentifier();
  };
}
