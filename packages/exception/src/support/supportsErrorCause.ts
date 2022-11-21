export const supportsErrorCause = () => {
  const cause = Symbol('');
  return new Error('', { cause })?.cause === cause;
};
