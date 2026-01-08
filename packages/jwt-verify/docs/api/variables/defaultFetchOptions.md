[**@httpx/jwt-verify v0.1.7**](../README.md)

---

[@httpx/jwt-verify](../README.md) / defaultFetchOptions

# Variable: defaultFetchOptions

> `const` **defaultFetchOptions**: `object`

## Type Declaration

### retry

> `readonly` **retry**: `object`

#### retry.afterStatusCodes

> `readonly` **afterStatusCodes**: \[`413`, `429`, `503`\]

#### retry.delay()

> `readonly` **delay**: (`attemptCount`) => `number`

##### Parameters

###### attemptCount

`number`

##### Returns

`number`

#### retry.limit

> `readonly` **limit**: `3` = `3`

#### retry.maxRetryAfter

> `readonly` **maxRetryAfter**: `number` = `Number.POSITIVE_INFINITY`

#### retry.methods

> `readonly` **methods**: \[`"get"`, `"head"`, `"options"`, `"trace"`\]

#### retry.retryOnTimeout

> `readonly` **retryOnTimeout**: `true` = `true`

#### retry.statusCodes

> `readonly` **statusCodes**: \[`408`, `413`, `429`, `500`, `502`, `503`, `504`\]

### timeoutMs

> `readonly` **timeoutMs**: `30000` = `30_000`
