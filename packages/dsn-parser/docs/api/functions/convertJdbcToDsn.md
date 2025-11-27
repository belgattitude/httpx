[**@httpx/dsn-parser v1.9.4**](../README.md)

***

[@httpx/dsn-parser](../README.md) / convertJdbcToDsn

# Function: convertJdbcToDsn()

> **convertJdbcToDsn**(`jdbc`): `string`

Convert JDBC URL to DSN format.

## Parameters

### jdbc

`string`

## Returns

`string`

## Example

```typescript
const jdbc = 'sqlserver://localhost:1433;database=my-db;authentication=default;user=sa;password=pass03$;encrypt=true;trustServerCertificate=true';
const dsn = convertJdbcToDsn(jdbc);
// dsn is 'sqlserver://localhost:1433?database=my-db&authentication=default&user=sa&password=pass03$&encrypt=true&trustServerCertificate=true
```

## Throws

TypeError .
