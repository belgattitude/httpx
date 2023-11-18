export const supportsErrorCause = () => {
  const cause = Symbol('');
  // eslint-disable-next-line unicorn/error-message
  return new Error('', { cause })?.cause === cause;
};
