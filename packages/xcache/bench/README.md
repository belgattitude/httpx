## @httpx/xcache

Benchmarks to measure [@httpx/xcache](../README.md) performance.

### Run

```bash
pnpm install
cd packages/xcache
pnpm build
pnpm bench
```

### Report

Cache miss, cache hit and memory per entry for 4 scenarios (small, medium, large and large with extended types), with Node.js and Bun. Writes [report/report.md](./report/report.md), [report/report.json](./report/report.json) and a [medium payload chart](./report/medium.svg) ([TanStack Charts](https://tanstack.com/charts), regenerate it from report.json with `pnpm bench-report-chart`).

```bash
pnpm build
pnpm bench-report
# with a specific node version, node only, or a longer time budget (default 300 ms per measurement)
NODE_BIN=~/.nvm/versions/node/v26.12.0/bin/node pnpm bench-report
BENCH_ENGINES=node pnpm bench-report
BENCH_TIME_MS=1000 pnpm bench-report
```
