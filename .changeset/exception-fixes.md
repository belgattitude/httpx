---
"@httpx/exception": patch
---

Fix subclassing, `URIError` deserialization and `HttpUnprocessableEntity` string messages.

- Extending an exception in userland now keeps the subclass prototype (methods and `instanceof` were lost):

  ```typescript
  class MyNotFound extends HttpNotFound {
    hint() {
      return "check the url";
    }
  }
  const e = new MyNotFound();
  e instanceof MyNotFound; // 👉 true (was false)
  e.hint(); // 👉 "check the url" (was a TypeError)
  ```

- `fromJson(toJson(new URIError()))` now returns a `URIError` (was a plain `Error`).
- `new HttpUnprocessableEntity("Invalid form")` now keeps the message (was replaced by the default "Unprocessable entity").
