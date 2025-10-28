// Taken from immer 4.2.0

const objectCtorString = Object.prototype.constructor.toString();
const cachedCtorStrings = new WeakMap();

export function immerIsPlainObject(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const proto = Object.getPrototypeOf(value);
  if (proto === null || proto === Object.prototype) return true;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const Ctor =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    Object.hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  if (Ctor === Object) return true;

  if (typeof Ctor !== 'function') return false;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument
  let ctorString = cachedCtorStrings.get(Ctor);
  if (ctorString === undefined) {
    ctorString = Function.toString.call(Ctor);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    cachedCtorStrings.set(Ctor, ctorString);
  }

  return ctorString === objectCtorString;
}
