import { assertNever, assertNeverNoThrow } from "../types.asserts";

describe("type assertions", () => {
  describe("assertNever", () => {
    describe("when all paths/cases are met", () => {
      it("should work as expected", () => {
        type Network = {
          state: "loading" | "error";
        };
        const ret = (net: Network) => {
          switch (net.state) {
            case "error": {
              return "error";
            }
            case "loading": {
              return "loading";
            }
            default: {
              return assertNever(net.state);
            }
          }
        };
        expect(() =>
          ret({
            state: "loading",
          })
        ).not.toThrow();
        expect(
          ret({
            state: "loading",
          })
        ).toBe("loading");
      });
      describe("when some cases are missing", () => {
        it("should throw a TypeError", () => {
          type Network = {
            state: "loading" | "error";
          };
          const ret = (net: Network) => {
            // oxlint-disable-next-line typescript/switch-exhaustiveness-check -- non-exhaustive on purpose to test assertNever
            switch (net.state) {
              case "error": {
                return "error";
              }
              default: {
                // @ts-expect-error: "loading" is deliberately not handled
                return assertNever(net.state);
              }
            }
          };
          expect(() =>
            ret({
              state: "loading",
            })
          ).toThrow(
            new TypeError(
              "A value is not expected (assertNever), got: string(length:7)"
            )
          );
        });
      });
    });
  });

  describe("assertNeverNoThrow", () => {
    describe("when all paths/cases are met", () => {
      it("should work as expected", () => {
        type Network = {
          state: "loading" | "error";
        };
        const ret = (net: Network) => {
          switch (net.state) {
            case "error": {
              return "error";
            }
            case "loading": {
              return "loading";
            }
            default: {
              return assertNeverNoThrow(net.state);
            }
          }
        };
        expect(() =>
          ret({
            state: "loading",
          })
        ).not.toThrow();
        expect(
          ret({
            state: "loading",
          })
        ).toBe("loading");
      });
      describe("when some cases are missing", () => {
        it("should not throw and return the value", () => {
          type Network = {
            state: "loading" | "error";
          };
          const ret = (net: Network) => {
            // oxlint-disable-next-line typescript/switch-exhaustiveness-check -- non-exhaustive on purpose to test assertNever
            switch (net.state) {
              case "error": {
                return "error";
              }
              default: {
                // @ts-expect-error: "loading" is deliberately not handled
                return assertNeverNoThrow(net.state);
              }
            }
          };
          expect(
            ret({
              state: "loading",
            })
          ).toBe("loading");
        });
      });
    });
  });
});
