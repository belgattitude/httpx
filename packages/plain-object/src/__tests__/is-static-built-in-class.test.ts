import { isStaticBuiltInClass } from '../is-static-built-in-class';

describe('isStaticBuiltInClass', () => {
  it('should return true for static built-in classes', () => {
    expect(isStaticBuiltInClass(Math)).toBe(true);
    expect(isStaticBuiltInClass(JSON)).toBe(true);
    expect(isStaticBuiltInClass(Atomics)).toBe(true);
  });
  it('should return false for if not a static built-in class', () => {
    expect(isStaticBuiltInClass(new Date())).toBe(false);
    expect(isStaticBuiltInClass({})).toBe(false);
    expect(isStaticBuiltInClass(null)).toBe(false);
  });
});
