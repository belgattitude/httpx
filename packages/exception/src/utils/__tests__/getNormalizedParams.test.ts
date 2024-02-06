import { describe, expect, it } from 'vitest';

import { getNormalizedParams } from '../getNormalizedParams';

describe('getSuper', () => {
  it('should return an object from string msg', () => {
    const cls = { name: 'HttpNotFound' };
    expect(getNormalizedParams('NotFound', {})).toStrictEqual({
      message: 'Not found',
    });
    expect(getNormalizedParams('NotFound', 'msg')).toStrictEqual({
      message: 'msg',
    });
    expect(
      getNormalizedParams('NotFound', {
        message: 'msg',
      })
    ).toStrictEqual({ message: 'msg' });
  });
});
