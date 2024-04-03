/**
 * Taken from https://github.com/uuidjs/uuid/blob/main/src/regex.js
 */
export const uuidRegexp =
  /^(?:[\da-f]{8}-[\da-f]{4}-[1-5][\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}|0{8}-(?:0{4}-){3}0{12})$/i;

export const uuidSupportedVersions = new Set([1, 3, 4, 5, 7]);
