import { TimeLruCache } from '../time-lru-cache';

const HUNDRED_MILLIS = 100;
const SIXTY_MILLIS = 60;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('TimeLruCache', () => {
  describe('eviction', () => {
    it('should evict items based on ttl', async () => {
      const lru = new TimeLruCache({
        maxSize: 2,
        defaultTTL: HUNDRED_MILLIS,
      });
      lru.set('key1', 'value1', HUNDRED_MILLIS);
      lru.set('key2', 'value2', 4 * HUNDRED_MILLIS);
      expect(lru.get('key1')).toBe('value1');
      expect(lru.get('key2')).toBe('value2');
      await wait(HUNDRED_MILLIS + SIXTY_MILLIS);
      expect(lru.get('key1')).toBeUndefined();
      expect(lru.get('key2')).toBe('value2');
    });

    it('should call onEviction when trying to get an expired item', async () => {
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
      await wait(HUNDRED_MILLIS + SIXTY_MILLIS);
      lru.get('key1');
      lru.get('key2');
      expect(fn).toHaveBeenCalledExactlyOnceWith('key1', 'value1');
    });
    it('should call eviction on has() if item expired', async () => {
      const fn = vi.fn();

      const lru = new TimeLruCache({
        maxSize: 2,
        defaultTTL: HUNDRED_MILLIS,
        onEviction: (key, value) => {
          fn(key, value);
        },
      });
      lru.set('key1', 'value1', HUNDRED_MILLIS);
      await wait(HUNDRED_MILLIS + SIXTY_MILLIS);
      lru.has('key1');
      expect(fn).toHaveBeenCalledExactlyOnceWith('key1', 'value1');
    });
  });
});
