export type AsyncHashAlgorithms = 'SHA-256' | 'SHA-512';

export type HashStrOptions = {
  /**
   * Hashing algorithm to use
   */
  algorithm: AsyncHashAlgorithms;
  /**
   * Encode the hash in hexadecimal
   */
  encoding: 'hexa';
};

export const hashStr = async (
  message: string,
  options: HashStrOptions
): Promise<string> => {
  const { algorithm = 'SHA-265', encoding = 'hexa' } = options;
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await globalThis.crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  if (encoding !== 'hexa') {
    throw new Error(`Unsupported encoding: ${encoding}`);
  }
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
};
