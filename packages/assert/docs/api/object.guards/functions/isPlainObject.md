[**@httpx/assert v0.16.2**](../../README.md)

***

[@httpx/assert](../../README.md) / [object.guards](../README.md) / isPlainObject

# Function: isPlainObject()

> **isPlainObject**\<`TValue`\>(`v`): `v is TValue extends DefaultBasePlainObject ? BasePlainObject : PlainObject<TValue>`

Defined in: [object.guards.ts:96](https://github.com/belgattitude/httpx/blob/7682ae8e8bf25ac4dbe7ea6b3b3dbe40b897e70c/packages/assert/src/object.guards.ts#L96)

Check if a value is a plain object

A plain object is a basic JavaScript object, such as {}, { data: [] }, new Object() or Object.create(null).

## Type Parameters

### TValue

`TValue` *extends* [`BasePlainObject`](../../object.internal.types/type-aliases/BasePlainObject.md) = [`DefaultBasePlainObject`](../../object.internal.types/interfaces/DefaultBasePlainObject.md)

## Parameters

### v

`unknown`

## Returns

`v is TValue extends DefaultBasePlainObject ? BasePlainObject : PlainObject<TValue>`

## Example

```typescript
import { isPlainObject } from '@httpx/plain-object';

// ✅👇 True

isPlainObject({ });                       // ✅
isPlainObject({ key: 'value' });          // ✅
isPlainObject({ key: new Date() });       // ✅
isPlainObject(new Object());              // ✅
isPlainObject(Object.create(null));       // ✅
isPlainObject({ nested: { key: true} });  // ✅
isPlainObject(new Proxy({}, {}));         // ✅
isPlainObject({ [Symbol('tag')]: 'A' });  // ✅

// ✅👇 (node context, workers, ...)
const runInNewContext = await import('node:vm').then(
    (mod) => mod.runInNewContext
);
isPlainObject(runInNewContext('({})'));   // ✅

// ❌👇 False

class Test { };
isPlainObject(new Test())           // ❌
isPlainObject(10);                  // ❌
isPlainObject(null);                // ❌
isPlainObject('hello');             // ❌
isPlainObject([]);                  // ❌
isPlainObject(new Date());          // ❌
isPlainObject(new Uint8Array([1])); // ❌
isPlainObject(Buffer.from('ABC'));  // ❌
isPlainObject(Promise.resolve({})); // ❌
isPlainObject(Object.create({}));   // ❌
isPlainObject(new (class Cls {}));  // ❌
isPlainObject(globalThis);          // ❌,
```

// ✅👇 Note that static built-in classes are treated as plain objects
//    check for `isStaticBuiltInClass` to exclude if needed

isPlainObject(Math);                // ✅
isPlainObject(JSON);                // ✅
isPlainObject(Atomics);             // ✅
