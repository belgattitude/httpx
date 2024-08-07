[**@httpx/assert v0.12.3**](../../README.md) • **Docs**

***

[@httpx/assert v0.12.3](../../README.md) / [object.guards](../README.md) / isPlainObject

# Function: isPlainObject()

> **isPlainObject**\<`TValue`\>(`v`): `v is TValue extends UnspecifiedPlainObjectType ? BasePlainObject : PlainObject<TValue>`

Check if a value is a plain object

An object is plain if it's created by either {}, new Object(), or Object.create(null).

## Type Parameters

• **TValue** *extends* `Record`\<`string`, `unknown`\> = [`UnspecifiedPlainObjectType`](../../object.internal.types/type-aliases/UnspecifiedPlainObjectType.md)

## Parameters

• **v**: `unknown`

## Returns

`v is TValue extends UnspecifiedPlainObjectType ? BasePlainObject : PlainObject<TValue>`

## Example

```typescript
isPlainObject({ key: 'value' });       // 👈 ✅ true
isPlainObject({ key: new Date() });    // 👈 ✅ true
isPlainObject(new Object());           // 👈 ✅ true
isPlainObject(Object.create(null));    // 👈 ✅ true
isPlainObject({nested: { key: true} }  // 👈 ✅ true

class Test { };

isPlainObject(new Test())              // 👈 ❌ false
isPlainObject(10);                     // 👈 ❌ false
isPlainObject(null);                   // 👈 ❌ false
isPlainObject('hello');                // 👈 ❌ false
isPlainObject([]);                     // 👈 ❌ false
isPlainObject(new Date());             // 👈 ❌ false
isPlainObject(Math);                   // 👈 ❌ false
(...)

## Defined in

[object.guards.ts:31](https://github.com/belgattitude/httpx/blob/efdc4c7f5d90eb963a8ba204526e9494bbd080b8/packages/assert/src/object.guards.ts#L31)
