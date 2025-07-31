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
const { isCiOrCodSpeed } = benchConfig;
const rows = isCiOrCodSpeed ? 100 : 50_000; // Adjust rows based on environment
describe.each([
  ['json', new JsonSerializer(), false],
  ['devalue', new DevalueSerializer(), false],
  ['superjson', new SuperjsonSerializer(), false],
  ['devalue', new DevalueSerializer(), true],
  ['superjson', new SuperjsonSerializer(), true],
] satisfies [
  label: string,
  serializer: ICacheSerializer,
  extendedTypeSupport: boolean,
][])(
  `Serializer benchmarks with %s`,
  (label, serializer, extendedTypeSupport) => {
    const data = generateArrayOfData(rows, extendedTypeSupport);
    const serialized = serializer.serialize(data);
    const payloadSize = prettyBytes(serialized.length);
    bench(
      `${label}.serialize(${payloadSize}) - ${extendedTypeSupport ? 'extended' : 'native'} types`,
      () => {
        const _data = serializer.serialize(data);
      },
      options
    );
    bench(
      `${label}.deserialize(${payloadSize}) - ${extendedTypeSupport ? 'extended' : 'native'} types`,
      () => {
        const _data = serializer.deserialize(serialized);
      },
      options
    );
  }
);
