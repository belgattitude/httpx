---
'@httpx/exception': minor
---

Deprecate ValidationError type in favour of HttpValidationIssue

```typescript

// @deprecated errors
// const errors: ValidationError[] = [

// becomes
const issues: HttpValidationIssue[] = [
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
];


const e422 = new HttpUnprocessableEntity({
  // @deprecated name  
  // errors: errors,
    
  // becomes issues  
  issues: [],
});
```