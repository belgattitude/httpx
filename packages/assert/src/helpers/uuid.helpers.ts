import type { UuidVersionOrNumber } from '../types/uuid.types';
import { uuidSupportedVersions } from '../utils/uuid.utils';

/**
 * Adapted from https://github.com/uuidjs/uuid/blob/main/src/version.js
 */
export const getUuidVersion = (uuid: string): UuidVersionOrNumber | false => {
  if (typeof uuid !== 'string') {
    return false;
  }
  const v = Number.parseInt(uuid.slice(14, 15), 16);
  if (uuidSupportedVersions.has(v)) {
    return v;
  }
  return false;
};
