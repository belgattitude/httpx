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

 ✓ bench/comparative.bench.ts (7) 5032ms
   ✓ Compare calling 100x isPlainObject with mixed types values (7) 5030ms
     name                                                                   hz     min      max    mean     p75      p99     p995     p999     rme  samples
   · @httpx/assert: `isPlainObject(v)`                              787,774.77  0.0012   0.2929  0.0013  0.0013   0.0023   0.0024   0.0024  ±0.12%   393888   fastest
   · is-plain-obj: `isPlainObj(v)`                                  742,186.31  0.0012   0.0345  0.0013  0.0013   0.0024   0.0025   0.0028  ±0.06%   371094
   · @sindresorhus/is: `is.plainObject(v)`                          534,657.89  0.0017   0.3124  0.0019  0.0019   0.0019   0.0029   0.0039  ±0.18%   267329
   · lodash-es: `_.isPlainObject(v)`                                 13,218.06  0.0716   0.3400  0.0757  0.0764   0.0844   0.0889   0.2310  ±0.21%     6610
   · zod: `z.record(z.string(), z.unknown())`                        21,526.27  0.0276   4.7837  0.0465  0.0301   0.1531   1.6194   1.9684  ±6.63%    10772
   · valibot: `z.record(z.string(), z.unknown())`                       107.79  8.9501  14.3298  9.2776  9.1973  14.3298  14.3298  14.3298  ±2.47%       54   slowest
   · typebox: `Type.Record(Type.String(), Type.Unknown()) (check)`      116.52  8.0564  11.9404  8.5820  8.5495  11.9404  11.9404  11.9404  ±2.09%       59


 BENCH  Summary

  @httpx/assert: `isPlainObject(v)` - bench/comparative.bench.ts > Compare calling 100x isPlainObject with mixed types values
    1.06x faster than is-plain-obj: `isPlainObj(v)`
    1.47x faster than @sindresorhus/is: `is.plainObject(v)`
    36.60x faster than zod: `z.record(z.string(), z.unknown())`
    59.60x faster than lodash-es: `_.isPlainObject(v)`
    6760.70x faster than typebox: `Type.Record(Type.String(), Type.Unknown()) (check)`
    7308.70x faster than valibot: `z.record(z.string(), z.unknown())`

```