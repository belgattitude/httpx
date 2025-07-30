import type { ICacheSerializer } from './types';

export class JsonSerializer implements ICacheSerializer {
  serialize = <T>(data: T): string => {
    return JSON.stringify(data);
  };
  deserialize = <T = unknown>(serializedData: string): T => {
    return JSON.parse(serializedData) as T;
  };
}
