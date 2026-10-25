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

Cache miss, cache hit and memory per entry for 4 scenarios (small, medium, large and large with extended types), with Node.js and Bun. Writes [report/report.md](./report/report.md) and [report/report.json](./report/report.json).

```bash
pnpm build
pnpm bench-report
# with a specific node version, node only, or a shorter time budget
NODE_BIN=~/.nvm/versions/node/v26.12.0/bin/node pnpm bench-report
BENCH_ENGINES=node pnpm bench-report
BENCH_TIME_MS=200 pnpm bench-report
```
