import { afterEach, beforeEach, expect, vi } from 'vitest';
import { HttpClientException, HttpException } from '../../src/base';
import { HttpNotFound } from '../../src/client';
import { supportsErrorCause } from '../../src/support/supportsErrorCause';

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
    ['HttpServerException', new HttpClientException(500, params)],
    ['HttpNotFound', new HttpNotFound(params)],
  ];

  vi.mock('../../src/support/supportsErrorCause', () => {
    return {
      supportsErrorCause: () => false,
    };
  });

  it.each(scenarios)('should ignore the cause for %s.', (name, err) => {
    expect(supportsErrorCause()).toStrictEqual(false);
    expect(err.cause).toStrictEqual(undefined);
  });
});
