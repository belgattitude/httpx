/**
 * Convert JDBC URL to DSN format.
 *
 * @example
 * ```typescript
 * const jdbc = 'sqlserver://localhost:1433;database=my-db;authentication=default;user=sa;password=pass03$;encrypt=true;trustServerCertificate=true';
 * const dsn = convertJdbcToDsn(jdbc);
 * // dsn is 'sqlserver://localhost:1433?database=my-db&authentication=default&user=sa&password=pass03$&encrypt=true&trustServerCertificate=true
 * ```
 * @throws TypeError .
 */
export const convertJdbcToDsn = (jdbc: string): string => {
  if (typeof jdbc !== 'string') {
    throw new TypeError('jdbc param must be a string');
  }
  const [part1, ...rest] = jdbc.split(';');
  return [part1, rest ? rest.join('&') : undefined].filter(Boolean).join('?');
};
