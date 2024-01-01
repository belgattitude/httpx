[@httpx/json-api - v0.5.9](../README.md) / JsonApiResponseFactory

# Class: JsonApiResponseFactory

## Table of contents

### Constructors

- [constructor](JsonApiResponseFactory.md#constructor)

### Methods

- [fromError](JsonApiResponseFactory.md#fromerror)
- [fromSuccess](JsonApiResponseFactory.md#fromsuccess)

## Constructors

### constructor

• **new JsonApiResponseFactory**(): [`JsonApiResponseFactory`](JsonApiResponseFactory.md)

#### Returns

[`JsonApiResponseFactory`](JsonApiResponseFactory.md)

## Methods

### fromError

▸ **fromError**(`errors`, `httpStatus?`): [`JsonApiErrorResponse`](../README.md#jsonapierrorresponse)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `errors` | `string` \| [`JsonApiError`](../README.md#jsonapierror) \| [`JsonApiError`](../README.md#jsonapierror)[] | - |
| `httpStatus?` | `number` | fallback http status if not present in JsonApiError |

#### Returns

[`JsonApiErrorResponse`](../README.md#jsonapierrorresponse)

___

### fromSuccess

▸ **fromSuccess**\<`T`\>(`data`, `metadata?`): [`JsonApiSuccessResponse`](../README.md#jsonapisuccessresponse)\<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `T` |
| `metadata?` | \{ `cacheHit?`: `boolean`  } & `Record`\<`string`, `string` \| `number` \| `boolean` \| `Record`\<`string`, `unknown`\>\> |

#### Returns

[`JsonApiSuccessResponse`](../README.md#jsonapisuccessresponse)\<`T`\>
