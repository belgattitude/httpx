// Notice that this test is kept minimal as most of the logic is tested in parseDsn
import { parseDsnOrThrow } from '../parse-dsn-or-throw';

describe('parseDsnOrThrow', () => {
  describe('when provided dsn contains all options', () => {
    it('should return the correct parsed params', () => {
      expect(
        parseDsnOrThrow(
          'redis://username:password@www.example.com:6379/database$-#12_2.1'
        )
      ).toStrictEqual({
        driver: 'redis',
        pass: 'password',
        host: 'www.example.com',
        user: 'username',
        port: 6379,
        db: 'database$-#12_2.1',
      });
    });
  });

  describe('when dsn contains an invalid port', () => {
    it('should throw with the INVALID_PORT reason', () => {
      expect(() => parseDsnOrThrow('pgsql://localhost:12345678')).toThrow(
        new Error("Can't parse dsn: Invalid port: 12345678 (INVALID_PORT)")
      );
    });
  });
});
