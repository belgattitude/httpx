import { getSuper } from '../getSuper';

describe('getSuper', () => {
  it('should return an object from string mesg', () => {
    expect(getSuper('HttpNotFound')).toStrictEqual({ message: 'Not found' });
    expect(getSuper('HttpNotFound', 'msg')).toStrictEqual({ message: 'msg' });
    expect(
      getSuper('HttpNotFound', {
        message: 'msg',
      })
    ).toStrictEqual({ message: 'msg' });
  });
});
