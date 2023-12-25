import { describe, expect, it } from 'vitest';

import { HttpServerException } from '../../base';
import { HttpNotFound } from '../../client';
import { createHttpException } from '../../factory';
import { tryOrFail } from '../tryOrFail';

describe('tryOrFail', () => {
  const getFromAsyncPromise = async (params: {
    mode: 'returnCool' | 'throwNotFound' | 'throwError';
  }) => {
    switch (params.mode) {
      case 'throwNotFound':
        throw createHttpException(404);
      case 'throwError':
        throw new Error('Native error without statsuCode');
      case 'returnCool':
        return 'cool';
      default:
    }
    return params.mode;
  };

  it('should work', async () => {
    await expect(
      tryOrFail(() => getFromAsyncPromise({ mode: 'returnCool' }))
    ).resolves.toBe('cool');
  });

  it('should work with mmm', async () => {
    await expect(
      tryOrFail(async () => {
        const response = await getFromAsyncPromise({ mode: 'returnCool' });
        if (response === 'cool') {
          throw new HttpNotFound('User not found');
        }
      }, [HttpNotFound.STATUS, {}])
    ).rejects.toThrow(new HttpNotFound('User not found'));
  });

  it('should work with', async () => {
    const a = tryOrFail(async () => {
      const resp = await getFromAsyncPromise({ mode: 'returnCool' });
      if (resp === 'cool') {
        throw new HttpNotFound('nothing');
      }
      return resp;
    }, [404, { message: 'Not found' }]);
    await expect(a).rejects.toThrow(new HttpNotFound('nothing'));
  });

  it('should throw a 500 if no statusCode', async () => {
    await expect(
      tryOrFail(() => getFromAsyncPromise({ mode: 'throwError' }))
    ).rejects.toThrow(HttpServerException);
  });
});
