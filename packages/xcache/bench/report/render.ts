/**
 * Render bench/report/output/{node,bun}.json into report.md and report.json.
 *
 * node bench/report/render.ts
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";

import prettyBytes from "pretty-bytes";

import type {
  CaseResult,
  EngineInfo,
  EngineResults,
  TimingResult,
} from "./types.ts";

const outputDir = new URL("output/", import.meta.url);

const engineIds = ["node", "bun"] as const;

// BENCH_ENGINES (set by index.ts): ignore results of engines not run
const selectedEngines = process.env.BENCH_ENGINES?.split(",");

const loaded = engineIds
  .filter((id) => selectedEngines?.includes(id) ?? true)
  .map((id) => new URL(`${id}.json`, outputDir))
  .filter((file) => existsSync(file))
  .map((file) => JSON.parse(readFileSync(file, "utf8")) as EngineResults);

const [reference] = loaded;
if (reference === undefined) {
  throw new Error("No results found, run bench/report/run.ts first");
}
const engines: EngineInfo[] = loaded.map(({ engine }) => engine);
const node = loaded.find(({ engine }) => engine.id === "node");
const bun = loaded.find(({ engine }) => engine.id === "bun");

const findResult = (
  results: EngineResults | undefined,
  scenario: string,
  config: string
): CaseResult | undefined =>
  results?.results.find(
    (result) => result.scenario === scenario && result.config === config
  );

const formatTime = (ms: number): string => {
  if (ms < 0.001) {
    return `${Math.round(ms * 1e6)} ns`;
  }
  if (ms < 1) {
    return `${(ms * 1000).toFixed(1)} µs`;
  }
  if (ms < 10) {
    return `${ms.toFixed(2)} ms`;
  }
  return ms < 100 ? `${ms.toFixed(1)} ms` : `${Math.round(ms)} ms`;
};

/** Icons of the best value per column */
const icons = {
  miss: "⚡",
  hit: "🚀",
  size: "🪶",
} as const;

/** Format the value, with the icon in bold when it's the best one */
const markBest = (
  value: number,
  best: number,
  format: (value: number) => string,
  icon: string
): string => (value === best ? `${icon} **${format(value)}**` : format(value));

const formatBytes = (bytes: number): string =>
  prettyBytes(bytes, { maximumFractionDigits: 1 });

/** "1.85× faster" or "1.20× slower" (ratio = reference / compared) */
const formatGain = (ratio: number, better: string, worse: string): string => {
  if (!Number.isFinite(ratio) || ratio <= 0) {
    return "n/a";
  }
  if (Math.abs(ratio - 1) < 0.05) {
    return "≈ same";
  }
  return ratio > 1
    ? `**${ratio.toFixed(2)}× ${better}**`
    : `${(1 / ratio).toFixed(2)}× ${worse}`;
};

const geometricMean = (values: number[]): number =>
  values.length === 0
    ? Number.NaN
    : Math.exp(
        values.reduce((acc, value) => acc + Math.log(value), 0) / values.length
      );

/** Bun vs Node ratios (> 1: bun is better) */
const compareEngines = (cases: { node: CaseResult; bun: CaseResult }[]) => {
  return {
    miss: geometricMean(
      cases.map(({ node, bun }) => node.miss.median / bun.miss.median)
    ),
    hit: geometricMean(
      cases.map(({ node, bun }) => node.hit.median / bun.hit.median)
    ),
    memory: geometricMean(
      cases
        .filter(
          ({ node, bun }) => node.memoryPerEntry > 0 && bun.memoryPerEntry > 0
        )
        .map(({ node, bun }) => node.memoryPerEntry / bun.memoryPerEntry)
    ),
  };
};

const pairedCases = (scenario?: string) =>
  reference.results
    .filter((result) => scenario === undefined || result.scenario === scenario)
    .flatMap((result) => {
      const nodeResult = findResult(node, result.scenario, result.config);
      const bunResult = findResult(bun, result.scenario, result.config);
      return nodeResult === undefined || bunResult === undefined
        ? []
        : [{ node: nodeResult, bun: bunResult }];
    });

const configLabel = (id: string): string =>
  reference.configs.find((config) => config.id === id)?.label ?? id;

// ---------------------------------------------------------------- json

const timing = ({ median, mean, p99, samples }: TimingResult) => {
  return { median, mean, p99, samples };
};

const scenarioSummaries = reference.scenarios.map((scenario) => {
  const ratios =
    node && bun ? compareEngines(pairedCases(scenario.id)) : undefined;
  return { scenario: scenario.id, bunVsNode: ratios };
});

const report = {
  generatedAt: new Date().toISOString(),
  packageVersion: reference.packageVersion,
  platform: reference.platform,
  engines: loaded.map(({ engine, date }) => {
    return { ...engine, date };
  }),
  scenarios: reference.scenarios,
  configs: reference.configs,
  results: reference.results.map(({ scenario, config }) => {
    return {
      scenario,
      config,
      engines: Object.fromEntries(
        loaded.flatMap((results) => {
          const result = findResult(results, scenario, config);
          return result === undefined
            ? []
            : [
                [
                  results.engine.id,
                  {
                    storedAs: result.storedAs,
                    compressedSize: result.compressedSize ?? null,
                    missMs: timing(result.miss),
                    hitMs: timing(result.hit),
                    memoryPerEntryBytes: Math.round(result.memoryPerEntry),
                  },
                ],
              ];
        })
      ),
    };
  }),
  summary: {
    // ratios > 1: bun is faster (miss, hit) or uses less memory
    bunVsNode:
      node && bun
        ? {
            overall: compareEngines(pairedCases()),
            scenarios: scenarioSummaries,
          }
        : null,
  },
};

writeFileSync(
  new URL("../report.json", outputDir),
  `${JSON.stringify(report, null, 2)}\n`
);

// ---------------------------------------------------------------- markdown

const lines: string[] = [];
const push = (...values: string[]) => {
  lines.push(...values);
};
const table = (headers: string[], rows: string[][], align?: string[]) => {
  push(
    `| ${headers.join(" | ")} |`,
    `| ${headers.map((_, i) => align?.[i] ?? "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`),
    ""
  );
};

const { platform } = reference;
push(
  "# @httpx/xcache benchmark report",
  "",
  `Generated on ${report.generatedAt.slice(0, 10)} with @httpx/xcache ${reference.packageVersion}.`,
  "",
  "## Platform",
  ""
);
table(
  ["", ""],
  [
    ["OS", platform.os],
    ["Architecture", platform.arch],
    ["CPU", `${platform.cpu} (${platform.cores} cores)`],
    ["Memory", prettyBytes(platform.totalMemory, { binary: true })],
  ]
);
push("## Engines", "");
table(
  ["Runtime", "Version", "JS engine"],
  engines.map((engine) => [engine.name, engine.version, engine.jsEngine])
);

push("## Summary", "");
if (node && bun) {
  const overall = compareEngines(pairedCases());
  push(
    `Bun ${bun.engine.version} vs Node.js ${node.engine.version} (geometric mean of the median times of all serializers, memory is indicative: each engine accounts memory differently).`,
    ""
  );
  table(
    ["Scenario", "Cache miss", "Cache hit", "Memory per entry"],
    [
      ...reference.scenarios.map((scenario) => {
        const ratios = compareEngines(pairedCases(scenario.id));
        return [
          scenario.title,
          formatGain(ratios.miss, "faster", "slower"),
          formatGain(ratios.hit, "faster", "slower"),
          formatGain(ratios.memory, "less", "more"),
        ];
      }),
      [
        "**Overall**",
        formatGain(overall.miss, "faster", "slower"),
        formatGain(overall.hit, "faster", "slower"),
        formatGain(overall.memory, "less", "more"),
      ],
    ],
    ["---", "--:", "--:", "--:"]
  );
} else {
  push(
    `Only ${engines.map(({ name }) => name).join(", ")} results found: run the bench with both Node.js and Bun to compare them.`,
    ""
  );
}

const best = (
  results: EngineResults,
  scenario: string,
  pick: (result: CaseResult) => number
): string => {
  const candidates = results.results.filter(
    (result) => result.scenario === scenario && result.config !== "none"
  );
  const sorted = candidates.toSorted((a, b) => pick(a) - pick(b));
  const [winner] = sorted;
  const last = sorted.at(-1);
  if (winner === undefined || last === undefined) {
    return "n/a";
  }
  // within 15%: not significant
  return pick(last) <= pick(winner) * 1.15
    ? "all similar"
    : configLabel(winner.config);
};

push(
  `Best serializer per scenario (${reference.engine.name}, excluding "No compression"):`,
  ""
);
table(
  [
    "Scenario",
    `${icons.miss} Fastest miss`,
    `${icons.hit} Fastest hit`,
    `${icons.size} Smallest memory`,
  ],
  reference.scenarios.map((scenario) => [
    scenario.title,
    best(reference, scenario.id, (result) => result.miss.median),
    best(reference, scenario.id, (result) => result.hit.median),
    best(reference, scenario.id, (result) => result.memoryPerEntry),
  ])
);

push(
  "## Method",
  "",
  "- The cached function resolves immediately: times are the cache overhead only.",
  "- **Cache miss**: cache key generation, serialization, compression and storage (a new key each time).",
  "- **Cache hit**: lookup, decompression and deserialization of the same key.",
  "- Times are medians (mean, p99 and sample count in `report.json`).",
  '- **Memory per entry**: growth of `heapUsed + external` after a forced GC, between a half-full and a full cache of fresh payloads (fixed costs excluded), median of 3 runs. "No compression" keeps the live objects.',
  "- Compression: `CacheCompress` with `gzip` and the default options (compressed from 16K characters and 32 KB saved), `binary` encoding.",
  ""
);

push("## Scenarios", "");
push(
  `${icons.miss} fastest cache miss (serialize + compress), ${icons.hit} fastest cache hit (decompress + deserialize), ${icons.size} smallest size. "No compression" is excluded, it keeps the live objects.`,
  ""
);
const headers = ["Serializer", "Stored as", "Compressed size"];
for (const engine of engines) {
  headers.push(`Miss ${engine.name}`);
}
for (const engine of engines) {
  headers.push(`Hit ${engine.name}`);
}
for (const engine of engines) {
  headers.push(`Memory ${engine.name}`);
}

for (const [index, scenario] of reference.scenarios.entries()) {
  push(
    `### ${index + 1}. ${scenario.title}`,
    "",
    `${scenario.description}: ${scenario.rows.toLocaleString("en-US")} records, ${formatBytes(scenario.jsonSize)} as JSON.`,
    ""
  );
  const scenarioResults = reference.results.filter(
    (result) => result.scenario === scenario.id
  );
  const column = (
    results: EngineResults,
    pick: (result: CaseResult) => number,
    format: (value: number) => string,
    icon: string
  ) => {
    const values = scenarioResults.map((result) => {
      const found = findResult(results, scenario.id, result.config);
      return found === undefined ? undefined : pick(found);
    });
    // "No compression" is the baseline, not a candidate
    const candidates = values.filter(
      (value, i): value is number =>
        value !== undefined && scenarioResults[i]?.config !== "none"
    );
    const min = Math.min(...candidates);
    return values.map((value) => {
      if (value === undefined) {
        return "n/a";
      }
      return markBest(value, min, format, icon);
    });
  };
  const compressedSizes = scenarioResults.flatMap(({ compressedSize }) =>
    compressedSize === undefined ? [] : [compressedSize]
  );
  const minCompressedSize = Math.min(...compressedSizes);
  const columns = [
    ...loaded.map((results) =>
      column(results, (result) => result.miss.median, formatTime, icons.miss)
    ),
    ...loaded.map((results) =>
      column(results, (result) => result.hit.median, formatTime, icons.hit)
    ),
    ...loaded.map((results) =>
      column(
        results,
        (result) => result.memoryPerEntry,
        formatBytes,
        icons.size
      )
    ),
  ];
  table(
    headers,
    scenarioResults.map((result, row) => [
      configLabel(result.config),
      result.storedAs,
      result.compressedSize === undefined
        ? "-"
        : markBest(
            result.compressedSize,
            minCompressedSize,
            formatBytes,
            icons.size
          ),
      ...columns.map((values) => values[row] ?? "n/a"),
    ]),
    headers.map((_, i) => (i < 2 ? "---" : "--:"))
  );
}

writeFileSync(new URL("../report.md", outputDir), lines.join("\n"));
console.log(
  `Report written to ${new URL("../report.md", outputDir).pathname} and report.json`
);
