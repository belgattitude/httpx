import type { HttpException } from "../base/HttpException";
import { addBrand } from "./brand";

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
  addBrand(obj, obj.name);
};
