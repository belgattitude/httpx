export interface ICacheCompressor {
  compress: <T>(data: T) => Promise<string>;
  decompress: <T = unknown>(data: string) => Promise<T>;
}
