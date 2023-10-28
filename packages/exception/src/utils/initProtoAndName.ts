import type { HttpException } from '../base';

export const initProtoAndName = (
  obj: HttpException,
  cls: { prototype: object; name: string }
) => {
  Object.setPrototypeOf(obj, cls.prototype);
  obj.name = cls.name;
};
