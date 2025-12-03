import { TimeLruCache } from '../time-lru-cache';

const HUNDRED_MILLIS = 100;
const SIXTY_MILLIS = 60;

describe('TimeLruCache', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Start from a known point in time
    vi.setSystemTime(0);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('eviction', () => {
    it('should evict items based on ttl', () => {
      const lru = new TimeLruCache({
        maxSize: 2,
        defaultTTL: HUNDRED_MILLIS,
      });
      lru.set('key1', 'value1', HUNDRED_MILLIS);
      lru.set('key2', 'value2', 4 * HUNDRED_MILLIS);
      expect(lru.get('key1')).toBe('value1');
      expect(lru.get('key2')).toBe('value2');
      // Advance fake time beyond key1's ttl
      vi.setSystemTime(Date.now() + HUNDRED_MILLIS + SIXTY_MILLIS);
      expect(lru.get('key1')).toBeUndefined();
      expect(lru.get('key2')).toBe('value2');
    });

    it('should call onEviction when trying to get an expired item', () => {
      const fn = vi.fn();

      const lru = new TimeLruCache({
        maxSize: 2,
        defaultTTL: HUNDRED_MILLIS,
        onEviction: (key, value) => {
          fn(key, value);
        },
      });
      lru.set('key1', 'value1', HUNDRED_MILLIS);
      lru.set('key2', 'value2', 4 * HUNDRED_MILLIS);
      // Move time forward so key1 expires but key2 does not
      vi.setSystemTime(Date.now() + HUNDRED_MILLIS + SIXTY_MILLIS);
      lru.get('key1');
      lru.get('key2');
      expect(fn).toHaveBeenCalledExactlyOnceWith('key1', 'value1');
    });
    it('should call eviction on has() if item expired', () => {
      const fn = vi.fn();

      const lru = new TimeLruCache({
        maxSize: 2,
        defaultTTL: HUNDRED_MILLIS,
        onEviction: (key, value) => {
          fn(key, value);
        },
      });
      lru.set('key1', 'value1', HUNDRED_MILLIS);
      vi.setSystemTime(Date.now() + HUNDRED_MILLIS + SIXTY_MILLIS);
      lru.has('key1');
      expect(fn).toHaveBeenCalledExactlyOnceWith('key1', 'value1');
    });
  });
  describe('getOrSet', () => {
    it('should get existing item if not expired', () => {
      const lru = new TimeLruCache({
        maxSize: 2,
        defaultTTL: HUNDRED_MILLIS,
      });
      lru.set('key1', 'value1', HUNDRED_MILLIS * 5);
      const val = lru.getOrSet('key1', () => 'newValue', HUNDRED_MILLIS);
      expect(val).toBe('value1');
    });
    it('should set a new value item has expired', () => {
      const lru = new TimeLruCache({
        maxSize: 2,
        defaultTTL: HUNDRED_MILLIS,
      });
      lru.set('key1', 'value1', HUNDRED_MILLIS);
      // Advance fake time beyond key1's ttl
      vi.setSystemTime(Date.now() + HUNDRED_MILLIS + SIXTY_MILLIS);
      const val = lru.getOrSet('key1', () => 'newValue', HUNDRED_MILLIS);
      expect(val).toBe('newValue');
    });
  });
});
