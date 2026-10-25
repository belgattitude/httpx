/**
 * Render the medium payload results of bench/report/report.json as an SVG
 * graphic (bench/report/medium.svg) with TanStack Charts.
 *
 * node bench/report/chart.ts
 */
import { readFileSync, writeFileSync } from "node:fs";

import {
  barX,
  createChartScene,
  defineChart,
  renderChartSvg,
  text,
} from "@tanstack/charts";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { scaleOrdinal } from "@tanstack/charts/scales/ordinal";

import { formatBytes, formatTime } from "./format.ts";
import type { EngineInfo, PlatformInfo } from "./types.ts";

type EngineId = EngineInfo["id"];

type Timing = { median: number };

/** Subset of report.json used by the chart */
type Report = {
  platform: PlatformInfo;
  engines: EngineInfo[];
  scenarios: { id: string; title: string; rows: number; jsonSize: number }[];
  configs: { id: string; label: string }[];
  results: {
    scenario: string;
    config: string;
    engines: Partial<
      Record<
        EngineId,
        { missMs: Timing; hitMs: Timing; memoryPerEntryBytes: number }
      >
    >;
  }[];
  hono: {
    scenario: string;
    configs: { id: string; label: string }[];
    results: {
      config: string;
      engines: Partial<Record<EngineId, { hitGzipMs: Timing }>>;
    }[];
  };
};

type BarRow = {
  id: string;
  label: string;
  engine: string;
  value: number;
  text: string;
};

const scenarioId = "medium";

const reportFile = new URL("report.json", import.meta.url);
const outputFile = new URL("medium.svg", import.meta.url);

const report = JSON.parse(readFileSync(reportFile, "utf8")) as Report;
const scenario = report.scenarios.find(({ id }) => id === scenarioId);
if (scenario === undefined) {
  throw new Error(`No "${scenarioId}" scenario in report.json`);
}

const theme = {
  foreground: "#1f2937",
  muted: "#6b7280",
  grid: "#e5e7eb",
  background: "#ffffff",
  palette: ["#16a34a", "#f59e0b"],
};
const engineColors: Record<EngineId, string> = {
  node: "#16a34a",
  bun: "#f59e0b",
};

const panelWidth = 600;
const panelHeight = 380;
const panelTitleHeight = 28;
const headerHeight = 96;

const escapeXml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

/** One bar per setup and engine (ie: "json + gzip · Node.js") */
const createRows = <T>(
  items: { id: string; label: string; engines: Partial<Record<EngineId, T>> }[],
  pick: (result: T) => number,
  format: (value: number) => string
): BarRow[] =>
  items.flatMap((item) =>
    report.engines.flatMap((engine) => {
      const result = item.engines[engine.id];
      if (result === undefined) {
        return [];
      }
      const value = pick(result);
      return [
        {
          id: `${item.id}-${engine.id}`,
          label: `${item.label} · ${engine.name}`,
          engine: engine.name,
          value,
          // 0: not measured (memory on bun)
          text: value > 0 ? format(value) : "n/a",
        },
      ];
    })
  );

/** Horizontal bar chart rendered to an SVG string */
const renderPanel = (
  id: string,
  rows: BarRow[],
  axisLabel: string,
  ariaLabel: string
): string => {
  const definition = defineChart({
    marks: [
      barX(rows, {
        x: "value",
        y: "label",
        color: "engine",
        radius: { end: 3 },
      }),
      text(rows, {
        x: "value",
        y: "label",
        text: "text",
        anchor: "start",
        dx: 4,
        fontSize: 11,
      }),
    ],
    scales: {
      x: {
        scale: scaleLinear,
        nice: true,
        grid: true,
        axis: { label: axisLabel },
      },
      y: { scale: () => scaleBand().padding(0.25) },
    },
    color: {
      scale: () =>
        scaleOrdinal<string, string>()
          .domain(report.engines.map(({ name }) => name))
          .range(report.engines.map((engine) => engineColors[engine.id])),
    },
    // room for the value labels
    margin: { right: 64 },
    theme,
  });
  const scene = createChartScene(definition, {
    width: panelWidth,
    height: panelHeight - panelTitleHeight,
  });
  return renderChartSvg(scene, { ariaLabel, idPrefix: id });
};

const labelOf = (configs: { id: string; label: string }[], id: string) =>
  configs.find((config) => config.id === id)?.label ?? id;

const cacheResults = report.results
  .filter((result) => result.scenario === scenarioId)
  .map((result) => {
    return {
      id: result.config,
      label: labelOf(report.configs, result.config),
      engines: result.engines,
    };
  });
// "No compression" times are a few hundred ns: only shown for memory
const compressedResults = cacheResults.filter(({ id }) => id !== "none");
const honoResults = report.hono.results.map((result) => {
  return {
    id: result.config,
    label: labelOf(report.hono.configs, result.config),
    engines: result.engines,
  };
});

const panels = [
  {
    title: "Cache miss: serialize + compress + store (lower is better)",
    svg: renderPanel(
      "miss",
      createRows(compressedResults, (r) => r.missMs.median, formatTime),
      "Median time (ms)",
      "Cache miss median time per serializer and engine"
    ),
  },
  {
    title: "Cache hit: decompress + deserialize (lower is better)",
    svg: renderPanel(
      "hit",
      createRows(compressedResults, (r) => r.hitMs.median, formatTime),
      "Median time (ms)",
      "Cache hit median time per serializer and engine"
    ),
  },
  {
    title: "Memory per entry (lower is better, indicative on Bun)",
    svg: renderPanel(
      "memory",
      createRows(
        cacheResults,
        (r) => r.memoryPerEntryBytes / 1000,
        (kb) => formatBytes(kb * 1000)
      ),
      "Memory per entry (kB)",
      "Memory per cached entry per serializer and engine"
    ),
  },
  {
    title: "Hono cache hit, gzip client (lower is better)",
    svg: renderPanel(
      "hono",
      createRows(honoResults, (r) => r.hitGzipMs.median, formatTime),
      "Median request time (ms)",
      "Hono cached request median time per setup and engine"
    ),
  },
];

const width = panelWidth * 2;
const height = headerHeight + panelHeight * 2;
const engineSummary = report.engines
  .map((engine) => `${engine.name} ${engine.version}`)
  .join(" vs ");
const { platform } = report;

const legend = report.engines
  .map((engine, index) => {
    const x = 24 + index * 120;
    return `<rect x="${x}" y="72" width="12" height="12" rx="2" fill="${engineColors[engine.id]}"/><text x="${x + 18}" y="82" font-size="12" fill="${theme.foreground}">${escapeXml(engine.name)}</text>`;
  })
  .join("");

const placedPanels = panels
  .map((panel, index) => {
    const x = (index % 2) * panelWidth;
    const y = headerHeight + Math.floor(index / 2) * panelHeight;
    // position the chart svg inside the graphic
    const chart = panel.svg.replace(
      'width="100%" height="100%"',
      `x="${x}" y="${y + panelTitleHeight}" width="${panelWidth}" height="${panelHeight - panelTitleHeight}"`
    );
    return `<text x="${x + 24}" y="${y + 18}" font-size="14" font-weight="600" fill="${theme.foreground}">${escapeXml(panel.title)}</text>${chart}`;
  })
  .join("\n");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="12" style="color:${theme.foreground}">
<rect width="100%" height="100%" fill="${theme.background}"/>
<text x="24" y="34" font-size="20" font-weight="700" fill="${theme.foreground}">${escapeXml(`@httpx/xcache: ${scenario.title.toLowerCase()} (${formatBytes(scenario.jsonSize)} JSON, ${scenario.rows.toLocaleString("en-US")} records)`)}</text>
<text x="24" y="58" font-size="13" fill="${theme.muted}">${escapeXml(`${engineSummary} · ${platform.cpu} · ${platform.os} · gzip compression`)}</text>
${legend}
${placedPanels}
</svg>
`;

writeFileSync(outputFile, svg);
console.log(`Chart written to ${outputFile.pathname}`);
