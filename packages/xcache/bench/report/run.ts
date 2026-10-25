/**
 * Run the xcache scenarios in the current runtime (node or bun) and write
 * the results to bench/report/output/<engine>.json.
 *
 * node --expose-gc bench/report/run.ts
 * bun bench/report/run.ts
 */
import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import { setTimeout as sleep } from "node:timers/promises";

import { TimeLruCache, XMemCache } from "@httpx/xcache";
import { createHonoXCache } from "@httpx/xcache/hono";
import { Hono } from "hono";

import {
  type CacheConfig,
  configs,
  type HonoConfig,
  honoConfigs,
  honoScenarioId,
  type Scenario,
  scenarios,
} from "./scenarios.ts";
import type {
  CaseResult,
  EngineInfo,
  EngineResults,
  HonoCaseResult,
  PlatformInfo,
  TimingResult,
} from "./types.ts";

type BunGlobal = {
  version: string;
  gc: (force: boolean) => void;
};

const bun = (globalThis as { Bun?: BunGlobal }).Bun;

/** Time budget per measured operation */
const timeMs = Number(process.env.BENCH_TIME_MS ?? 300);
const minSamples = 5;

const outputDir = new URL("output/", import.meta.url);

const gc = (): void => {
  if (bun !== undefined) {
    bun.gc(true);
    return;
  }
  const { gc: nodeGc } = globalThis as { gc?: () => void };
  if (nodeGc === undefined) {
    throw new Error("Run node with --expose-gc");
  }
  nodeGc();
  nodeGc();
};

const usedMemory = async (): Promise<number> => {
  // external buffers (streams, Uint8Array) are released after finalization
  for (let i = 0; i < 5; i++) {
    gc();
    await sleep(20);
  }
  const { heapUsed, external } = process.memoryUsage();
  return heapUsed + external;
};

const getEngine = (): EngineInfo => {
  if (bun !== undefined) {
    const { webkit } = process.versions as { webkit?: string };
    return {
      id: "bun",
      name: "Bun",
      version: bun.version,
      jsEngine: `JavaScriptCore${webkit === undefined ? "" : ` (WebKit ${webkit.slice(0, 12)})`}`,
    };
  }
  return {
    id: "node",
    name: "Node.js",
    version: process.versions.node,
    jsEngine: `V8 ${process.versions.v8}`,
  };
};

const getPlatform = (): PlatformInfo => {
  let osName = `${os.type()} ${os.release()}`;
  if (process.platform === "darwin") {
    try {
      const version = execSync("sw_vers -productVersion").toString().trim();
      osName = `macOS ${version} (${osName})`;
    } catch {
      // keep the kernel name
    }
  }
  const cpus = os.cpus();
  return {
    os: osName,
    arch: process.arch,
    cpu: cpus[0]?.model.trim() ?? "unknown",
    cores: cpus.length,
    totalMemory: os.totalmem(),
  };
};

const measure = async (fn: () => Promise<unknown>): Promise<TimingResult> => {
  // warmup: 3 calls, 1 for slow operations
  const warmupStart = performance.now();
  await fn();
  if (performance.now() - warmupStart < 50) {
    await fn();
    await fn();
  }
  const samples: number[] = [];
  const end = performance.now() + timeMs;
  while (performance.now() < end || samples.length < minSamples) {
    const start = performance.now();
    await fn();
    samples.push(performance.now() - start);
  }
  samples.sort((a, b) => a - b);
  const sum = samples.reduce((acc, value) => acc + value, 0);
  return {
    median: samples[Math.floor(samples.length / 2)] ?? 0,
    mean: sum / samples.length,
    p99:
      samples[
        Math.min(samples.length - 1, Math.floor(samples.length * 0.99))
      ] ?? 0,
    samples: samples.length,
  };
};

const createCache = (config: CacheConfig, maxSize: number): XMemCache => {
  const compressor = config.createCompressor();
  return new XMemCache({
    lru: new TimeLruCache({ maxSize, defaultTTL: 3_600_000 }),
    ...(compressor === undefined ? {} : { compressor }),
  });
};

/**
 * Memory per entry: growth when adding memoryEntries fresh payloads to a
 * cache holding 2 entries, so fixed costs (serializer buffers grown by the
 * first encodings, lru) are excluded. Median of the runs with a growth (3,
 * 5 on bun: noisier), measured first so that the speed tests caches can't
 * be collected in between. 0 when no run measured a growth.
 */
const measureMemoryPerEntry = async (
  scenario: Scenario,
  config: CacheConfig
): Promise<number> => {
  const entries = scenario.memoryEntries;
  const warmupEntries = 2;
  const fill = async (
    cache: XMemCache,
    from: number,
    count: number
  ): Promise<void> => {
    for (let n = from; n < from + count; n++) {
      await cache.runAsync({
        key: ["memory", n],
        fn: () => Promise.resolve(scenario.createPayload()),
      });
    }
  };
  const runs: number[] = [];
  const runCount = bun === undefined ? 3 : 5;
  for (let run = 0; run < runCount; run++) {
    const cache = createCache(config, entries + warmupEntries);
    await fill(cache, 0, warmupEntries);
    const before = await usedMemory();
    await fill(cache, warmupEntries, entries);
    const after = await usedMemory();
    cache.clear();
    runs.push(Math.max(0, (after - before) / entries));
  }
  runs.sort((x, y) => x - y);
  if (process.env.BENCH_DEBUG !== undefined) {
    console.log(
      `  memory runs ${scenario.id}/${config.id}: ${runs.map((run) => Math.round(run / 1024)).join(", ")} KiB`
    );
  }
  // a run without growth: freed garbage hid the entries
  const grown = runs.filter((run) => run > 0);
  return grown[Math.floor(grown.length / 2)] ?? 0;
};

const runCase = async (
  scenario: Scenario,
  config: CacheConfig
): Promise<CaseResult> => {
  const memoryStart = performance.now();
  const memoryPerEntry = await measureMemoryPerEntry(scenario, config);
  if (process.env.BENCH_DEBUG !== undefined) {
    console.log(`  memory ${Math.round(performance.now() - memoryStart)} ms`);
  }

  const payload = scenario.createPayload();
  const fn = () => Promise.resolve(payload);

  // miss: key generation, serialization, compression and storage
  const missCache = createCache(config, 20);
  let i = 0;
  const miss = await measure(() =>
    missCache.runAsync({ key: ["miss", i++], fn })
  );

  // hit: lookup, decompression and deserialization
  const hitCache = createCache(config, 20);
  const { meta } = await hitCache.runAsync({ key: ["hit"], fn });
  const hit = await measure(() => hitCache.runAsync({ key: ["hit"], fn }));

  const result: CaseResult = {
    scenario: scenario.id,
    config: config.id,
    storedAs: meta.compression === undefined ? "native" : "compressed",
    miss,
    hit,
    memoryPerEntry,
  };
  if (meta.compression !== undefined) {
    result.compressedSize = meta.compression.compressedSize;
  }
  return result;
};

/**
 * createHonoXCache with a JSON response, the response body is read.
 */
const runHonoCase = async (
  scenario: Scenario,
  config: HonoConfig
): Promise<HonoCaseResult> => {
  const payload = scenario.createPayload();
  const app = new Hono();
  let xcache: ReturnType<typeof createHonoXCache> | undefined;
  if (config.createCompressor === undefined) {
    app.get("/data/:id", (c) => c.json(payload));
  } else {
    const honoXCache = createHonoXCache({
      cache: new XMemCache({
        lru: new TimeLruCache({ maxSize: 20, defaultTTL: 3_600_000 }),
        compressor: config.createCompressor(),
      }),
    });
    xcache = honoXCache;
    app.get("/data/:id", (c) =>
      honoXCache.json(c, {
        key: ["/data", c.req.param("id")],
        fn: () => Promise.resolve(payload),
      })
    );
  }
  const request = async (id: string, gzip: boolean): Promise<Response> => {
    const res = await app.request(
      `/data/${id}`,
      gzip ? { headers: { "Accept-Encoding": "gzip" } } : {}
    );
    await res.arrayBuffer();
    return res;
  };

  let i = 0;
  const miss = await measure(() => request(`miss-${i++}`, true));
  await request("hit", true);
  const hit = await request("hit", true);
  const hitGzip = await measure(() => request("hit", true));
  const hitIdentity = await measure(() => request("hit", false));

  const compression = xcache?.getEntryInfo({
    key: ["/data", "hit"],
  })?.compression;
  let storedAs: HonoCaseResult["storedAs"] = "none";
  if (xcache !== undefined) {
    storedAs = compression === undefined ? "native" : "compressed";
  }
  const result: HonoCaseResult = {
    config: config.id,
    storedAs,
    sentAsIs: hit.headers.get("Content-Encoding") === "gzip",
    miss,
    hitGzip,
    hitIdentity,
  };
  if (compression?.content !== undefined) {
    result.content = compression.content;
  }
  return result;
};

const engine = getEngine();
const packageJson = JSON.parse(
  readFileSync(new URL("../../package.json", import.meta.url), "utf8")
) as { version: string };

const results: CaseResult[] = [];
for (const scenario of scenarios) {
  for (const config of configs) {
    if (scenario.extendedTypes && config.nativeTypesOnly) {
      continue;
    }
    const start = performance.now();
    const result = await runCase(scenario, config);
    const elapsed = Math.round(performance.now() - start);
    console.log(
      `[${engine.name}] ${scenario.id} / ${config.label}: miss ${result.miss.median.toFixed(3)} ms, hit ${result.hit.median.toFixed(3)} ms (${elapsed} ms)`
    );
    results.push(result);
  }
}

const honoScenario = scenarios.find(({ id }) => id === honoScenarioId);
if (honoScenario === undefined) {
  throw new Error(`Unknown hono scenario ${honoScenarioId}`);
}
const honoResults: HonoCaseResult[] = [];
for (const config of honoConfigs) {
  const result = await runHonoCase(honoScenario, config);
  console.log(
    `[${engine.name}] hono ${honoScenario.id} / ${config.label}: miss ${result.miss.median.toFixed(3)} ms, hit ${result.hitGzip.median.toFixed(3)} ms (gzip), ${result.hitIdentity.median.toFixed(3)} ms (identity)`
  );
  honoResults.push(result);
}

const output: EngineResults = {
  date: new Date().toISOString(),
  packageVersion: packageJson.version,
  platform: getPlatform(),
  engine,
  scenarios: scenarios.map((scenario) => {
    return {
      id: scenario.id,
      title: scenario.title,
      description: scenario.description,
      rows: scenario.rows,
      // bigint as string for the extended types
      jsonSize: JSON.stringify(
        scenario.createPayload(),
        (_key, value: unknown) =>
          typeof value === "bigint" ? String(value) : value
      ).length,
    };
  }),
  configs: configs.map(({ id, label }) => {
    return { id, label };
  }),
  results,
  hono: {
    scenario: honoScenario.id,
    configs: honoConfigs.map(({ id, label, description }) => {
      return { id, label, description };
    }),
    results: honoResults,
  },
};

mkdirSync(outputDir, { recursive: true });
const file = new URL(`${engine.id}.json`, outputDir);
writeFileSync(file, `${JSON.stringify(output, null, 2)}\n`);
console.log(`Results written to ${file.pathname}`);
