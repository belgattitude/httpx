import type { UuidVersion } from '../types';

const pfx = 'Not a valid';
export const errorMessages = {
  ean13: `${pfx} ean13 barcode`,
  plainObject: `${pfx} plainObject`,
  strNotEmpty: `Not a string or empty`,
  uuid: (version?: UuidVersion | undefined) =>
    [`${pfx} uuid`, version === undefined ? undefined : `v${version}`]
      .filter(Boolean)
      .join(' '),
} as const;
