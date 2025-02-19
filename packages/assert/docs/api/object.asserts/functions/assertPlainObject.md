[**@httpx/assert v0.15.2**](../../README.md)

***

[@httpx/assert](../../README.md) / [object.asserts](../README.md) / assertPlainObject

# Function: assertPlainObject()

> **assertPlainObject**\<`TValue`\>(`v`, `msgOrErrorFactory`?): `asserts v is TValue extends DefaultBasePlainObject ? BasePlainObject : PlainObject<TValue>`

Defined in: [object.asserts.ts:45](https://github.com/belgattitude/httpx/blob/d975bb2c60098569db690fb567053dfa3514ae29/packages/assert/src/object.asserts.ts#L45)

Assert a value is a plain object

## Type Parameters

• **TValue** *extends* [`BasePlainObject`](../../object.internal.types/type-aliases/BasePlainObject.md) = [`DefaultBasePlainObject`](../../object.internal.types/interfaces/DefaultBasePlainObject.md)

## Parameters

### v

`unknown`

### msgOrErrorFactory?

`MsgOrErrorFactory`

## Returns

`asserts v is TValue extends DefaultBasePlainObject ? BasePlainObject : PlainObject<TValue>`

## Example

```typescript
import { assertPlainObject } from '@httpx/plain-object';
import type { PlainObject } from '@httpx/plain-object';

function fn(value: unknown) {

    // 👇 Throws `new TypeError('Not a plain object')` if not a plain object
    assertPlainObject(value);

    // 👇 Throws `new TypeError('Custom message')` if not a plain object
    assertPlainObject(value, 'Custom message');

    // 👇 Throws custom error if not a plain object
    assertPlainObject(value, () => {
        throw new HttpBadRequest('Custom message');
    });

    return value;
}

try {
    const value = fn({ key: 'value' });
    // ✅ Value is known to be PlainObject<unknown>
    assertType<PlainObject>(value);
} catch (error) {
    console.error(error);
}
```

## Throws

TypeError
