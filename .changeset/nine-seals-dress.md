---
'@httpx/dsn-parser': minor
---

Add convertJdbcToDsn utility function

Helps to convert [jdbc](https://learn.microsoft.com/en-us/sql/connect/jdbc/building-the-connection-url?view=sql-server-ver15) dsn.
Useful for prisma using [sqlserver](https://www.prisma.io/docs/concepts/database-connectors/sql-server#connection-details).

```typescript
import { convertJdbcToDsn } from '@httpx/dsn-parser';

const jdbcDsn =
    'sqlserver://localhost:1433;database=my-db;authentication=default;user=sa;password=pass03$;encrypt=true;trustServerCertificate=true';

const dsn = convertJdbcToDsn(jdbc);

// -> 'sqlserver://localhost:1433?database=my-db&authentication=default&user=sa&password=pass03$&encrypt=true&trustServerCertificate=true'
```
