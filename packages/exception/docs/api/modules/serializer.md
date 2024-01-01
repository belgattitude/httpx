[@httpx/exception](../README.md) / serializer

# Module: serializer

## Table of contents

### Classes

- [SerializerError](../classes/serializer.SerializerError.md)

### Type Aliases

- [NativeError](serializer.md#nativeerror)
- [SerializableError](serializer.md#serializableerror)
- [SerializableHttpException](serializer.md#serializablehttpexception)
- [SerializableNonNativeError](serializer.md#serializablenonnativeerror)

### Functions

- [convertToSerializable](serializer.md#converttoserializable)
- [createFromSerializable](serializer.md#createfromserializable)
- [fromJson](serializer.md#fromjson)
- [toJson](serializer.md#tojson)

## Type Aliases

### NativeError

Ƭ **NativeError**: `Error` \| `EvalError` \| `RangeError` \| `ReferenceError` \| `SyntaxError` \| `TypeError` \| `URIError`

---

### SerializableError

Ƭ **SerializableError**: `DiscriminateSerializable`\<`"NativeError"`\>

---

### SerializableHttpException

Ƭ **SerializableHttpException**: `DiscriminateSerializable`\<`"HttpException"`\>

---

### SerializableNonNativeError

Ƭ **SerializableNonNativeError**: `DiscriminateSerializable`\<`"NonNativeError"`\>

## Functions

### convertToSerializable

▸ **convertToSerializable**(`e`): `Serializable`

Convert an Error, NativeError or any HttpException to
an object suitable for serialization (a serializable version).

#### Parameters

| Name | Type                                                                                                                                                            |
| :--- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `e`  | `Error` \| [`HttpException`](../classes/base.HttpException.md) \| `EvalError` \| `RangeError` \| `ReferenceError` \| `SyntaxError` \| `TypeError` \| `URIError` |

#### Returns

`Serializable`

**`Link`**

---

### createFromSerializable

▸ **createFromSerializable**(`payload`): `Error` \| [`HttpException`](../classes/base.HttpException.md) \| `EvalError` \| `RangeError` \| `ReferenceError` \| `SyntaxError` \| `TypeError` \| `URIError`

create an Error, NativeError or any HttpException from a
serializable representation

#### Parameters

| Name      | Type           |
| :-------- | :------------- |
| `payload` | `Serializable` |

#### Returns

`Error` \| [`HttpException`](../classes/base.HttpException.md) \| `EvalError` \| `RangeError` \| `ReferenceError` \| `SyntaxError` \| `TypeError` \| `URIError`

**`Link`**

---

### fromJson

▸ **fromJson**(`json`): `Error` \| [`HttpException`](../classes/base.HttpException.md) \| [`SerializerError`](../classes/serializer.SerializerError.md)

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `json` | `string` |

#### Returns

`Error` \| [`HttpException`](../classes/base.HttpException.md) \| [`SerializerError`](../classes/serializer.SerializerError.md)

---

### toJson

▸ **toJson**(`exception`): `string`

#### Parameters

| Name        | Type                                                                                                                                                            |
| :---------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `exception` | `Error` \| [`HttpException`](../classes/base.HttpException.md) \| `EvalError` \| `RangeError` \| `ReferenceError` \| `SyntaxError` \| `TypeError` \| `URIError` |

#### Returns

`string`
