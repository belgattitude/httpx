const splitCapsRegexp = /[A-Z]/g;
/**
 * Return default message based on http exception className
 * @internal
 */

export const getMsgFromCls = (className: string) => {
  const preserveName =
    className.endsWith('Exception') || className === 'HttpVersionNotSupported';
  return (preserveName ? className : className.slice(4))
    .replaceAll(splitCapsRegexp, (match) => ` ${match}`)
    .trim()
    .split(' ')
    .map((word, idx) => (idx === 0 ? word : word.toLowerCase()))
    .join(' ');
};
