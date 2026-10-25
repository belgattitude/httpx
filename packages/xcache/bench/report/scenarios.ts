import {
  CacheCompress,
  type ICacheBinarySerializer,
  type ICacheSerializer,
  JsonSerializer,
} from "@httpx/xcache";
import { CborxSerializer } from "@httpx/xcache/cbor-x";
import { DevalueSerializer } from "@httpx/xcache/devalue";
import { SuperjsonSerializer } from "@httpx/xcache/superjson";

import { generateArrayOfData } from "../data-generator.ts";

export type Scenario = {
  id: string;
  title: string;
  description: string;
  rows: number;
  extendedTypes: boolean;
  /** Number of entries added to measure the memory per entry */
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
    memoryEntries: 200,
  }),
  createScenario({
    id: "medium",
    title: "Medium payload",
    description: "Array of records, compressed with the default options",
    rows: 3400,
    extendedTypes: false,
    memoryEntries: 20,
  }),
  createScenario({
    id: "large",
    title: "Large payload",
    description: "Array of records, compressed with the default options",
    rows: 44_000,
    extendedTypes: false,
    memoryEntries: 2,
  }),
  createScenario({
    id: "large-extended",
    title: "Large payload with extended types",
    description:
      "Same as large, with Date, BigInt, undefined and NaN values (json is not supported)",
    rows: 44_000,
    extendedTypes: true,
    memoryEntries: 2,
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
  serializer: ICacheSerializer | ICacheBinarySerializer,
  options?: { detectJson?: boolean }
): CacheCompress =>
  new CacheCompress({ algorithm: "gzip", serializer, ...options });

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

/** Scenario used for the hono comparison */
export const honoScenarioId = "medium";

export type HonoConfig = {
  id: string;
  label: string;
  description: string;
  /** undefined: no cache, c.json(payload) on each request */
  createCompressor: (() => CacheCompress) | undefined;
};

/**
 * createHonoXCache with a JSON response (JsonSerializer) and an XMemCache
 * instance compressing with different serializers.
 */
export const honoConfigs: HonoConfig[] = [
  {
    id: "none",
    label: "No cache (c.json)",
    description:
      "Hono c.json(payload) on each request, baseline (the payload is already in memory, a real handler also pays the data fetching)",
    createCompressor: undefined,
  },
  {
    id: "json",
    label: "json + gzip",
    description: "Compressed JSON, sent as-is",
    createCompressor: () => gzip(new JsonSerializer()),
  },
  {
    id: "superjson",
    label: "superjson + gzip",
    description:
      "Plain data detected and stored as JSON (detectJson), sent as-is",
    createCompressor: () => gzip(new SuperjsonSerializer()),
  },
  {
    id: "superjson-no-detect",
    label: "superjson + gzip (detectJson: false)",
    description:
      "Stored in the superjson format: decompressed, deserialized and serialized to JSON",
    createCompressor: () =>
      gzip(new SuperjsonSerializer(), { detectJson: false }),
  },
  {
    id: "cbor-x",
    label: "cbor-x + gzip",
    description:
      "Stored as CBOR: decompressed, deserialized and serialized to JSON",
    createCompressor: () => gzip(new CborxSerializer()),
  },
];
