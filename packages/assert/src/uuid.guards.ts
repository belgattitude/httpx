import { getUuidVersion } from './uuid.helpers';
import type {
  Uuid,
  UuidV1,
  UuidV3,
  UuidV4,
  UuidV5,
  UuidV7,
  UuidVersion,
} from './uuid.types';
import { uuidRegexp, uuidSupportedVersions } from './uuid.utils';

/**
 * Check if a value is a valid uuid version: 1, 3, 4 or 5
 */
export const isUuidVersion = (v: unknown): v is UuidVersion => {
  return typeof v === 'number' && uuidSupportedVersions.has(v);
};

/**
 * Check whether a value is string and passes uuid validation with
 * optional given version
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
export const isUuidV7 = (v: unknown): v is UuidV7 => isUuid(v, 7);
