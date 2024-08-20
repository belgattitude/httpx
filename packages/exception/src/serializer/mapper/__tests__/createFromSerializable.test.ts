import { describe, expect, it } from 'vitest';

import { HttpException } from '../../../base';
import { HttpBadRequest, HttpUnprocessableEntity } from '../../../client';
import { isHttpException } from '../../../typeguards/isHttpException';
import { convertToSerializable } from '../convertToSerializable';
import { createFromSerializable } from '../createFromSerializable';

describe('createFromSerializable', () => {
  describe('when an http exception is given', () => {
    const httpExceptions: [label: string, error: HttpException][] = [
      ['simple', new HttpException(500)],
      ['withMsg', new HttpException(500, 'msg')],
      [
        'withFullParams',
        new HttpException(500, {
          code: 'NETWORK_UNAVAILABLE',
          errorId: 'nanoid()',
          message: 'msg',
          method: 'PUT',
          url: 'http://localhost',
        }),
      ],
      [
        'withCause',
        new HttpException(500, {
          cause: new HttpException(500, 'msg'),
        }),
      ],
      [
        'HttpBadRequest',
        new HttpBadRequest({
          cause: new EvalError(),
          message: 'msg',
          url: 'http://',
        }),
      ],
    ];

    it.each(httpExceptions)(
      'should give the same after serialization (%s)',
      (label, err) => {
        const converted = createFromSerializable(convertToSerializable(err));
        expect(converted).toStrictEqual(err);
        expect((converted as HttpException)?.url).toStrictEqual(err.url);
        expect((converted as HttpException)?.method).toStrictEqual(err.method);
        expect((converted as HttpException)?.errorId).toStrictEqual(
          err.errorId
        );
        expect((converted as HttpException)?.code).toStrictEqual(err.code);
      }
    );
  });

  it('deserialize issues of HttpUnprocessableEntity', () => {
    const e422 = new HttpUnprocessableEntity({
      issues: [
        {
          code: 'invalid_email',
          message: 'Invalid email',
          path: 'email',
        },
        {
          code: 'empty_string',
          message: 'Invalid address',
          path: ['addresses', 0, 'line1'],
        },
      ],
      message: 'Validation failed',
    });

    const converted = createFromSerializable(convertToSerializable(e422));
    expect(converted).toStrictEqual(e422);
    expect((converted as HttpUnprocessableEntity)?.issues).toStrictEqual(
      e422.issues
    );
  });

  describe('when native error is given', () => {
    const natives: [label: string, err: Error][] = [
      ['ErrorSimpleRange', new RangeError()],
      ['ErrorSimple', new Error()],
      ['ErrorSimpleRange', new RangeError()],
      ['ErrorSimpleEval', new EvalError()],
      ['ErrorMsg', new Error('msg')],
      [
        'ErrorMsg',
        new Error('msg', {
          cause: new Error('msg'),
        }),
      ],
    ];
    it.each(natives)(
      'should give the same after serialization (%s)',
      (label, err) => {
        const converted = createFromSerializable(convertToSerializable(err));
        expect(converted).toStrictEqual(err);
      }
    );
  });

  describe('when non native error is given', () => {
    class NonNativeError extends Error {
      constructor(
        message: string,
        params?: {
          cause?: Error;
        }
      ) {
        super(message, params);
        Object.setPrototypeOf(this, NonNativeError.prototype);
        this.name = 'NonNativeError';
      }
    }
    it('should fallback to default Error', () => {
      const e = new NonNativeError('msg', {
        cause: new Error('cause'),
      });
      const converted = createFromSerializable(convertToSerializable(e));
      expect(converted).toBeInstanceOf(Error);
      expect(converted.name).toStrictEqual('Error');
      expect(converted.message).toStrictEqual(e.message);
      expect(converted.cause).toStrictEqual(e.cause);
    });
  });

  describe('when a non error is given', () => {
    it('switch to build-in Error with custom message', () => {
      const e = new Date() as unknown as Error;
      const converted = createFromSerializable(convertToSerializable(e));
      expect(converted.name).toStrictEqual('Error');
      expect(converted.message).toStrictEqual(
        `Can't serialize error at runtime. Received 'object'`
      );
    });
  });

  describe('testing includeStack param', () => {
    type CaseParams = {
      err: HttpException | Error;
      includeStack: boolean | undefined;
      expectedReturnType: 'undefined' | 'string';
    };
    const createCase = ({
      err,
      includeStack,
      expectedReturnType,
    }: CaseParams): [label: string, params: CaseParams] => {
      const exceptionType = isHttpException(err)
        ? 'HttpException'
        : 'NativeError';
      return [
        `{ includeStack: ${includeStack} } with '${exceptionType}' should return '${expectedReturnType}'`,
        {
          err,
          includeStack,
          expectedReturnType,
        },
      ];
    };

    const eachCases: ReturnType<typeof createCase>[] = [
      createCase({
        err: new HttpException(500),
        includeStack: undefined,
        expectedReturnType: 'undefined',
      }),
      createCase({
        err: new HttpException(500),
        includeStack: false,
        expectedReturnType: 'undefined',
      }),
      createCase({
        err: new HttpException(500),
        includeStack: true,
        expectedReturnType: 'string',
      }),
      createCase({
        err: new Error('Err !'),
        includeStack: undefined,
        expectedReturnType: 'undefined',
      }),
      createCase({
        err: new Error('Err !'),
        includeStack: false,
        expectedReturnType: 'undefined',
      }),
      createCase({
        err: new Error('Err !'),
        includeStack: true,
        expectedReturnType: 'string',
      }),
    ] as const satisfies ReturnType<typeof createCase>[];

    describe('when initial error has a stack', () => {
      it.each(eachCases)('"%s"', (_label, caseParams) => {
        const { includeStack, err, expectedReturnType } = caseParams;
        const serialized = convertToSerializable(err, {
          includeStack: true,
        });
        const converted = createFromSerializable(serialized, {
          includeStack: includeStack,
        });
        const { stack } = converted;
        expect(stack).toBeTypeOf(expectedReturnType);
      });
    });

    describe('when initial error has an undefined stack', () => {
      it.each(eachCases)('"%s"', (_label, caseParams) => {
        const { includeStack, err, expectedReturnType } = caseParams;
        const serialized = convertToSerializable(err, {
          includeStack: false,
        });
        const converted = createFromSerializable(serialized, {
          includeStack: includeStack,
        });
        const { stack } = converted;
        expect(stack).toBeTypeOf(expectedReturnType);
      });
    });
  });
});
