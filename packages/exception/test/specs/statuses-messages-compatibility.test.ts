import { describe, expect, it } from 'vitest';

import type { HttpException } from '../../src/base';
import { createHttpException } from '../../src/factory/createHttpException';
import { statusMap } from '../../src/status';

const isCloudflareWorker = 'caches' in globalThis;

describe.skipIf(isCloudflareWorker)(
  'statuses messages compatibility',
  async () => {
    const statuses = await import('statuses')
      .then((mod) => mod.default)
      .catch((reason) => {
        if (isCloudflareWorker) {
          return (_v: unknown) => {
            return 'we allow this, due to current cloudflare vitest v4 integration issues';
          };
        }
        throw new Error(`Cannot load npm:statuses package: ${reason}`);
      });

    describe('ensure default messages are compatible with npm:statuses package', () => {
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
            const title = npmStatusMsg.replaceAll(/[\W_]+/g, '').toLowerCase();
            // eslint-disable-next-line @vitest/no-conditional-in-test
            const expected = title.startsWith('http') ? title : `http${title}`;
            expect(className.toLowerCase()).toStrictEqual(expected);
          }
        );
      });

      describe('default messages', () => {
        it.each(all)(
          'should match official npm/statuses messages',
          (className, status, npmStatusMsg, exception) => {
            const expected = npmStatusMsg
              .replaceAll(/[\W_]+/g, '')
              .toLowerCase();
            expect(
              exception?.message.toLowerCase().replaceAll(/[\W_]+/g, '')
            ).toStrictEqual(expected);
          }
        );
      });
    });
  }
);
