import type { HttpException } from '../base';

/**
 * @internal
 */
export const initProtoAndName = (
  obj: HttpException | Error,
  cls: { name: string; prototype: object }
) => {
  Object.setPrototypeOf(obj, cls.prototype);
  obj.name = cls.name;
};
