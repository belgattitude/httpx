---
'@httpx/exception': minor
---

Support ValidationError in HttpBadRequest

In some circumstances you might find useful to append the validation errors to
`HttpBadRequest`. Here's a quick example:

```typescript
const e400 = new HttpBadRequest({
  errors: [
      {
          message: 'Invalid email',
          path: 'email',
          code: 'invalid_email',
      },
      {
          message: 'Invalid address',
          path: ['addresses', 0, 'line1'],
          code: 'empty_string',
      },
  ]
});
console.log(e400.errors)
```

