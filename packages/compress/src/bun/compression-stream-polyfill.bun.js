import {
  CompressionStream,
  DecompressionStream,
} from './compression-stream.bun';

globalThis.CompressionStream ??= CompressionStream;

globalThis.DecompressionStream ??= DecompressionStream;
