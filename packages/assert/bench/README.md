## @httpx/assert benchmarks

Benchmarks to measure [@httpx/assert](../../packages/assert/README.md) performance over
popular libraries.


### Run

```bash
yarn install
cd packages/assert
yarn build
yarn bench
```

### Example

#### isPlainObject

See the [source](./comparative.bench.ts). 

```
 # ubuntu 22.04 - node 22.2.0 - i7-10750H @ 2.60 (12 cores)
 

 RUN  v1.6.0 /home/sebastien/github/httpx/packages/assert

 ✓ bench/comparative.bench.ts (7) 5009ms
   ✓ Compare calling 100x isPlainObject with mixed types values (7) 5006ms
     name                                                                   hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/assert: `isPlainObject(v)`                              760,563.84  0.0012  0.0278  0.0013  0.0013  0.0020  0.0022  0.0023  ±0.05%   380282   fastest
   · is-plain-obj: `isPlainObj(v)`                                  741,253.19  0.0013  0.2608  0.0013  0.0014  0.0014  0.0014  0.0023  ±0.12%   370627
   · @sindresorhus/is: `is.plainObject(v)`                          555,593.76  0.0017  0.0236  0.0018  0.0018  0.0019  0.0019  0.0032  ±0.05%   277797
   · lodash-es: `_.isPlainObject(v)`                                 12,940.86  0.0736  0.3174  0.0773  0.0783  0.0893  0.0984  0.2169  ±0.23%     6471
   · zod: `z.record(z.string(), z.unknown())`                        21,757.31  0.0286  5.2246  0.0460  0.0307  0.1145  1.6446  1.8782  ±6.68%    10879
   · valibot: `z.record(z.string(), z.unknown())`                       110.11  8.8403  9.8349  9.0819  9.1548  9.8349  9.8349  9.8349  ±0.57%       56   slowest
   · typebox: `Type.Record(Type.String(), Type.Unknown()) (check)`      121.96  7.3245  8.7558  8.1995  8.3888  8.7558  8.7558  8.7558  ±0.83%       61


 BENCH  Summary

  @httpx/assert: `isPlainObject(v)` - bench/comparative.bench.ts > Compare calling 100x isPlainObject with mixed types values
    1.03x faster than is-plain-obj: `isPlainObj(v)`
    1.37x faster than @sindresorhus/is: `is.plainObject(v)`
    34.96x faster than zod: `z.record(z.string(), z.unknown())`
    58.77x faster than lodash-es: `_.isPlainObject(v)`
    6236.24x faster than typebox: `Type.Record(Type.String(), Type.Unknown()) (check)`
    6907.38x faster than valibot: `z.record(z.string(), z.unknown())`

```