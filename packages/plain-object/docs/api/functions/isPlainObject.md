[**@httpx/plain-object v1.1.0**](../README.md) • **Docs**

***

[@httpx/plain-object v1.1.0](../README.md) / isPlainObject

# Function: isPlainObject()

> **isPlainObject**\<`TValue`\>(`v`): `v is TValue extends DefaultBasePlainObject ? BasePlainObject : PlainObject<TValue>`

Check if a value is a plain object

An object is plain if it's created by either {}, new Object(), or Object.create(null).

## Type Parameters

• **TValue** *extends* `BasePlainObject` = `DefaultBasePlainObject`

## Parameters

• **v**: `unknown`

## Returns

`v is TValue extends DefaultBasePlainObject ? BasePlainObject : PlainObject<TValue>`

## Example

```typescript
import { isPlainObject } from '@httpx/plain-object';

// ✅👇 True

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
isPlainObject(Math);                // ❌ Static built-in classes
isPlainObject(Promise.resolve({})); // ❌
isPlainObject(Object.create({}));   // ❌
```
