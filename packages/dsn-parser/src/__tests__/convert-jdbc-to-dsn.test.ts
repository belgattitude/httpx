import { convertJdbcToDsn } from '../convert-jdbc-to-dsn';
import { parseDsnOrThrow } from '../parse-dsn-or-throw';

describe('convertJdbcToDsn', () => {
  it('should return a dsn string from a valid jdbc string', () => {
    const jdbc =
      'sqlserver://localhost:1433;database=my-db;authentication=default;user=sa;password=pass03$;encrypt=true;trustServerCertificate=true';
    const dsn = convertJdbcToDsn(jdbc);
    expect(dsn).toBe(
      'sqlserver://localhost:1433?database=my-db&authentication=default&user=sa&password=pass03$&encrypt=true&trustServerCertificate=true'
    );
    expect(parseDsnOrThrow(dsn)).toStrictEqual({
      driver: 'sqlserver',
      host: 'localhost',
      params: {
        authentication: 'default',
        database: 'my-db',
        encrypt: true,
        password: 'pass03$',
        trustServerCertificate: true,
        user: 'sa',
      },
      port: 1433,
    });
  });
  it('should return a dsn string from a minimal jdbc dsn', () => {
    const jdbc = 'sqlserver://localhost:1433';
    const dsn = convertJdbcToDsn(jdbc);
    expect(dsn).toBe('sqlserver://localhost:1433');
    expect(parseDsnOrThrow(dsn)).toStrictEqual({
      driver: 'sqlserver',
      host: 'localhost',
      port: 1433,
    });
  });
  it('should throw if the given jdbc is not a string', () => {
    const jdbc = 1234 as unknown as string;
    expect(() => convertJdbcToDsn(jdbc)).toThrow(TypeError);
  });
});
