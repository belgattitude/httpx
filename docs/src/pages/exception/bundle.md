## About bundle

### Compatibility

Node 18+ and es2022 compatibility is ensured on the CI.

Browser builds follows the [.browserslistrc](https://github.com/belgattitude/httpx/blob/main/packages/exception/.browserslistrc)
configuration. From the browserslist defaults:
[Chrome 96+, Firefox 90+, Edge 91+, Safari 15+ and Opera 77+](https://browserslist.dev/?q=ZGVmYXVsdHMsY2hyb21lID49IDk2LGZpcmVmb3ggPj0gOTAsZWRnZSA%2BPSA5MSxzYWZhcmkgPj0gMTUsaW9zID49IDE1LG9wZXJhID49IDc3)
are set as minimal supported versions.

For *older* browsers:

- Most frontend frameworks can transpile the library (ie: [nextjs](https://nextjs.org/docs/app/api-reference/next-config-js/transpilePackages)...)
- You might want to add the [error-cause-polyfill](https://github.com/ehmicky/error-cause-polyfill) to support
  nested errors (if not present they are simply discarded - no runtime errors).


### Size

Code and bundler have been tuned to target a minimal compressed footprint
for the browser. In typical usage the bundle size will vary between 450b to 750b compressed
(including default messages for the 43 status codes).

ESM individual imports are tracked by a
[size-limit configuration](../.size-limit.cjshttps://github.com/belgattitude/httpx/blob/main/packages/dsn-parser/.size-limit.cjs).


| Scenario                                         | Size (compressed) |
|--------------------------------------------------|------------------:|
| Import generic exception (`HttpClientException`) |            ~ 370b |
| Import one exception (`HttpNotFound`)            |            ~ 400b |
| Import two exceptions                            |            ~ 415b |
| Import six exceptions                            |            ~ 430b |
| Import `createHttpException` (all 43 exceptions) |            ~ 690b |
| Import `fromJson` (incl createHttpException)     |           ~ 1100b |
| All exceptions + typeguards + serializer         |           ~ 1500b |

> For CJS usage (not recommended) track the size on [bundlephobia](https://bundlephobia.com/package/@httpx/exception@latest). 

### Packaging

This library offers a dual cjs/esm bundle. The (optionial) serializer code has been tuned to
avoid issues with [dual package hazards](https://nodejs.org/api/packages.html#dual-package-hazard). 

The export fields and the builds are checked on the CI with [are-the-types-wrong](https://arethetypeswrong.github.io/).

> PS: Plans to remove cjs support might land in a next major version.


### Typescript

This library targets typescript 5+ with descriptions (see
[the generated api docs](https://github.com/belgattitude/httpx/tree/main/packages/exception/docs/api)). 
