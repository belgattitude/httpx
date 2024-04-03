import type { UuidVersion } from './uuid.types';
import { uuidSupportedVersions } from './uuid.utils';

/**
 * Adapted from https://github.com/uuidjs/uuid/blob/main/src/version.js
 */
export const getUuidVersion = (uuid: string): UuidVersion | false => {
  if (typeof uuid !== 'string') {
    return false;
  }
  const v = Number.parseInt(uuid.slice(14, 15), 16);
  if (uuidSupportedVersions.has(v)) {
    return v as UuidVersion;
  }
  return false;
};
