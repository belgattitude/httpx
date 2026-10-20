---
"@httpx/exception": minor
---

Lighter bundles and faster construction.

The class hierarchy has been reworked: the `HttpException` constructor now does all the work once (default message, params, brand), concrete exceptions are reduced to their status and name. Constructing an exception doesn't allocate a throwaway `Error` anymore to detect `cause` support.

| Import (webpack, brotli) |  4.0.0 |  4.1.0 |    Δ |
| ------------------------ | -----: | -----: | ---: |
| `HttpNotFound`           |  644 B |  516 B | -20% |
| `HttpException`          |  572 B |  470 B | -18% |
| `isHttpException`        |  606 B |  508 B | -16% |
| `createHttpException`    | 1697 B | 1167 B | -31% |
| everything               | 2217 B | 1773 B | -20% |
| `toJson`                 | 1171 B | 1037 B | -11% |
| `fromJson`               | 2261 B | 1673 B | -26% |
| `tryOrFail`              | 1824 B | 1286 B | -29% |

- `toJson` / `convertToSerializable` don't bundle `HttpUnprocessableEntity` anymore.
- Tree-shaking of unused exception classes is now checked on CI for rolldown (vite, tsdown...) and webpack.

**Behavior changes**

- `cause` is now set through the native `Error` option: like with native errors it is not an enumerable own property anymore (ie: absent from `Object.keys()` and spreads), the same applies to `SerializerError`.
- Exception instances don't have an own `cause: undefined` property anymore when no cause is given.
