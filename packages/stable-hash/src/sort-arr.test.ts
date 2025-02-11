import { sortArr } from './sort-arr';

describe('sortArr', () => {
  describe('when an array is empty', () => {
    it('should return an empty array', () => {
      expect(sortArr([])).toStrictEqual([]);
    });
  });
  describe('when an array is only one element', () => {
    it('should return the same array', () => {
      expect(sortArr([1])).toStrictEqual([1]);
    });
  });
  describe('when an array contains different types', () => {
    it('should not sort', () => {
      expect(sortArr([1, 'a', 2])).toStrictEqual([1, 'a', 2]);
    });
  });
  describe('when an array contains only number types', () => {
    it('should sort', () => {
      expect(sortArr([1, 4, 2.1, 2.05, 2])).toStrictEqual([1, 2, 2.05, 2.1, 4]);
    });
  });
  describe('when an array contains bigints', () => {
    it('should sort', () => {
      expect(sortArr([10n, 8n])).toStrictEqual([8n, 10n]);
    });
  });
  describe('when an array contains only string types', () => {
    it('should sort', () => {
      expect(sortArr(['c', 'b', '🦄'])).toStrictEqual(['🦄', 'b', 'c']);
    });
  });
  describe('when an array contains unsupported types', () => {
    it('should not sort the array and return it as is', () => {
      const objArr = [{ id: 1 }, { id: 3 }];
      expect(sortArr(objArr)).toStrictEqual(objArr);
    });
  });
});
