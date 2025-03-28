/**
 * Supported encodings for compression/decompression.
 *
 * Only 'gzip' and 'deflate' are supported by the Compression Streams API.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Compression_Streams_API
 */
export type SupportedCompressionAlgorithm = 'gzip' | 'deflate';
