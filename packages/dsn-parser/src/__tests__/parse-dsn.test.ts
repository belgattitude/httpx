import { parseDsn } from '../parse-dsn';

describe('parseDsn', () => {
  describe('when driver is provided with special chars', () => {
    it.each(['redis', 'Driver55', 'driver-4', '44_driver', 'redis+sentinel'])(
      `should return %s`,
      (driver) => {
        expect(parseDsn(`${driver}://localhost`)).toStrictEqual({
          success: true,
          value: {
            driver,
            host: 'localhost',
          },
        });
      }
    );
  });
  describe('when provided dsn contains all options', () => {
    it('should return the correct parsed params', () => {
      expect(
        parseDsn(
          'redis://username:password@www.example.com:6379/database$-#12_2.1'
        )
      ).toStrictEqual({
        success: true,
        value: {
          db: 'database$-#12_2.1',
          driver: 'redis',
          host: 'www.example.com',
          pass: 'password',
          port: 6379,
          user: 'username',
        },
      });
    });
  });
  describe('when provided dsn contains query params', () => {
    it('should return the parsed params and cast bool and numbers', () => {
      const parsed = parseDsn(
        'redis://localhost/0?paramInt=2&paramBool=false&paramStr=hello'
      );
      expect(parsed).toMatchObject({
        success: true,
        value: {
          db: '0',
          driver: 'redis',
          host: 'localhost',
          params: {
            paramBool: false,
            paramInt: 2,
            paramStr: 'hello',
          },
        },
      });
    });
  });
  describe('when provided password contains special characters', () => {
    it('should return the correct parsed params', () => {
      expect(
        parseDsn(
          'redis://us_er na-?me:P @-_:?/ssw/rd@www.example.com:6379/0?cache=true'
        )
      ).toStrictEqual({
        success: true,
        value: {
          db: '0',
          driver: 'redis',
          host: 'www.example.com',
          params: {
            cache: true,
          },
          pass: 'P @-_:?/ssw/rd',
          port: 6379,
          user: 'us_er na-?me',
        },
      });
    });
  });
  describe('when a dsn is provided with missing user', () => {
    it('should return the correct parsed params', () => {
      expect(
        parseDsn('redis://:password@www.example.com:6379/0')
      ).toStrictEqual({
        success: true,
        value: {
          db: '0',
          driver: 'redis',
          host: 'www.example.com',
          pass: 'password',
          port: 6379,
        },
      });
    });
  });
  describe('when a dsn is provided with no password', () => {
    it('should return the correct parsed params', () => {
      expect(parseDsn('redis://user@www.example.com:6379/0')).toStrictEqual({
        success: true,
        value: {
          db: '0',
          driver: 'redis',
          host: 'www.example.com',
          port: 6379,
          user: 'user',
        },
      });
    });
  });
  describe('when a dsn is provided with empty password', () => {
    it('should return the correct parsed params', () => {
      expect(parseDsn('redis://user:@www.example.com:6379/0')).toStrictEqual({
        success: true,
        value: {
          db: '0',
          driver: 'redis',
          host: 'www.example.com',
          pass: '',
          port: 6379,
          user: 'user',
        },
      });
    });
    it('should work with prisma', () => {
      const dsn = 'postgresql://postgres:@localhost:5432/prisma-db';
      expect(parseDsn(dsn)).toStrictEqual({
        success: true,
        value: {
          db: 'prisma-db',
          driver: 'postgresql',
          host: 'localhost',
          pass: '',
          port: 5432,
          user: 'postgres',
        },
      });
    });
  });
  describe('when a dsn is provided with no user/pass', () => {
    it('should return the correct parsed params', () => {
      const dsn = 'redis://www.example.com:6379/0';
      expect(parseDsn(dsn)).toStrictEqual({
        success: true,
        value: {
          db: '0',
          driver: 'redis',
          host: 'www.example.com',
          port: 6379,
        },
      });
    });
  });
  describe('when a dsn is provided with host only', () => {
    it('should return the correct parsed params', () => {
      const dsn = 'redis://localhost';
      expect(parseDsn(dsn)).toStrictEqual({
        success: true,
        value: {
          driver: 'redis',
          host: 'localhost',
        },
      });
    });
  });
  describe('when a dsn is provided with host and port only', () => {
    it('should return the correct parsed params', () => {
      const dsn = 'redis://localhost:6379';
      expect(parseDsn(dsn)).toStrictEqual({
        success: true,
        value: {
          driver: 'redis',
          host: 'localhost',
          port: 6379,
        },
      });
    });
  });
  describe('when a dsn is provided with host, port and db only', () => {
    it('should return the correct parsed params', () => {
      const dsn = 'redis://localhost:6379/0';
      expect(parseDsn(dsn)).toStrictEqual({
        success: true,
        value: {
          db: '0',
          driver: 'redis',
          host: 'localhost',
          port: 6379,
        },
      });
    });
  });
  describe('when lowerCaseDriver option is provided', () => {
    it('should lowercase the driver if lowercaseDriver is true', () => {
      const dsn = 'PGSQL://localhost';
      expect(parseDsn(dsn, { lowercaseDriver: true })).toStrictEqual({
        success: true,
        value: {
          driver: 'pgsql',
          host: 'localhost',
        },
      });
    });
    it('should not lowercase the driver if lowercaseDriver is false', () => {
      const dsn = 'PGSQL://localhost';
      expect(parseDsn(dsn, { lowercaseDriver: false })).toStrictEqual({
        success: true,
        value: {
          driver: 'PGSQL',
          host: 'localhost',
        },
      });
    });
    it('should not lowercase the driver if option not provided', () => {
      const dsn = 'PGSQL://localhost';
      expect(parseDsn(dsn, {})).toStrictEqual({
        success: true,
        value: {
          driver: 'PGSQL',
          host: 'localhost',
        },
      });
    });
  });

  describe('when overrides option is provided', () => {
    it('should replace parsed values', () => {
      const dsn = 'redis://username:password@www.example.com:6379/0';
      const overrides = {
        db: '2',
        driver: 'mysql',
        host: 'localhost',
        pass: 'pass',
        port: 3306,
        user: 'user',
      };
      expect(parseDsn(dsn, { overrides: overrides })).toStrictEqual({
        success: true,
        value: overrides,
      });
    });
    it('should not allow to clear undefined', () => {
      const dsn = 'redis://username:password@localhost';
      const overrides = {
        pass: undefined,
        user: 'replaced',
      };
      // @ts-expect-error it shouldn't accept undefined as a password
      expect(parseDsn(dsn, { overrides })).toStrictEqual({
        success: true,
        value: {
          driver: 'redis',
          host: 'localhost',
          user: 'replaced',
        },
      });
    });
    it('should set overrides as {} if undefined', () => {
      const dsn = 'redis://localhost';
      // @ts-expect-error shouldn't accept overrides as undefined
      expect(parseDsn(dsn, { overrides: undefined })).toStrictEqual({
        success: true,
        value: {
          driver: 'redis',
          host: 'localhost',
        },
      });
    });
  });

  // ########################################################
  // Errors
  // ########################################################
  describe('when a dsn lacks hostname', () => {
    it('should return a PARSE_ERROR', () => {
      expect(parseDsn('redis://')).toStrictEqual({
        message: 'Cannot parse DSN',
        reason: 'PARSE_ERROR',
        success: false,
      });
    });
  });
  describe('when a dsn is not parsable', () => {
    it('should return a PARSE_ERROR', () => {
      expect(parseDsn('redis:///0')).toStrictEqual({
        message: 'Cannot parse DSN',
        reason: 'PARSE_ERROR',
        success: false,
      });
    });
  });
  describe('when a dsn is empty', () => {
    it('should return an EMPTY_DSN reason', () => {
      expect(parseDsn('  ')).toStrictEqual({
        message: 'DSN cannot be empty',
        reason: 'EMPTY_DSN',
        success: false,
      });
    });
  });
  describe('when a dsn is not the right type', () => {
    it('should return an EMPTY_DSN reason', () => {
      expect(parseDsn([] as unknown as string)).toStrictEqual({
        message: 'DSN must be a string',
        reason: 'INVALID_ARGUMENT',
        success: false,
      });
    });
  });
  describe('when port is not a valid one', () => {
    it('should return an INVALID_PORT reason', () => {
      expect(parseDsn('pgsql://localhost:12345678')).toStrictEqual({
        message: 'Invalid port: 12345678',
        reason: 'INVALID_PORT',
        success: false,
      });
    });
  });
});
