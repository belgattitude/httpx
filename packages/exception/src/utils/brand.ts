/**
 * Major version of @httpx/exception, replaced at build time (see tsdown.config.ts)
 */
declare const __HTTPX_EXCEPTION_MAJOR__: string | undefined;

/**
 * Global registry symbol shared by every copy of the same @httpx/exception
 * major version loaded in a realm (duplicated installs, bundled copies...).
 *
 * - on classes, holds the class name (ie: 'HttpNotFound')
 * - on instances, holds the names of the class hierarchy (ie: ['HttpException', 'HttpClientException', 'HttpNotFound'])
 *
 * @internal
 */
export const brandKey: unique symbol = Symbol.for(
  `@httpx/exception-v${typeof __HTTPX_EXCEPTION_MAJOR__ === "string" ? __HTTPX_EXCEPTION_MAJOR__ : "dev"}`
);

type Branded = { [brandKey]?: string[] };

/**
 * Brand an instance with the names of its class hierarchy (same shape
 * as in all 4.x versions, so they recognize each other's instances).
 * @internal
 */
export const addBrand = (obj: object, cls: unknown) => {
  const brands: string[] = [];
  for (let c = cls; typeof c === "function"; c = Object.getPrototypeOf(c)) {
    if (Object.hasOwn(c, brandKey)) {
      brands.unshift((c as unknown as { [brandKey]: string })[brandKey]);
    }
  }
  // not enumerable: must not leak in serialization, equality checks...
  Object.defineProperty(obj, brandKey, { value: brands });
};

/**
 * Test whether a value was created by a class with the same brand name
 * from another copy of the same @httpx/exception major version.
 * @internal
 */
export const hasBrand = (value: unknown, cls: object): boolean => {
  if (
    // the brand is a global symbol anyone can set: at least ensure the
    // minimal shape of an exception (message, stack, numeric statusCode)
    !(value instanceof Error) ||
    typeof (value as { statusCode?: unknown }).statusCode !== "number" ||
    // classes extending an exception without their own brand are never matched by brand
    !Object.hasOwn(cls, brandKey)
  ) {
    return false;
  }
  const brands = (value as Branded)[brandKey];
  return (
    Array.isArray(brands) &&
    brands.includes((cls as { [brandKey]: string })[brandKey])
  );
};

/**
 * Test whether a value is branded with a class name (ie: 'HttpUnprocessableEntity'),
 * from any copy of the same @httpx/exception major version:
 *
 * - by the brand set on the instance at construction
 * - or, when absent, by a branded class in its prototype chain (ie: instances
 *   revived with `Object.create(cls.prototype)` that never ran the constructor)
 * @internal
 */
export const isBrandedAs = (value: unknown, name: string): boolean => {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const brands = (value as Branded)[brandKey];
  if (Array.isArray(brands)) {
    return brands.includes(name);
  }
  for (
    let proto = Object.getPrototypeOf(value) as object | null;
    proto !== null;
    proto = Object.getPrototypeOf(proto) as object | null
  ) {
    const cls: unknown = Object.hasOwn(proto, "constructor")
      ? (proto as { constructor: unknown }).constructor
      : undefined;
    if (
      typeof cls === "function" &&
      Object.hasOwn(cls, brandKey) &&
      (cls as unknown as { [brandKey]: unknown })[brandKey] === name
    ) {
      return true;
    }
  }
  return false;
};
