import prettyBytes from "pretty-bytes";
import { describe, test } from "vitest";

import {
  DevalueSerializer,
  type ICacheSerializer,
  JsonSerializer,
  SuperjsonSerializer,
} from "../src";
import { benchConfig } from "./bench-config";
import { generateArrayOfData } from "./data-generator";

const options = benchConfig.benchOptions;
const { rows } = benchConfig;

const nativeSerializers: [label: string, serializer: ICacheSerializer][] = [
  ["json", new JsonSerializer()],
  ["devalue", new DevalueSerializer()],
  ["superjson", new SuperjsonSerializer()],
];

// json does not support extended types (Date, BigInt, undefined, NaN...)
const extendedSerializers = nativeSerializers.filter(
  ([label]) => label !== "json"
);

describe.each([
  ["native", false, nativeSerializers],
  ["extended", true, extendedSerializers],
] satisfies [
  types: string,
  extendedTypeSupport: boolean,
  serializers: [label: string, serializer: ICacheSerializer][],
][])(
  "Serializer benchmarks with %s types",
  (types, extendedTypeSupport, serializers) => {
    const data = generateArrayOfData(rows, extendedTypeSupport);
    const cases = serializers.map(([label, serializer]) => {
      const serialized = serializer.serialize(data);
      return {
        label,
        serializer,
        serialized,
        payloadSize: prettyBytes(serialized.length),
      };
    });

    test(`serialize ${types} types`, async ({ bench }) => {
      await bench.compare(
        ...cases.map(({ label, serializer, payloadSize }) =>
          bench(`${label}.serialize(${payloadSize}) - ${types} types`, () => {
            const _data = serializer.serialize(data);
          })
        ),
        options
      );
    });

    test(`deserialize ${types} types`, async ({ bench }) => {
      await bench.compare(
        ...cases.map(({ label, serializer, serialized, payloadSize }) =>
          bench(`${label}.deserialize(${payloadSize}) - ${types} types`, () => {
            const _data = serializer.deserialize(serialized);
          })
        ),
        options
      );
    });
  }
);
