/**
 * Type representing static built-in classes in JavaScript, such as Math, JSON, and Atomics
 */
export type StaticBuiltInClass = typeof Math | typeof JSON | typeof Atomics;

/**
 * Type excluding static built-in classes, such as Math, JSON, and Atomics
 */
export type WithoutStaticBuiltInClass<T> = T extends StaticBuiltInClass
  ? never
  : T;
