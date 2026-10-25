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

export type HonoCaseResult = {
  config: string;
  /** "compressed" or "native" (no cache: "none") */
  storedAs: "compressed" | "native" | "none";
  /** Compression meta content ("json" with JSON detection) */
  content?: string;
  /** Whether the compressed bytes are sent as-is to a gzip client */
  sentAsIs: boolean;
  /** Request on a new key (gzip client) */
  miss: TimingResult;
  /** Cached request from a client accepting gzip */
  hitGzip: TimingResult;
  /** Cached request from a client not accepting gzip */
  hitIdentity: TimingResult;
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
  hono: {
    scenario: string;
    configs: { id: string; label: string; description: string }[];
    results: HonoCaseResult[];
  };
};
