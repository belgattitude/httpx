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

 ✓ bench/comparative.bench.ts (7) 5260ms
   ✓ Compare calling 100x isPlainObject with mixed types values (7) 5259ms
     name                                                                     hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/assert: `isPlainObject(v)`                              1,624,732.52  0.0005  3.0035  0.0006  0.0006  0.0008  0.0010  0.0020  ±2.20%   812367   fastest
   · is-plain-obj: `isPlainObj(v)`                                  1,568,464.19  0.0005  2.8099  0.0006  0.0006  0.0011  0.0013  0.0018  ±1.27%   784233
   · @sindresorhus/is: `is.plainObject(v)`                            989,109.67  0.0009  5.6676  0.0010  0.0010  0.0013  0.0016  0.0064  ±2.34%   494555
   · lodash-es: `_.isPlainObject(v)`                                   23,484.30  0.0354  8.6922  0.0426  0.0423  0.0985  0.1348  0.2692  ±3.61%    11743
   · zod: `z.record(z.string(), z.unknown())`                          13,001.98  0.0431  6.6726  0.0769  0.0506  1.2964  2.4250  3.3169  ±8.02%     6501   slowest
   · valibot: `z.record(z.string(), z.unknown())`                     215,860.26  0.0028  6.5643  0.0046  0.0043  0.0144  0.0254  0.1483  ±2.91%   107931
   · typebox: `Type.Record(Type.String(), Type.Unknown()) (check)`     64,709.99  0.0128  2.1646  0.0155  0.0142  0.0363  0.0626  0.2112  ±1.34%    32355


 BENCH  Summary

  @httpx/assert: `isPlainObject(v)` - bench/comparative.bench.ts > Compare calling 100x isPlainObject with mixed types values
    1.04x faster than is-plain-obj: `isPlainObj(v)`
    1.64x faster than @sindresorhus/is: `is.plainObject(v)`
    7.53x faster than valibot: `z.record(z.string(), z.unknown())`
    25.11x faster than typebox: `Type.Record(Type.String(), Type.Unknown()) (check)`
    69.18x faster than lodash-es: `_.isPlainObject(v)`
    124.96x faster than zod: `z.record(z.string(), z.unknown())`


 
```