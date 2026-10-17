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
describe.each([
  ["json", new JsonSerializer(), false],
  ["devalue", new DevalueSerializer(), false],
  ["superjson", new SuperjsonSerializer(), false],
  ["devalue", new DevalueSerializer(), true],
  ["superjson", new SuperjsonSerializer(), true],
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
    const types = extendedTypeSupport ? "extended" : "native";
    test(`serialize / deserialize ${types} types`, async ({ bench }) => {
      await bench.compare(
        bench(`${label}.serialize(${payloadSize}) - ${types} types`, () => {
          const _data = serializer.serialize(data);
        }),
        bench(`${label}.deserialize(${payloadSize}) - ${types} types`, () => {
          const _data = serializer.deserialize(serialized);
        }),
        options
      );
    });
  }
);
