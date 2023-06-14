const splitCapsRegexp = /[A-Z]/g;
/**
 * Return default message based on http exception className
 * @internal
 */
export const getMsgFromCls = (className: string) => {
  return className
    .replace(splitCapsRegexp, (match) => ` ${match}`)
    .trim()
    .split(' ')
    .map((word, idx) => (idx === 0 ? word : word.toLowerCase()))
    .join(' ');
};
