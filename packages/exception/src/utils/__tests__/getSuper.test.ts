import { getSuper } from '../getSuper';

describe('getSuper', () => {
  it('should return an object from string mesg', () => {
    const cls = { name: 'HttpNotFound' };
    expect(getSuper(cls)).toStrictEqual({
      message: 'Not found',
    });
    expect(getSuper(cls, 'msg')).toStrictEqual({ message: 'msg' });
    expect(
      getSuper(cls, {
        message: 'msg',
      })
    ).toStrictEqual({ message: 'msg' });
  });
});
