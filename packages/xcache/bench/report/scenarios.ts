import {
  CacheCompress,
  CborxSerializer,
  DevalueSerializer,
  type ICacheBinarySerializer,
  type ICacheSerializer,
  JsonSerializer,
  SuperjsonSerializer,
} from "@httpx/xcache";

import { generateArrayOfData } from "../data-generator.ts";

export type Scenario = {
  id: string;
  title: string;
  description: string;
  rows: number;
  extendedTypes: boolean;
  /** Number of entries cached to measure the memory per entry */
  memoryEntries: number;
  createPayload: () => ReturnType<typeof generateArrayOfData>;
};

const createScenario = (
  scenario: Omit<Scenario, "createPayload">
): Scenario => {
  return {
    ...scenario,
    createPayload: () =>
      generateArrayOfData(scenario.rows, scenario.extendedTypes),
  };
};

export const scenarios: Scenario[] = [
  createScenario({
    id: "small",
    title: "Small payload",
    description:
      "Array of small records, under the compression minimum size (stored as-is)",
    rows: 20,
    extendedTypes: false,
    memoryEntries: 500,
  }),
  createScenario({
    id: "medium",
    title: "Medium payload",
    description: "Array of records, compressed with the default options",
    rows: 1000,
    extendedTypes: false,
    memoryEntries: 100,
  }),
  createScenario({
    id: "large",
    title: "Large payload",
    description: "Array of records, compressed with the default options",
    rows: 11_000,
    extendedTypes: false,
    memoryEntries: 20,
  }),
  createScenario({
    id: "large-extended",
    title: "Large payload with extended types",
    description:
      "Same as large, with Date, BigInt, undefined and NaN values (json is not supported)",
    rows: 11_000,
    extendedTypes: true,
    memoryEntries: 20,
  }),
];

export type CacheConfig = {
  id: string;
  label: string;
  /** Can't round-trip extended types (Date, BigInt...) */
  nativeTypesOnly: boolean;
  createCompressor: () => CacheCompress | undefined;
};

const gzip = (
  serializer: ICacheSerializer | ICacheBinarySerializer
): CacheCompress => new CacheCompress({ algorithm: "gzip", serializer });

export const configs: CacheConfig[] = [
  {
    id: "none",
    label: "No compression",
    nativeTypesOnly: false,
    createCompressor: () => undefined,
  },
  {
    id: "json",
    label: "json + gzip",
    nativeTypesOnly: true,
    createCompressor: () => gzip(new JsonSerializer()),
  },
  {
    id: "superjson",
    label: "superjson + gzip",
    nativeTypesOnly: false,
    createCompressor: () => gzip(new SuperjsonSerializer()),
  },
  {
    id: "devalue",
    label: "devalue + gzip",
    nativeTypesOnly: false,
    createCompressor: () => gzip(new DevalueSerializer()),
  },
  {
    id: "cbor-x",
    label: "cbor-x + gzip",
    nativeTypesOnly: false,
    createCompressor: () => gzip(new CborxSerializer()),
  },
];
