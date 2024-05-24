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
RUN  v1.6.0 /home/sebastien/github/httpx/packages/assert

 ✓ bench/comparative.bench.ts (4) 3144ms
   ✓ isPlainObject (4) 3142ms
     name                                           hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/assert: `isPlainObject(v)`      714,543.46  0.0014  0.2664  0.0014  0.0014  0.0014  0.0015  0.0024  ±0.11%   357272   fastest
   · is-plain-obj: `isPlainObj(v)`          656,190.24  0.0014  0.0359  0.0015  0.0015  0.0027  0.0033  0.0066  ±0.09%   328096
   · @sindresorhus/is: `is.plainObject(v)`  516,388.64  0.0018  0.0246  0.0019  0.0020  0.0021  0.0022  0.0033  ±0.04%   258195
   · lodash-es: `_.isPlainObject(v)`         11,986.22  0.0799  0.3059  0.0834  0.0833  0.0930  0.0966  0.2284  ±0.20%     5994   slowest


 BENCH  Summary

  @httpx/assert: `isPlainObject(v)` - bench/comparative.bench.ts > isPlainObject
    1.09x faster than is-plain-obj: `isPlainObj(v)`
    1.38x faster than @sindresorhus/is: `is.plainObject(v)`
    59.61x faster than lodash-es: `_.isPlainObject(v)` 
```