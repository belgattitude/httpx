## Upgrade

### From v2.x to v3.x

The param errors have been deprecated since v2.x, issues should be used in place.

- Remove deprecated `errors` param from `HttpBadRequest`, use `issues` in `HttpUnprocessableEntity` instead
- Remove deprecated `errors` params from `HttpUnprocessableEntity`, use `issues` instead

The following types have been removed:

- Remove deprecated type `HttpStatusCode`, use `HttpErrorStatusCode` instead.
- Remove deprecated type `ValidationError`, use `HttpValidationIssue` instead.
