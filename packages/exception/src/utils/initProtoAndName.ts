import type { HttpException } from '../base/HttpException';

/**
 * @internal
 */
export const initProtoAndName = (
  obj: HttpException | Error,
  name: string,
  cls: { prototype: object }
) => {
  Object.setPrototypeOf(obj, cls.prototype);
  obj.name = `Http${name}`;
};
