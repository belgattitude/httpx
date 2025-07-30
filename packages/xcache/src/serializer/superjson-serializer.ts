// cause in peerDependencies
// eslint-disable-next-line import-x/no-extraneous-dependencies
import { parse, stringify } from 'superjson';

import type { ICacheSerializer } from './types';

export class SuperjsonSerializer implements ICacheSerializer {
  serialize = <T>(data: T): string => {
    return stringify(data);
  };
  deserialize = <T = unknown>(serializedData: string): T => {
    return parse<T>(serializedData);
  };
}
