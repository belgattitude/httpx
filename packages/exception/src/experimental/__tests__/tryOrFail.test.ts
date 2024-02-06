import { describe, expect, it } from 'vitest';

import { HttpNotFound } from '../../client';
import { createHttpException } from '../../factory/createHttpException';
import { HttpInternalServerError } from '../../server';
import { tryOrFail } from '../tryOrFail';

describe('tryOrFail', () => {
  const getFromAsyncPromise = async (params: {
    mode: 'returnCool' | 'throwNotFound' | 'throwError';
  }) => {
    switch (params.mode) {
      case 'throwNotFound':
        throw createHttpException(404);
      case 'throwError':
        throw new Error('Native error without statusCode');
      case 'returnCool':
        return 'cool';
      default:
    }
    return params.mode;
  };

  describe('when the promise does resolve successfully', () => {
    it('should return the resolved value', async () => {
      await expect(
        tryOrFail(() => getFromAsyncPromise({ mode: 'returnCool' }))
      ).resolves.toBe('cool');
    });
  });

  describe('when the promise throws a known HttpException', () => {
    it('should reject with the same exception', async () => {
      const e = new HttpNotFound('User not found');
      await expect(
        tryOrFail(async () => {
          const response = await getFromAsyncPromise({ mode: 'returnCool' });
          if (response === 'cool') {
            throw e;
          }
        })
      ).rejects.toThrow(e);
    });
  });

  describe('when the promise throws a native error', () => {
    it('should reject with HttpInternalServerError and the original message', async () => {
      await expect(
        tryOrFail(async () => {
          const response = await getFromAsyncPromise({ mode: 'returnCool' });
          if (response === 'cool') {
            throw new Error('cool');
          }
        })
      ).rejects.toThrow(new HttpInternalServerError('cool'));
    });
  });

  describe('when the promise throws a native error with status code', () => {
    it('should reject with the corresponding http/exception with statusCode', async () => {
      await expect(
        tryOrFail(async () => {
          const response = await getFromAsyncPromise({ mode: 'returnCool' });
          if (response === 'cool') {
            throw new (class extends Error {
              statusCode = 404;
            })('cool');
          }
        })
      ).rejects.toThrow(new HttpNotFound('cool'));
    });
  });
});
