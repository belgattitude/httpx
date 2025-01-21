## @httpx/plain-object benchmarks

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
 RUN  v2.0.5 /home/sebastien/github/httpx/packages/plain-object

 ✓ bench/comparative.bench.ts (6) 4778ms
   ✓ Compare calling isPlainObject with 100x mixed types values (6) 4779ms
     name                                                           hz     min      max    mean     p75     p99    p995    p999     rme  samples
   · @httpx/plain-object: `isPlainObject(v)`              1,494,047.57  0.0005   8.3748  0.0007  0.0007  0.0008  0.0009  0.0047  ±3.40%   747024   fastest
   · (sindresorhus/)is-plain-obj: `isPlainObj(v)`         1,314,933.16  0.0005  11.7854  0.0008  0.0007  0.0014  0.0015  0.0022  ±6.83%   657467
   · @sindresorhus/is: `is.plainObject(v)`                  934,442.37  0.0009   2.1268  0.0011  0.0011  0.0015  0.0018  0.0065  ±1.38%   467222
   · estoolkit:  `isPlainObject(v)`                         378,403.92  0.0020  10.3395  0.0026  0.0026  0.0035  0.0055  0.0155  ±4.23%   189202
   · (jonschlinkert/)is-plain-object: `isPlainObject(v)`    629,387.99  0.0012  13.2170  0.0016  0.0015  0.0023  0.0030  0.0129  ±6.81%   314694
   · lodash-es: `_.isPlainObject(v)`                         21,164.79  0.0361  11.2577  0.0472  0.0446  0.1057  0.1678  0.5020  ±5.03%    10583   slowest


 BENCH  Summary

  @httpx/plain-object: `isPlainObject(v)` - bench/comparative.bench.ts > Compare calling isPlainObject with 100x mixed types values
    1.14x faster than (sindresorhus/)is-plain-obj: `isPlainObj(v)`
    1.60x faster than @sindresorhus/is: `is.plainObject(v)`
    2.37x faster than (jonschlinkert/)is-plain-object: `isPlainObject(v)`
    3.95x faster than estoolkit:  `isPlainObject(v)`
    70.59x faster than lodash-es: `_.isPlainObject(v)`

```