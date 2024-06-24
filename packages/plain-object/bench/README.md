## @httpx/assert benchmarks

Benchmarks to measure [@httpx/plain-object](../README.md) performance over
popular libraries.

### Run

```bash
yarn install
cd packages/plain-object
yarn build
yarn bench
```

### Example

#### isPlainObject

See the [source](./comparative.bench.ts). 

```
 RUN  v1.6.0 /home/sebastien/github/httpx/packages/plain-object

 ✓ bench/comparative.bench.ts (5) 3753ms
   ✓ Compare calling isPlainObject with 100x mixed types values (5) 3751ms
     name                                                         hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/plain-object: `isPlainObject(v)`              557,521.22  0.0017  0.0289  0.0018  0.0018  0.0021  0.0026  0.0028  ±0.05%   278761   fastest
   · (sindresorhus)/is-plain-obj: `isPlainObj(v)`         532,060.44  0.0017  0.2708  0.0019  0.0019  0.0024  0.0026  0.0027  ±0.13%   266031
   · @sindresorhus/is: `is.plainObject(v)`                438,130.98  0.0021  0.0200  0.0023  0.0023  0.0024  0.0037  0.0044  ±0.06%   219066
   · (jonschlinkert)/is-plain-object: `isPlainObject(v)`  419,321.37  0.0022  0.1585  0.0024  0.0024  0.0027  0.0029  0.0046  ±0.18%   209661
   · lodash-es: `_.isPlainObject(v)`                       11,874.49  0.0785  0.4330  0.0842  0.0841  0.1018  0.1432  0.2800  ±0.33%     5938   slowest


 BENCH  Summary

  @httpx/plain-object: `isPlainObject(v)` - bench/comparative.bench.ts > Compare calling isPlainObject with 100x mixed types values
    1.05x faster than (sindresorhus)/is-plain-obj: `isPlainObj(v)`
    1.27x faster than @sindresorhus/is: `is.plainObject(v)`
    1.33x faster than (jonschlinkert)/is-plain-object: `isPlainObject(v)`
    46.95x faster than lodash-es: `_.isPlainObject(v)`
```