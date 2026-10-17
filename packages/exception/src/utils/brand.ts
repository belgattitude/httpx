/**
 * Major version of @httpx/exception, replaced at build time (see tsdown.config.ts)
 */
declare const __HTTPX_EXCEPTION_MAJOR__: string | undefined;

/**
 * Global registry symbol shared by every copy of the same @httpx/exception
 * major version loaded in a realm (esm + cjs builds, duplicated installs...).
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
 * Add the class name to the instance brand
 * @internal
 */
export const addBrand = (obj: object, name: string) => {
  const brands = (obj as Branded)[brandKey];
  if (brands === undefined) {
    // not enumerable: must not leak in serialization, equality checks...
    Object.defineProperty(obj, brandKey, { value: [name] });
  } else {
    brands.push(name);
  }
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
