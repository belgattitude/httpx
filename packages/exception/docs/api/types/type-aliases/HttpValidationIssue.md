[**@httpx/exception**](../../README.md) • **Docs**

---

[@httpx/exception](../../README.md) / [types](../README.md) / HttpValidationIssue

# Type alias: HttpValidationIssue

> **HttpValidationIssue**: `object`

Related to HttpBadRequest, HttpValidationIssue contains additional validation info.
Slightly inspired from https://jsonapi.org/format/1.2/#error-objects
and zod (path).

## Type declaration

### code?

> `optional` **code**: `string`

An application-specific error code, expressed as a string value.

### message

> **message**: `string`

A short, human-readable summary of the problem

### path

> **path**: (`number` \| `string`)[] \| `string`

Param name or path, ie: 'email' or ['addresses', 0, 'line1']
