## Upgrade

### From v2.x to v3.x

The param `HttpUnprocesssableEntity.errors` have been deprecated since v2.x, `issues` should be used in place.

- Remove deprecated `errors` param from `HttpBadRequest`, use `issues` in `HttpUnprocessableEntity` instead
- Remove deprecated `errors` params from `HttpUnprocessableEntity`, use `issues` instead

The following types have been removed:

- Remove deprecated type `HttpStatusCode`, use `HttpErrorStatusCode` instead.
- Remove deprecated type `ValidationError`, use `HttpValidationIssue` instead.

#### Serializer

For security reasons [stack traces](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/stack)
won't be serialized anymore by default as they might contain sensitive information in production. To opt-in selectively
for stack traces serialization (ie: development or logging)
`convertToSerializable`, `createFromSerializable`, `toJson` and `fromJson` functions
accepts a `SerializerParams.includeStack` param as second argument.

<details>
<summary>Example to opt-in back for stack traces serialization.</summary>

```typescript
import { fromJson, toJson } from "@httpx/exception/serializer";

// To include stack traces (not safe in production)
const jsonWithStack = toJson(new HttpException(500), {
  includeStack: process.env.NODE_ENV === "development",
});

const eWithStrack = fromJson(json, {
  includeStack: process.env.NODE_ENV === "development",
});
```

</details>

### From v1.x to v2.x

Minimum node version is 18.x
