import prettyBytes from "pretty-bytes";
import { describe, test } from "vitest";

import {
  CborxSerializer,
  DevalueSerializer,
  type ICacheBinarySerializer,
  type ICacheSerializer,
  JsonSerializer,
  SuperjsonSerializer,
} from "../src";
import { benchConfig } from "./bench-config";
import { generateArrayOfData } from "./data-generator";

const options = benchConfig.benchOptions;
const { rows } = benchConfig;

type Serializer = ICacheSerializer | ICacheBinarySerializer;

const nativeSerializers: [label: string, serializer: Serializer][] = [
  ["json", new JsonSerializer()],
  ["devalue", new DevalueSerializer()],
  ["superjson", new SuperjsonSerializer()],
  ["cbor-x", new CborxSerializer()],
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
  serializers: [label: string, serializer: Serializer][],
][])(
  "Serializer benchmarks with %s types",
  (types, extendedTypeSupport, serializers) => {
    const data = generateArrayOfData(rows, extendedTypeSupport);
    const cases = serializers.map(([label, serializer]) => {
      let size: number;
      let deserialize: () => unknown;
      // binary serializers deserialize bytes
      if (serializer.binary === true) {
        const serialized = serializer.serialize(data);
        size = serialized.length;
        deserialize = () => serializer.deserialize(serialized);
      } else {
        const serialized = serializer.serialize(data);
        size = serialized.length;
        deserialize = () => serializer.deserialize(serialized);
      }
      return {
        label,
        serializer,
        deserialize,
        payloadSize: prettyBytes(size),
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
        ...cases.map(({ label, deserialize, payloadSize }) =>
          bench(`${label}.deserialize(${payloadSize}) - ${types} types`, () => {
            const _data = deserialize();
          })
        ),
        options
      );
    });
  }
);
