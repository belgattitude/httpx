import { getTypeInfo } from '../getTypeInfo';

describe('getType tests', () => {
  it('should return', () => {
    expect(getTypeInfo(new Date())).toBe('Date');
  });
});
