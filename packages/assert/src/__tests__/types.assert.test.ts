import { assertNever, assertNeverNoThrow } from '../types.asserts';

describe('type assertions', () => {
  describe('assertNever', () => {
    describe('when all paths/cases are met', () => {
      it('should work as expected', () => {
        type Network = {
          state: 'loading' | 'error';
        };
        const ret = (net: Network) => {
          // eslint-disable-next-line jest/no-conditional-in-test
          switch (net.state) {
            case 'error':
              return 'error';
            case 'loading':
              return 'loading';
            default:
              return assertNever(net.state);
          }
        };
        expect(() =>
          ret({
            state: 'loading',
          })
        ).not.toThrow();
        expect(
          ret({
            state: 'loading',
          })
        ).toBe('loading');
      });
      describe('when some cases are missing', () => {
        it('should throw a TypeError', () => {
          type Network = {
            state: 'loading' | 'error';
          };
          const ret = (net: Network) => {
            // eslint-disable-next-line jest/no-conditional-in-test
            switch (net.state) {
              case 'error':
                return 'error';
              default:
                // @ts-expect-error
                return assertNever(net.state);
            }
          };
          expect(() =>
            ret({
              state: 'loading',
            })
          ).toThrow(
            new TypeError(
              'A value is not expected (assertNever), got: string(length:7)'
            )
          );
        });
      });
    });
  });

  describe('assertNeverNoThrow', () => {
    describe('when all paths/cases are met', () => {
      it('should work as expected', () => {
        type Network = {
          state: 'loading' | 'error';
        };
        const ret = (net: Network) => {
          // eslint-disable-next-line jest/no-conditional-in-test
          switch (net.state) {
            case 'error':
              return 'error';
            case 'loading':
              return 'loading';
            default:
              return assertNeverNoThrow(net.state);
          }
        };
        expect(() =>
          ret({
            state: 'loading',
          })
        ).not.toThrow();
        expect(
          ret({
            state: 'loading',
          })
        ).toBe('loading');
      });
      describe('when some cases are missing', () => {
        it('should not throw and return the value', () => {
          type Network = {
            state: 'loading' | 'error';
          };
          const ret = (net: Network) => {
            // eslint-disable-next-line jest/no-conditional-in-test
            switch (net.state) {
              case 'error':
                return 'error';
              default:
                // @ts-expect-error
                return assertNeverNoThrow(net.state);
            }
          };
          expect(
            ret({
              state: 'loading',
            })
          ).toBe('loading');
        });
      });
    });
  });
});
