/**
 * CompressionStream and DecompressionStream polyfill for Bun <= 1.3.2 using zlib.
 * Can be removed when support lands in bun https://github.com/oven-sh/bun/pull/24757
 * @see https://github.com/oven-sh/bun/issues/1723#issuecomment-3030582174
 */

import { Readable, Writable } from 'node:stream';
import zlib from 'node:zlib';

const compression = {
  deflate: zlib.createDeflate,
  'deflate-raw': zlib.createDeflateRaw,
  gzip: zlib.createGzip,
};

export class CompressionStream {
  constructor(format) {
    const handle = compression[format]();
    this.readable = Readable.toWeb(handle);
    this.writable = Writable.toWeb(handle);
  }
}

const decompression = {
  deflate: zlib.createInflate,
  'deflate-raw': zlib.createInflateRaw,
  gzip: zlib.createGunzip,
};

export class DecompressionStream {
  constructor(format) {
    const handle = decompression[format]();
    this.readable = Readable.toWeb(handle);
    this.writable = Writable.toWeb(handle);
  }
}
