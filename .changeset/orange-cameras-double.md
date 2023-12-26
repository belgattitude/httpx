---
"@httpx/exception": minor
---

Add new types: HttpErrorStatusCode and HttpErrorStatusCodeOrNumber

Improves the typescript experience by allowing typescript to suggest assigned 
status codes in `createException` and `HttpException`, `HttpClientException`,
`HttpServerException` constructors. Arbitray numbers can still be used.