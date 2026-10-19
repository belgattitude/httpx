/**
 * Check if an Accept-Encoding header value accepts the given encoding,
 * taking quality values into account (ie: "gzip;q=0" refuses gzip).
 *
 * @example
 * ```typescript
 * acceptsEncoding('gzip, deflate, br', 'gzip'); // true
 * acceptsEncoding('*;q=0.5, gzip;q=0', 'gzip'); // false
 * acceptsEncoding(undefined, 'gzip'); // false
 * ```
 */
export const acceptsEncoding = (
  acceptEncoding: string | undefined,
  encoding: string
): boolean => {
  if (acceptEncoding === undefined || acceptEncoding === "") {
    return false;
  }
  let wildcardQ: number | undefined;
  for (const part of acceptEncoding.split(",")) {
    const [rawToken = "", ...params] = part.split(";");
    const token = rawToken.trim().toLowerCase();
    let q = 1;
    for (const param of params) {
      const [name, value] = param.split("=");
      if (name?.trim().toLowerCase() === "q" && value !== undefined) {
        const parsed = Number.parseFloat(value.trim());
        q = Number.isNaN(parsed) ? 0 : parsed;
      }
    }
    if (token === encoding) {
      // an explicit entry takes precedence over the wildcard
      return q > 0;
    }
    if (token === "*") {
      wildcardQ = q;
    }
  }
  return wildcardQ !== undefined && wildcardQ > 0;
};

/**
 * Return the opaque part of an etag (without the weak W/ prefix).
 */
const opaqueTag = (tag: string): string => {
  const trimmed = tag.trim();
  return trimmed.startsWith("W/") ? trimmed.slice(2) : trimmed;
};

/**
 * Check if an If-None-Match header value matches the given etag, using the
 * weak comparison (W/ prefixes are ignored), as required for If-None-Match.
 */
export const matchesIfNoneMatch = (
  ifNoneMatch: string | undefined,
  etag: string
): boolean => {
  if (ifNoneMatch === undefined || ifNoneMatch === "") {
    return false;
  }
  const expected = opaqueTag(etag);
  return ifNoneMatch.split(",").some((tag) => {
    const value = opaqueTag(tag);
    return value === "*" || value === expected;
  });
};

/**
 * Add a field to the Vary header of a headers record, preserving the
 * caller-provided values (whatever the header name casing). Nothing is added
 * when the field (or "*") is already present.
 *
 * @example
 * ```typescript
 * const headers = { vary: "Cookie" };
 * appendVary(headers, "Accept-Encoding");
 * // headers: { vary: "Cookie, Accept-Encoding" }
 * ```
 */
export const appendVary = (
  headers: Record<string, string>,
  field: string
): void => {
  const name =
    Object.keys(headers).find((key) => key.toLowerCase() === "vary") ?? "Vary";
  const current = headers[name]?.trim() ?? "";
  if (current === "") {
    headers[name] = field;
    return;
  }
  const lowerField = field.toLowerCase();
  const isCovered = current.split(",").some((value) => {
    const token = value.trim().toLowerCase();
    return token === lowerField || token === "*";
  });
  if (!isCovered) {
    headers[name] = `${current}, ${field}`;
  }
};

/**
 * Fast non-cryptographic 32-bit hash (FNV-1a) of a string.
 */
export const fnv1a32 = (str: string): number => {
  let hash = 0x81_1c_9d_c5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01_00_01_93);
  }
  return hash >>> 0;
};

/**
 * Create a weak ETag from the cache key and the entry creation time. Weak,
 * as the same tag is used for the compressed and uncompressed responses.
 */
export const createWeakEtag = (cacheKey: string, createdAt: number): string =>
  `W/"${fnv1a32(cacheKey).toString(36)}-${createdAt.toString(36)}"`;

/**
 * Cache-Control option of the hono helper.
 *
 * - false: no Cache-Control header.
 * - string: sent as-is (ie: "public, max-age=60").
 * - object: built from the options, see HonoXCacheControlOptions.
 */
export type HonoXCacheControl = false | string | HonoXCacheControlOptions;

/**
 * Options to build a Cache-Control header.
 */
export type HonoXCacheControlOptions = {
  /**
   * max-age in seconds, or "ttl" to use the remaining time to live of the
   * server cache entry (clients never keep the response longer than the
   * server cache).
   */
  maxAge: "ttl" | number;
  /**
   * "private" (browser only) or "public" (shared caches, ie: CDN, allowed).
   * @default "private"
   */
  scope?: "private" | "public";
  /** stale-while-revalidate in seconds */
  staleWhileRevalidate?: number;
};

/**
 * Build a Cache-Control header value, or undefined if not applicable.
 *
 * @param cacheControl - the Cache-Control option
 * @param expiresIn - remaining ttl of the cache entry in milliseconds
 */
export const buildCacheControl = (
  cacheControl: HonoXCacheControl | undefined,
  expiresIn: number | undefined
): string | undefined => {
  if (cacheControl === undefined || cacheControl === false) {
    return undefined;
  }
  if (typeof cacheControl === "string") {
    return cacheControl === "" ? undefined : cacheControl;
  }
  const { maxAge, scope = "private", staleWhileRevalidate } = cacheControl;
  let seconds: number;
  if (maxAge === "ttl") {
    if (expiresIn === undefined) {
      return undefined;
    }
    // floor: never exceed the server cache ttl
    seconds = Math.floor(expiresIn / 1000);
  } else {
    seconds = Math.max(0, Math.floor(maxAge));
  }
  const directives = [scope, `max-age=${seconds}`];
  if (staleWhileRevalidate !== undefined) {
    directives.push(
      `stale-while-revalidate=${Math.max(0, Math.floor(staleWhileRevalidate))}`
    );
  }
  return directives.join(", ");
};
