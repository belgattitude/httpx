import { getUuidVersion } from './uuid.helpers';
import type {
  Uuid,
  UuidV1,
  UuidV3,
  UuidV4,
  UuidV5,
  UuidVersion,
} from './uuid.types';
import { uuidRegexp, uuidSupportedVersions } from './uuid.utils';

/**
 * Check whether a value is a valid uuid integer supported version
 */
export const isUuidVersion = (v: unknown): v is UuidVersion => {
  return typeof v === 'number' && uuidSupportedVersions.has(v);
};

/**
 * Check whether a value is string and passes uuid validation with
 * optional given version
 * @param v
 * @param version
 */
export const isUuid = (v: unknown, version?: UuidVersion): v is Uuid => {
  return (
    typeof v === 'string' &&
    uuidRegexp.test(v) &&
    (version === undefined || getUuidVersion(v) === version)
  );
};

export const isUuidV1 = (v: unknown): v is UuidV1 => isUuid(v, 1);

export const isUuidV3 = (v: unknown): v is UuidV3 => isUuid(v, 3);
export const isUuidV4 = (v: unknown): v is UuidV4 => isUuid(v, 4);
export const isUuidV5 = (v: unknown): v is UuidV5 => isUuid(v, 5);
