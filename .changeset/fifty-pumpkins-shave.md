---
"@httpx/plain-object": patch
---

Update comparative benchmarks with latest versions.

```
RUN  v2.1.8

 ✓ bench/comparative.bench.ts (7) 5774ms
   ✓ Compare calling isPlainObject with 110x mixed types values (7) 5773ms
     name                                                       hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · "@httpx/plain-object": `isPlainObject(v)`        1,395,419.02  0.0006  1.8273  0.0007  0.0007  0.0012  0.0013  0.0022  ±1.01%   697710   fastest
   · "is-plain-obj":"4.1.0": 'isPlainObj(v)'          1,308,696.50  0.0006  1.0286  0.0008  0.0007  0.0013  0.0013  0.0022  ±0.71%   654349
   · "@sindresorhus/is":"7.0.1": 'is.plainObject(v)'    780,257.18  0.0011  0.9150  0.0013  0.0012  0.0024  0.0025  0.0073  ±0.56%   390129
   · "es-toolkit":"1.31.0": 'isPlainObject(v)'        1,077,076.98  0.0007  2.5125  0.0009  0.0008  0.0016  0.0017  0.0118  ±1.46%   538539
   · "redux":"5.0.1": 'isPlainObject(v)'                473,750.80  0.0017  0.9967  0.0021  0.0019  0.0034  0.0038  0.0197  ±0.70%   236878
   · "is-plain-object":"5.0.0": 'isPlainObject(v)'      569,808.67  0.0014  2.0280  0.0018  0.0016  0.0031  0.0033  0.0199  ±1.25%   284905
   · lodash-es:"4.17.21": '_.isPlainObject(v)'           19,551.73  0.0452  1.2833  0.0511  0.0473  0.1073  0.1498  0.3331  ±0.96%     9776   slowest

 BENCH  Summary

  "@httpx/plain-object": `isPlainObject(v)` - bench/comparative.bench.ts > Compare calling isPlainObject with 110x mixed types values
    1.07x faster than "is-plain-obj":"4.1.0": 'isPlainObj(v)'
    1.30x faster than "es-toolkit":"1.31.0": 'isPlainObject(v)'
    1.79x faster than "@sindresorhus/is":"7.0.1": 'is.plainObject(v)'
    2.45x faster than "is-plain-object":"5.0.0": 'isPlainObject(v)'
    2.95x faster than "redux":"5.0.1": 'isPlainObject(v)'
    71.37x faster than lodash-es:"4.17.21": '_.isPlainObject(v)'
```