---
'@httpx/exception': minor
---

Reduce bundle size by using class names rather than strings

Importing all exceptions (excluding utilities, typeguards...) now top at 1Kb 

Example based on ESM (min+gzip)

| Scenario                    | Size   | 
|-----------------------------|--------|
| one exception               | ~ 450b |
| all exceptions              | < 1kb  |
| everything (typeguards,...) | 1.7kb  |


