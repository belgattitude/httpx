/**
 * CookieStoreChunked
 *
 * A tiny helper to set/get/clear cookie values with 4KB chunking.
 *
 * Strategy:
 * - For a logical cookie name X, we create a small "index" cookie X (base) whose value is the
 *   number of chunks (n). If n=0, it means no value stored.
 * - The actual data is split into up to n chunks and stored in cookies:
 *     `${X}.__chunk_${i}` where i starts at 1 and goes to n.
 * - On get(X), we read X to know n, then concatenate X.__chunk_1..n values.
 * - On clear(X), we delete X and all X.__chunk_* cookies.
 *
 * Notes:
 * - The per-cookie storage limit is roughly 4096 bytes (name + value + attributes).
 *   To stay safe, we default to a conservative chunk size (defaults to 3500).
 * - All values are stored as-is (string). If you need to store binary/objects,
 *   encode/decode on the caller side (e.g., JSON.stringify, base64, etc.).
 */

export type CookieSameSite = 'Lax' | 'Strict' | 'None';

export type CookieSetOptions = {
  /** The Date the cookie expires at. If not set, it's a session cookie. */
  expires?: Date;
  /** Max-Age in seconds. If set, takes precedence over expires. */
  maxAgeSeconds?: number;
  /** Cookie path. Defaults to '/'. */
  path?: string;
  /** Optional domain attribute. */
  domain?: string;
  /** Whether to add the Secure attribute. */
  secure?: boolean;
  /** SameSite attribute. */
  sameSite?: CookieSameSite;
};

export type CookieStoreChunkedParams = {
  /**
   * Maximum number of characters to place in a single chunk cookie value.
   * This does NOT include the cookie name or attributes. Default: 3500
   */
  chunkSize?: number;
  /**
   * Function used to read document.cookie. You can inject a custom function for testing.
   */
  readCookieString?: () => string;
  /**
   * Function used to set document.cookie. You can inject a custom function for testing.
   */
  writeCookieString?: (cookieString: string) => void;
};

export class CookieStoreChunked {
  private readonly chunkSize: number;
  private readonly readCookieString: () => string;
  private readonly writeCookieString: (cookieString: string) => void;

  constructor(params?: CookieStoreChunkedParams) {
    this.chunkSize = Math.max(1, params?.chunkSize ?? 3500);
    this.readCookieString =
      params?.readCookieString ??
      (() => (typeof document === 'undefined' ? '' : document.cookie));
    this.writeCookieString =
      params?.writeCookieString ??
      ((s: string) => {
        if (typeof document !== 'undefined') document.cookie = s;
      });
  }

  /**
   * Set a logical cookie name to a big string value. The value will be split across
   * chunked cookies at approximately this.chunkSize per cookie.
   */
  set(name: string, value: string, options?: CookieSetOptions): void {
    if (!name) throw new TypeError('cookie name must be non-empty');

    // First, clear any existing chunks for this name to avoid leftovers.
    this.clear(name, options);

    if (value.length === 0) {
      // Set index cookie to "0" so a get() can distinguish between not present and empty.
      this.setSingleCookie(name, '0', options);
      return;
    }

    const chunks: string[] = [];
    for (let i = 0; i < value.length; i += this.chunkSize) {
      chunks.push(value.slice(i, i + this.chunkSize));
    }

    // Write chunk cookies
    for (const [i, chunk] of chunks.entries()) {
      const chunkName = this.chunkName(name, i + 1);
      this.setSingleCookie(chunkName, chunk, options);
    }

    // Write the index cookie with the count
    this.setSingleCookie(name, String(chunks.length), options);
  }

  /**
   * Get the value for the logical cookie name. Returns undefined if not present.
   */
  get(name: string): string | undefined {
    if (!name) return undefined;
    const all = this.parseAll();

    const indexVal = all.get(name);
    if (indexVal === undefined) return undefined; // not present

    const count = Number(indexVal);
    if (!Number.isFinite(count) || count < 0) return undefined;

    if (count === 0) return '';

    let result = '';
    for (let i = 1; i <= count; i++) {
      const part = all.get(this.chunkName(name, i)) ?? '';
      result += part;
    }
    return result;
  }

  /**
   * Clear the logical cookie (index + all chunks). Uses past expires to delete.
   */
  clear(name: string, options?: CookieSetOptions): void {
    if (!name) return;
    const all = this.parseAll();

    const indexVal = all.get(name);
    const count = Number(indexVal);

    // Delete index cookie
    this.deleteCookie(name, options);

    // If we can infer the number of chunks, delete precisely; otherwise scan potential leftovers
    if (Number.isFinite(count) && count > 0) {
      for (let i = 1; i <= count; i++) {
        this.deleteCookie(this.chunkName(name, i), options);
      }
    } else {
      // Best-effort cleanup: delete any cookie whose name matches our chunk prefix
      const prefix = `${name}.__chunk_`;
      for (const key of all.keys()) {
        if (key.startsWith(prefix)) {
          this.deleteCookie(key, options);
        }
      }
    }
  }

  /**
   * Suffix naming strategy for chunk cookies: `${name}.__chunk_${index}` (index starts at 1).
   */
  private chunkName(base: string, index: number): string {
    return `${base}.__chunk_${index}`;
  }

  private setSingleCookie(
    name: string,
    value: string,
    options?: CookieSetOptions
  ): void {
    const attrs = this.toAttributes(options);
    // We do not URI-encode to keep predictability; caller can encode if needed.
    this.writeCookieString(`${name}=${value}${attrs}`);
  }

  private deleteCookie(name: string, options?: CookieSetOptions): void {
    // Force expire in the past; preserve path/domain/samesite/secure if provided
    const past = new Date(0);
    const opts: CookieSetOptions = {
      ...options,
      expires: past,
      maxAgeSeconds: 0,
    };
    const attrs = this.toAttributes(opts);
    this.writeCookieString(
      `${name}=;${attrs.startsWith(';') ? attrs.slice(1) : attrs}`
    );
  }

  private toAttributes(options?: CookieSetOptions): string {
    let s = '';
    if (options?.maxAgeSeconds != null) {
      const v = Math.max(0, Math.floor(options.maxAgeSeconds));
      s += `; Max-Age=${v}`;
    } else if (options?.expires) {
      s += `; Expires=${options.expires.toUTCString()}`;
    }
    s += `; Path=${options?.path ?? '/'}`;
    if (options?.domain) s += `; Domain=${options.domain}`;
    if (options?.secure) s += '; Secure';
    if (options?.sameSite) s += `; SameSite=${options.sameSite}`;
    return s;
  }

  private parseAll(): Map<string, string> {
    const map = new Map<string, string>();
    const raw = this.readCookieString() || '';
    if (!raw) return map;
    const parts = raw.split(';');
    for (const part of parts) {
      const [k, ...rest] = part.split('=');
      if (k == null) continue;
      const key = k.trim();
      const val = rest.join('='); // values may contain '='
      map.set(key, val);
    }
    return map;
  }
}
