[**@httpx/jwt-verify v0.1.7**](../README.md)

---

[@httpx/jwt-verify](../README.md) / FetchOptions

# Type Alias: FetchOptions

> **FetchOptions** = `object`

## Properties

### retry

> **retry**: `object`

#### afterStatusCodes?

> `optional` **afterStatusCodes**: `number`[]

The HTTP status codes allowed to retry with a `Retry-After` header.

##### Default

```ts
[413, 429, 503];
```

#### backoffLimit?

> `optional` **backoffLimit**: `number`

The upper limit of the delay per retry in milliseconds.
To clamp the delay, set `backoffLimit` to 1000, for example.

##### Default

```ts
undefined;
```

#### delay()?

> `optional` **delay**: (`attemptCount`) => `number`

A function to calculate the delay between retries given `attemptCount` (starts from 1).

##### Parameters

###### attemptCount

`number`

##### Returns

`number`

##### Default

```ts
(attemptCount) => 0.3 * 2 ** (attemptCount - 1) * 1000;
```

#### limit?

> `optional` **limit**: `number`

The number of times to retry failed requests.

##### Default

```ts
3;
```

#### maxRetryAfter?

> `optional` **maxRetryAfter**: `number`

If the `Retry-After` header is greater than `maxRetryAfter`, the request will be canceled.

##### Default

```ts
Number.POSITIVE_INFINITY;
```

#### methods?

> `optional` **methods**: `FetcherRelatedHttpMethod`[]

The HTTP methods allowed to retry.

##### Default

```ts
["get", "head", "options", "trace"];
```

#### retryOnTimeout?

> `optional` **retryOnTimeout**: `boolean`

Whether to retry when the request times out.

##### Default

```ts
true;
```

#### statusCodes?

> `optional` **statusCodes**: `number`[]

The HTTP status codes allowed to retry.

##### Default

```ts
[408, 413, 429, 500, 502, 503, 504];
```

---

### timeoutMs

> **timeoutMs**: `number` \| `false`

Timeout in seconds for each request.

#### Default

```ts
30_000 (30 seconds)
```
