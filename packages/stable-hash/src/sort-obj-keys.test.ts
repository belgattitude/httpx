import { sortObjKeys } from './sort-obj-keys';

describe('sortObjKeys', () => {
  const createObject = () => ({
    z: 'z',
    a: 'a',
  });
  it('should return a sorted object', () => {
    const obj = createObject();
    const sorted = sortObjKeys(obj);
    expect(sorted).toStrictEqual({
      a: 'a',
      z: 'z',
    });
  });
  it('should not mutate the original object', () => {
    const obj = createObject();
    const backup = JSON.stringify(obj);
    const _sorted = sortObjKeys(obj);
    expect(JSON.stringify(obj)).toStrictEqual(backup);
  });
});
