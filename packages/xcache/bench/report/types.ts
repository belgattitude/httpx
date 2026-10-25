/** Timing statistics of an operation (milliseconds) */
export type TimingResult = {
  median: number;
  mean: number;
  p99: number;
  samples: number;
};

export type CaseResult = {
  scenario: string;
  config: string;
  /** "compressed" or "native" (compression skipped or no compressor) */
  storedAs: "compressed" | "native";
  /** Compressed size in bytes (compressed entries only) */
  compressedSize?: number;
  miss: TimingResult;
  hit: TimingResult;
  /** Measured memory per cached entry in bytes (heap + external) */
  memoryPerEntry: number;
};

export type PlatformInfo = {
  os: string;
  arch: string;
  cpu: string;
  cores: number;
  totalMemory: number;
};

export type EngineInfo = {
  id: "node" | "bun";
  name: string;
  version: string;
  jsEngine: string;
};

export type EngineResults = {
  date: string;
  packageVersion: string;
  platform: PlatformInfo;
  engine: EngineInfo;
  scenarios: {
    id: string;
    title: string;
    description: string;
    rows: number;
    jsonSize: number;
  }[];
  configs: { id: string; label: string }[];
  results: CaseResult[];
};
