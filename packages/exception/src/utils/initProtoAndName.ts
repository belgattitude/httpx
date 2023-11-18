import type { HttpException } from '../base';

export const initProtoAndName = (
  obj: HttpException,
  cls: { name: string; prototype: object }
) => {
  Object.setPrototypeOf(obj, cls.prototype);
  obj.name = cls.name;
};
