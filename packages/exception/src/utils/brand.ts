/**
 * Major version of @httpx/exception, replaced at build time (see tsdown.config.ts)
 */
declare const __HTTPX_EXCEPTION_MAJOR__: string | undefined;

/**
 * Global registry symbol shared by every copy of the same @httpx/exception
 * major version loaded in a realm (esm + cjs builds, duplicated installs...).
 *
 * Set on classes (statics), holds the class name (ie: 'HttpNotFound').
 *
 * @internal
 */
export const brandKey: unique symbol = Symbol.for(
  `@httpx/exception-v${typeof __HTTPX_EXCEPTION_MAJOR__ === "string" ? __HTTPX_EXCEPTION_MAJOR__ : "dev"}`
);

type Branded = { [brandKey]: string };

const ownBrand = (cls: unknown): string | undefined =>
  typeof cls === "function" && Object.hasOwn(cls, brandKey)
    ? (cls as unknown as Branded)[brandKey]
    : undefined;

/**
 * Test whether a value was created by a class with the same brand name
 * from another copy of the same @httpx/exception major version, by looking
 * for it in the constructors of its prototype chain.
 * @internal
 */
export const hasBrand = (value: unknown, cls: object): boolean => {
  const brand = ownBrand(cls);
  if (
    // the brand is a global symbol anyone can set: at least ensure the
    // minimal shape of an exception (message, stack, numeric statusCode)
    !(value instanceof Error) ||
    typeof (value as { statusCode?: unknown }).statusCode !== "number" ||
    // classes extending an exception without their own brand are never matched by brand
    brand === undefined
  ) {
    return false;
  }
  for (
    let proto = Object.getPrototypeOf(value) as object | null;
    proto !== null;
    proto = Object.getPrototypeOf(proto) as object | null
  ) {
    if (
      Object.hasOwn(proto, "constructor") &&
      ownBrand(proto.constructor) === brand
    ) {
      return true;
    }
  }
  return false;
};
