const innerCapsRegexp = /\B[A-Z]/g;
/**
 * Return default message based on http exception className
 * @internal
 */
export const getMsgFromCls = (className: string) =>
  (className.endsWith("Exception") || className === "HttpVersionNotSupported"
    ? className
    : className.slice(4)
  ).replaceAll(innerCapsRegexp, (match) => ` ${match.toLowerCase()}`);
