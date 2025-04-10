[**@httpx/json-api v0.5.25**](../README.md)

***

[@httpx/json-api](../README.md) / JsonApiError

# Type Alias: JsonApiError

> **JsonApiError** = `object`

## See

https://jsonapi.org/format/#errors

## Properties

### code?

> `optional` **code**: `string`

an application-specific error code, expressed as a string value.

***

### detail?

> `optional` **detail**: `string`

a human-readable explanation specific to this occurrence of the problem. Like title, this field’s value can be localized.

***

### id?

> `optional` **id**: `number` \| `string`

a unique identifier for this particular occurrence of the problem.

***

### meta?

> `optional` **meta**: `Record`\<`string`, `unknown`\>

a meta object containing non-standard meta-information about the error.

***

### parameter?

> `optional` **parameter**: `string`

a string indicating which URI query parameter caused the error.

***

### status?

> `optional` **status**: `number`

the HTTP status code applicable to this problem, expressed as a string value.

***

### title

> **title**: `string`

a short, human-readable summary of the problem that SHOULD NOT change from occurrence to occurrence of the problem, except for purposes of localization.
