import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  HttpClientException,
  HttpException,
  HttpServerException,
} from '../../src/base';
import { HttpNotFound } from '../../src/client';
import { supportsErrorCause } from '../../src/support/supportsErrorCause';

vi.mock('../../src/support/supportsErrorCause', () => {
  return {
    supportsErrorCause: () => false,
  };
});

describe(`when Error.cause isn't supported`, () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  const cause = new Error('cause');
  const params = {
    cause,
  };

  const scenarios: [name: string, cls: HttpException][] = [
    ['HttpException', new HttpException(500, params)],
    ['HttpClientException', new HttpClientException(404, params)],
    ['HttpServerException', new HttpServerException(500, params)],
    ['HttpNotFound', new HttpNotFound(params)],
  ];

  it.each(scenarios)('should ignore the cause for %s.', (_name, err) => {
    expect(supportsErrorCause()).toStrictEqual(false);
    expect(err.cause).toStrictEqual(undefined);
  });
});
