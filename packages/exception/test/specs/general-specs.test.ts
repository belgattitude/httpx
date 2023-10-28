import statuses from 'statuses';
import { HttpClientException, HttpException } from '../../src/base';
import { HttpNotFound, HttpUnprocessableEntity } from '../../src/client';
import { createHttpException } from '../../src/factory';

import { statusMap } from '../../src/status';
import type { HttpExceptionParamsWithIssues } from '../../src/types/HttpExceptionParamsWithIssues';

describe('Common specs', () => {
  describe('compare with npm:statuses package', () => {
    const all: [
      className: string,
      status: number,
      npmStatusMsg: string,
      exception: HttpException,
    ][] = Object.entries(statusMap).map(([code]) => {
      const exception = createHttpException(Number.parseInt(code, 10));
      const status = Number.parseInt(code, 10);
      const npmStatusesMsg = statuses(status).toString();
      return [exception?.name ?? '', status, npmStatusesMsg, exception];
    });

    describe('class names matches with npm/statuses', () => {
      it.each(all)(
        '%s(%i) match statuses "%s"',
        (className, status, npmStatusMsg) => {
          const title = npmStatusMsg.replace(/[\W_]+/g, '').toLowerCase();
          // eslint-disable-next-line jest/no-conditional-in-test
          const expected = title.startsWith('http') ? title : `http${title}`;
          expect(className.toLowerCase()).toStrictEqual(expected);
        }
      );
    });

    describe('default messages', () => {
      it.each(all)(
        'should match official npm/statuses messages',
        (className, status, npmStatusMsg, exception) => {
          const expected = npmStatusMsg.replace(/[\W_]+/g, '').toLowerCase();
          expect(
            exception?.message.toLowerCase().replace(/[\W_]+/g, '')
          ).toStrictEqual(expected);
        }
      );
    });
  });

  describe('Inheritance', () => {
    it('should properly inform Object.prototype.name', () => {
      const err = new HttpNotFound();
      expect(err.name).toStrictEqual('HttpNotFound');
    });
    it('should properly get the default message', () => {
      const err = new HttpNotFound();
      expect(err.message).toStrictEqual('Not found');
    });
    it('should be properly respect inheritance', () => {
      const err = new HttpNotFound();
      expect(err.name).toStrictEqual('HttpNotFound');
      expect(err).toBeInstanceOf(HttpNotFound);
      expect(err).toBeInstanceOf(HttpException);
      expect(err).toBeInstanceOf(HttpClientException);
    });
  });

  describe('createHttpException', () => {
    it('should support HttpUnprocessableEntity with issues', () => {
      const e422Params: HttpExceptionParamsWithIssues = {
        message: 'Validation failed',
        issues: [
          {
            message: 'Invalid address',
            path: ['addresses', 0, 'line1'],
            code: 'empty_string',
          },
        ],
      };
      expect(createHttpException(422, e422Params)).toStrictEqual(
        new HttpUnprocessableEntity(e422Params)
      );
    });
  });
});
