import type { TsonType } from 'tupleson';
import { createTson } from 'tupleson';
import { describe, expect, it } from 'vitest';

import {
  createHttpException,
  HttpException,
  HttpUnprocessableEntity,
} from '../../src';
import { fromJson, type SerializerError, toJson } from '../../src/serializer';

describe('Ecosystem:tupleson', () => {
  const httpException: TsonType<HttpException | SerializerError, string> = {
    deserialize: (v) => fromJson(v),
    key: 'HttpException',
    serialize: (v) => toJson(v),
    test: (v) => v instanceof HttpException,
  };

  const tson = createTson({
    types: [httpException],
  });

  const obj = {
    e404: createHttpException(404),
    e422: new HttpUnprocessableEntity({
      issues: [
        {
          code: 'empty_string',
          message: 'Invalid address',
          path: ['addresses', 0, 'line1'],
        },
      ],
    }),
  };

  it('should serialize/deserialize', () => {
    const serialized = tson.serialize(obj);
    const deserialized = tson.deserialize(serialized);
    expect(deserialized).toStrictEqual(obj);
  });
});
