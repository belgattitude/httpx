import { describe, expect, it } from 'vitest';

import {
  HttpClientException,
  HttpException,
  HttpServerException,
} from '../../base';
import { statusMap } from '../../status';
import type { HttpExceptionParams } from '../../types/HttpExceptionParams';
import { createHttpException } from '../createHttpException';

describe('createHttpException tests', () => {
  describe('when error status has a concrete class', () => {
    type AnyExceptionClass = new (
      params: HttpExceptionParams | string
    ) => HttpException;

    const all = Object.entries(statusMap).map(([code, cls]) => {
      const obj = new cls();
      return [obj.name, Number.parseInt(code, 10), cls];
    }) as [className: string, status: number, cls: AnyExceptionClass][];

    it.each(all)(
      'should return %p from status %p',
      (className, status, cls) => {
        const params = 'msg';
        const error = createHttpException(status, params);
        const expected = new cls(params);
        expect(error).toStrictEqual(expected);
        expect(error.statusCode).toStrictEqual(status);
      }
    );

    it.each(all)(
      'should preserve the object name (%p.name) and the status (%p)',
      (className, status, cls) => {
        const params = 'msg';
        const error = createHttpException(status, params);
        const expected = new cls(params);
        expect(error.name).toStrictEqual(expected.name);
        expect(error.statusCode).toStrictEqual(status);
      }
    );
  });

  describe('when server status does not have a concrete class', () => {
    const unassignedServerCodes = [
      ['Arbitrary number 599', 599],
      ['Cloudflare - 524 - A Timeout Occurred', 524],
      ['Cloudflare - 525 - SSL Handshake Failed', 525],
    ] as [msg: string, status: number][];

    it.each(unassignedServerCodes)(
      'should return HttpServerException',
      (msg, status) => {
        const error = createHttpException(status, msg);
        expect(error).toStrictEqual(new HttpServerException(status, msg));
        expect(error.name).toStrictEqual('HttpServerException');
        expect(error.statusCode).toStrictEqual(status);
      }
    );
  });

  describe('when client status does not have a concrete class', () => {
    const unassignedClientCodes = [
      ['Arbitrary number 499', 499],
      ['Unassigned 427', 427],
    ] as [msg: string, status: number][];

    it.each(unassignedClientCodes)(
      'should return HttpClientException',
      (msg, status) => {
        const error = createHttpException(status, msg);
        expect(error).toStrictEqual(
          new HttpClientException(status, {
            message: msg,
          })
        );
        expect(error.name).toStrictEqual('HttpClientException');
        expect(error.statusCode).toStrictEqual(status);
      }
    );
  });

  describe('when provided status code is out of [400...599] range', () => {
    const nonErrorCodes = [
      ['Success', 200],
      ['Out of range', 1099],
    ] as [msg: string, status: number][];

    it.each(nonErrorCodes)(
      'should return HttpException with the provided status code',
      (msg, status) => {
        const error = createHttpException(status, msg);
        expect(error).toStrictEqual(
          new HttpException(status, {
            message: msg,
          })
        );
        expect(error.name).toStrictEqual('HttpException');
        expect(error.statusCode).toStrictEqual(status);
      }
    );
  });
});
