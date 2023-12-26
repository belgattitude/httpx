---
"@httpx/exception": minor
---

Deprecate the type HttpStatusCode, use HttpErrorStatusCode instead

HttpErrorStatusCode is less ambiguous ad HttpStatusCode could be understood
as HttpStatusCode could represent all http statuses. The type is exported 
but there's very few chances an regular user would be impacted.