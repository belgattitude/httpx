import type { ICacheSerializer } from './types';

/**
 * Native JSON serializer. Does not support BigInt, ... serialization.
 */
export class JsonSerializer implements ICacheSerializer {
  getIdentifier = (): string => {
    return 'json';
  };
  serialize = <T>(data: T): string => {
    return JSON.stringify(data);
  };
  deserialize = <T = unknown>(serializedData: string): T => {
    return JSON.parse(serializedData) as T;
  };
}
