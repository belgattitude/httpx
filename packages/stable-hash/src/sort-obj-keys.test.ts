import { sortObjKeys } from './sort-obj-keys';

describe('sortObjKeys', () => {
  it('should work', () => {
    expect(
      sortObjKeys({
        z: 'z',
        a: 'a',
      })
    ).toStrictEqual({
      a: 'a',
      z: 'z',
    });
  });
});
