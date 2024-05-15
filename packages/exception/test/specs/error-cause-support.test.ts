import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe(`when Error.cause isn't supported`, () => {
  beforeEach(() => {
    // vi.restoreAllMocks();
  });
  afterEach(() => {
    // vi.restoreAllMocks();
    // vi.resetModules();
  });

  const cause = new Error('cause');
  const params = {
    cause,
  };

  it('should return undefined rather than runtime error', async () => {
    vi.mock(
      import('../../src/support/supportsErrorCause'),
      async (importOriginal) => {
        const mod = await importOriginal();
        return {
          ...mod,
          supportsErrorCause: () => false,
        };
      }
    );
    const HttpException = await import('../../src/base/HttpException').then(
      (mod) => mod.HttpException
    );
    expect(new HttpException(500, params).cause).toStrictEqual(undefined);
  });
});
