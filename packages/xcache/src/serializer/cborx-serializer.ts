// cause in peerDependencies
import { Encoder, type Options } from "cbor-x";

import type { ICacheBinarySerializer } from "./types";

/**
 * CborxSerializer options (cbor-x Encoder options).
 * @see https://github.com/kriszyp/cbor-x#options
 */
export type CborxSerializerOptions = Options;

/**
 * Binary CBOR serializer (requires the "cbor-x" peer dependency).
 * Supports Date, BigInt, Map, Set, undefined, NaN, typed arrays, shared and
 * cyclic references... Fastest and smallest, with record extensions
 * (only readable by cbor-x). Defaults: { useRecords: true, structuredClone: true }.
 */
export class CborxSerializer implements ICacheBinarySerializer {
  /** Binary serializer: serialize returns a Uint8Array */
  readonly binary = true;
  readonly #encoder: Encoder;

  /**
   * @example
   * ```typescript
   * import { CacheCompress, CborxSerializer } from '@httpx/xcache';
   *
   * const compressor = new CacheCompress({
   *   serializer: new CborxSerializer(),
   *   // or without shared references support (faster serialize, shared
   *   // objects are duplicated, cyclic references throw)
   *   // serializer: new CborxSerializer({ structuredClone: false }),
   *   algorithm: 'gzip',
   * });
   * ```
   */
  constructor(options?: CborxSerializerOptions) {
    this.#encoder = new Encoder({
      useRecords: true,
      structuredClone: true,
      ...options,
    });
  }
  /** Identifier of the serializer, stored in the compression meta */
  getIdentifier = (): string => "cbor-x";
  /** Serialize the data into CBOR bytes */
  serialize = <T>(data: T): Uint8Array => this.#encoder.encode(data);
  /** Deserialize bytes created by serialize */
  deserialize = <T = unknown>(serializedData: Uint8Array): T =>
    this.#encoder.decode(serializedData) as T;
  /** Same as getIdentifier */
  toString = (): string => this.getIdentifier();
}
