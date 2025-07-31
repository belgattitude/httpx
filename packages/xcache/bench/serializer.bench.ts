import prettyBytes from 'pretty-bytes';
import { bench } from 'vitest';

import {
  DevalueSerializer,
  type ICacheSerializer,
  JsonSerializer,
  SuperjsonSerializer,
} from '../src';
import { benchConfig } from './bench-config';
import { generateArrayOfData } from './data-generator';

const options = benchConfig.benchOptions;

describe.each([
  ['json', new JsonSerializer()],
  ['devalue', new DevalueSerializer()],
  ['superjson', new SuperjsonSerializer()],
] satisfies [label: string, serializer: ICacheSerializer][])(
  `Serializer benchmarks with %s`,
  (label, serializer) => {
    const data = generateArrayOfData(50_000, false);
    const serialized = serializer.serialize(data);
    const payloadSize = prettyBytes(serialized.length);
    bench(
      `${label}.serialize(${payloadSize})`,
      () => {
        const _data = serializer.serialize(data);
      },
      options
    );
    bench(
      `${label}.deserialize(${payloadSize})`,
      () => {
        const _data = serializer.deserialize(serialized);
      },
      options
    );
  }
);
